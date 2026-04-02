export const BOT_CONFIG = {
  prefix: ".",
  ownerNumber: process.env["OWNER_NUMBER"] ?? "",
  botName: process.env["BOT_NAME"] ?? "WhatsBot",
  sessionDir: "./session",
};

export let isPublicMode = false;

export function setPublicMode(mode: boolean) {
  isPublicMode = mode;
}
