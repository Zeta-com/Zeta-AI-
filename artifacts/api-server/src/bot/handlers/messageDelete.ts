import type { WASocket, WAMessage, proto } from "@whiskeysockets/baileys";
import { addDeletedMessage } from "../store.js";
import { BOT_CONFIG } from "../config.js";
import { logger } from "../../lib/logger.js";

const messageCache = new Map<string, WAMessage>();

export function cacheMessage(msg: WAMessage) {
  const id = msg.key.id;
  if (!id) return;
  messageCache.set(id, msg);
  if (messageCache.size > 500) {
    const firstKey = messageCache.keys().next().value;
    if (firstKey) messageCache.delete(firstKey);
  }
}

export async function handleDeletedMessage(
  sock: WASocket,
  update: { keys: proto.IMessageKey[] }
) {
  for (const key of update.keys) {
    const cached = key.id ? messageCache.get(key.id) : null;
    if (!cached) continue;

    const from = cached.key.remoteJid ?? "";
    const sender = cached.key.participant ?? cached.key.remoteJid ?? "";
    const senderName = sender.split("@")[0] ?? "Unknown";

    const text =
      cached.message?.conversation ??
      cached.message?.extendedTextMessage?.text ??
      "";

    let mediaType: string | undefined;
    if (cached.message?.imageMessage) mediaType = "image";
    else if (cached.message?.videoMessage) mediaType = "video";
    else if (cached.message?.audioMessage) mediaType = "audio";
    else if (cached.message?.documentMessage) mediaType = "document";
    else if (cached.message?.stickerMessage) mediaType = "sticker";

    addDeletedMessage({
      from,
      sender: senderName,
      text,
      timestamp: Date.now(),
      mediaType,
    });

    const ownerJid = BOT_CONFIG.ownerNumber
      ? `${BOT_CONFIG.ownerNumber}@s.whatsapp.net`
      : null;

    if (!ownerJid) {
      logger.warn("OWNER_NUMBER not set — cannot forward deleted messages");
      return;
    }

    const isGroup = from.endsWith("@g.us");
    const locationInfo = isGroup ? `📍 Group: ${from}` : "📍 Private Chat";

    let notifText = `🗑️ *Deleted Message Alert!*\n\n👤 *Sender:* ${senderName}\n${locationInfo}\n⏰ *Time:* ${new Date().toLocaleString()}\n\n`;

    if (text) {
      notifText += `💬 *Message:*\n"${text}"`;
    } else if (mediaType) {
      notifText += `📎 *Content:* ${mediaType} (media files cannot be recovered after deletion)`;
    } else {
      notifText += `📎 *Content:* Unknown content`;
    }

    try {
      await sock.sendMessage(ownerJid, { text: notifText });

      if (cached.message?.imageMessage || cached.message?.videoMessage) {
        await sock.sendMessage(ownerJid, {
          text: `⚠️ Note: The deleted message contained media (${mediaType}). WhatsApp does not allow recovering view-once or deleted media after deletion.`,
        });
      }
    } catch (err) {
      logger.error({ err }, "Failed to forward deleted message to owner");
    }
  }
}
