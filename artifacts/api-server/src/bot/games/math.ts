interface MathSession {
  question: string;
  answer: number;
  startTime: number;
}

const activeSessions = new Map<string, MathSession>();

function generateQuestion(): { question: string; answer: number } {
  const ops = ["+", "-", "*"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 100) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case "*":
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
  }

  return { question: `${a} ${op} ${b}`, answer };
}

export function startMath(jid: string): string {
  const { question, answer } = generateQuestion();
  activeSessions.set(jid, { question, answer, startTime: Date.now() });
  return `🧮 *MATH CHALLENGE!*\n\nWhat is: *${question}*\n\n_You have 20 seconds!_`;
}

export function checkMathAnswer(jid: string, answer: string): string | null {
  const session = activeSessions.get(jid);
  if (!session) return null;

  const elapsed = Date.now() - session.startTime;
  if (elapsed > 20000) {
    activeSessions.delete(jid);
    return `⏰ Time's up! The answer was *${session.answer}*.\nType *.math* to try again!`;
  }

  const num = Number(answer.trim());
  if (isNaN(num)) return null;

  if (num === session.answer) {
    const timeMs = Date.now() - session.startTime;
    activeSessions.delete(jid);
    return `✅ *Correct!* You got it in ${(timeMs / 1000).toFixed(1)}s! 🎉\nType *.math* to play again!`;
  }

  return `❌ *Wrong!* Try again. The question was: *${session.question}*`;
}

export function hasActiveMath(jid: string): boolean {
  return activeSessions.has(jid);
}
