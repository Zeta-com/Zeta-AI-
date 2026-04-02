const truths = [
  "What is the most embarrassing thing you've ever done?",
  "What is your biggest fear?",
  "Have you ever lied to your best friend?",
  "What is the worst gift you've ever received?",
  "Have you ever cheated on a test?",
  "What is your biggest insecurity?",
  "Have you ever had a crush on a friend's partner?",
  "What is the most childish thing you still do?",
  "Have you ever talked behind someone's back?",
  "What is something you've never told anyone?",
  "What is the weirdest dream you've ever had?",
  "Have you ever broken someone's heart?",
];

const dares = [
  "Send a voice note singing your favorite song for 10 seconds",
  "Change your profile picture to a funny face for 30 minutes",
  "Send the last photo in your gallery",
  "Text someone you haven't spoken to in a year",
  "Send a funny selfie",
  "Write a short poem about the group",
  "Share your most embarrassing screenshot",
  "Do 10 push-ups and send a voice note counting them",
  "Tell a joke and make it funny",
  "Send your best cooking photo",
];

export function getTruth(): string {
  const idx = Math.floor(Math.random() * truths.length);
  return `🔮 *TRUTH:*\n\n${truths[idx]}`;
}

export function getDare(): string {
  const idx = Math.floor(Math.random() * dares.length);
  return `🎲 *DARE:*\n\n${dares[idx]}`;
}

export function getTruthOrDare(): string {
  const random = Math.random();
  if (random < 0.5) {
    return getTruth();
  } else {
    return getDare();
  }
}
