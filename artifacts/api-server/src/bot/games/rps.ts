const choices = ["rock", "paper", "scissors"] as const;
type Choice = (typeof choices)[number];

const emoji: Record<Choice, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

function getWinner(player: Choice, bot: Choice): "player" | "bot" | "draw" {
  if (player === bot) return "draw";
  if (
    (player === "rock" && bot === "scissors") ||
    (player === "paper" && bot === "rock") ||
    (player === "scissors" && bot === "paper")
  ) {
    return "player";
  }
  return "bot";
}

export function playRPS(playerInput: string): string {
  const normalized = playerInput.toLowerCase().trim();
  const player = choices.find((c) => normalized.includes(c));

  if (!player) {
    return `❓ Please choose *rock*, *paper*, or *scissors*.\nExample: *.rps rock*`;
  }

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = getWinner(player, botChoice);

  let resultMsg = "";
  if (result === "player") resultMsg = "🎉 *You Win!*";
  else if (result === "bot") resultMsg = "🤖 *I Win!* Better luck next time!";
  else resultMsg = "🤝 *It's a Draw!*";

  return `🎮 *Rock Paper Scissors*\n\nYou: ${emoji[player]} ${player}\nMe: ${emoji[botChoice]} ${botChoice}\n\n${resultMsg}`;
}
