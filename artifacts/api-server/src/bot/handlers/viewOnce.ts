import type { WASocket, WAMessage } from "@whiskeysockets/baileys";
import { BOT_CONFIG } from "../config.js";
import { logger } from "../../lib/logger.js";

export async function handleViewOnce(sock: WASocket, msg: WAMessage) {
  const ownerJid = BOT_CONFIG.ownerNumber
    ? `${BOT_CONFIG.ownerNumber}@s.whatsapp.net`
    : null;

  if (!ownerJid) {
    logger.warn("OWNER_NUMBER not set — cannot forward view-once media");
    return;
  }

  const from = msg.key.remoteJid ?? "";
  const sender = msg.key.participant ?? msg.key.remoteJid ?? "";
  const senderName = sender.split("@")[0] ?? "Unknown";

  const viewOnceMsg =
    msg.message?.viewOnceMessage?.message ??
    msg.message?.viewOnceMessageV2?.message ??
    msg.message?.viewOnceMessageV2Extension?.message;

  if (!viewOnceMsg) return;

  const isGroup = from.endsWith("@g.us");
  const locationInfo = isGroup ? `📍 Group: ${from}` : "📍 Private Chat";

  const headerText = `👁️ *View-Once Message Captured!*\n\n👤 *Sender:* ${senderName}\n${locationInfo}\n⏰ *Time:* ${new Date().toLocaleString()}\n\n`;

  try {
    if (viewOnceMsg.imageMessage) {
      await sock.sendMessage(ownerJid, { text: headerText });
      await sock.sendMessage(ownerJid, {
        image: { url: "" },
        caption: viewOnceMsg.imageMessage.caption ?? "View-once image",
        ...viewOnceMsg,
      });
    } else if (viewOnceMsg.videoMessage) {
      await sock.sendMessage(ownerJid, { text: headerText });
      await sock.sendMessage(ownerJid, {
        video: { url: "" },
        caption: viewOnceMsg.videoMessage.caption ?? "View-once video",
        ...viewOnceMsg,
      });
    } else {
      await sock.sendMessage(ownerJid, {
        text: headerText + "📎 View-once media received (type not fully supported).",
      });
    }
  } catch (err) {
    logger.error({ err }, "Failed to forward view-once message to owner");
    try {
      await sock.sendMessage(ownerJid, {
        text: `${headerText}⚠️ A view-once message was detected from *${senderName}* but could not be fully forwarded. This can happen due to encryption limitations.`,
      });
    } catch {
      // Silently fail if we can't even send the error notification
    }
  }
}
