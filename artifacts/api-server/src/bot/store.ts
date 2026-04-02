interface DeletedMessage {
  from: string;
  sender: string;
  text: string;
  timestamp: number;
  mediaType?: string;
}

interface ConversationMessage {
  role: "user" | "bot";
  text: string;
}

const deletedMessages: DeletedMessage[] = [];
const conversationHistory: Map<string, ConversationMessage[]> = new Map();
const startTime = Date.now();

export function addDeletedMessage(msg: DeletedMessage) {
  deletedMessages.unshift(msg);
  if (deletedMessages.length > 100) deletedMessages.pop();
}

export function getDeletedMessages() {
  return [...deletedMessages];
}

export function getUptime(): string {
  const ms = Date.now() - startTime;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000) % 24;
  const days = Math.floor(ms / 86400000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function getConversationHistory(jid: string): ConversationMessage[] {
  if (!conversationHistory.has(jid)) {
    conversationHistory.set(jid, []);
  }
  return conversationHistory.get(jid)!;
}

export function addToConversation(jid: string, role: "user" | "bot", text: string) {
  const history = getConversationHistory(jid);
  history.push({ role, text });
  if (history.length > 20) history.shift();
}

export function clearConversation(jid: string) {
  conversationHistory.delete(jid);
}
