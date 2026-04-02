import { Router, type IRouter } from "express";
import { getUptime, getDeletedMessages } from "../bot/store.js";
import { isPublicMode, BOT_CONFIG } from "../bot/config.js";

const router: IRouter = Router();

router.get("/bot/status", (_req, res) => {
  res.json({
    name: BOT_CONFIG.botName,
    online: true,
    uptime: getUptime(),
    mode: isPublicMode ? "public" : "private",
    prefix: BOT_CONFIG.prefix,
    ownerConfigured: !!BOT_CONFIG.ownerNumber,
  });
});

router.get("/bot/deleted", (_req, res) => {
  res.json({ messages: getDeletedMessages() });
});

export default router;
