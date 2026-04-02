const triviaQuestions = [
  { q: "What is the capital of France?", a: "paris" },
  { q: "How many sides does a hexagon have?", a: "6" },
  { q: "What planet is known as the Red Planet?", a: "mars" },
  { q: "Who wrote Romeo and Juliet?", a: "shakespeare" },
  { q: "What is the largest ocean on Earth?", a: "pacific" },
  { q: "What is the chemical symbol for gold?", a: "au" },
  { q: "How many continents are there on Earth?", a: "7" },
  { q: "What is the fastest land animal?", a: "cheetah" },
  { q: "Who painted the Mona Lisa?", a: "da vinci" },
  { q: "What is the square root of 144?", a: "12" },
  { q: "Which country invented pizza?", a: "italy" },
  { q: "What gas do plants absorb from the air?", a: "carbon dioxide" },
  { q: "How many strings does a standard guitar have?", a: "6" },
  { q: "What is the longest river in the world?", a: "nile" },
  { q: "Which planet has the most moons?", a: "saturn" },
];

interface TriviaSession {
  question: string;
  answer: string;
  startTime: number;
}

const activeSessions = new Map<string, TriviaSession>();

export function startTrivia(jid: string): string {
  const idx = Math.floor(Math.random() * triviaQuestions.length);
  const item = triviaQuestions[idx];
  activeSessions.set(jid, {
    question: item.q,
    answer: item.a,
    startTime: Date.now(),
  });
  return `🎯 *TRIVIA TIME!*\n\n${item.q}\n\n_Reply with your answer! You have 30 seconds._`;
}

export function checkTriviaAnswer(jid: string, answer: string): string | null {
  const session = activeSessions.get(jid);
  if (!session) return null;

  const elapsed = Date.now() - session.startTime;
  if (elapsed > 30000) {
    activeSessions.delete(jid);
    return `⏰ Time's up! The answer was *${session.answer}*.\nType *.trivia* to play again!`;
  }

  if (answer.toLowerCase().trim().includes(session.answer.toLowerCase())) {
    activeSessions.delete(jid);
    return `✅ *Correct!* Well done! 🎉\nThe answer was *${session.answer}*.\nType *.trivia* to play again!`;
  }

  return `❌ *Wrong!* Try again or type *.skip* to skip.\n_Hint: The answer starts with "${session.answer[0].toUpperCase()}"_`;
}

export function skipTrivia(jid: string): string {
  const session = activeSessions.get(jid);
  if (!session) return "No active trivia session. Type *.trivia* to start!";
  activeSessions.delete(jid);
  return `Skipped! The answer was *${session.answer}*.\nType *.trivia* to play again!`;
}

export function hasActiveTrivia(jid: string): boolean {
  return activeSessions.has(jid);
}
