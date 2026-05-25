export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Which brokers are compatible with QauntraBot EAs?",
    a: "QauntraBot operates on any MT4 or MT5 broker that supports automated trading. We recommend ECN/STP brokers with raw spreads and low latency.",
  },
  {
    q: "How is the license delivered after purchase?",
    a: "Immediately after payment, your license key and hardware-locked EA file are delivered to your email. Setup is typically complete within 15 minutes.",
  },
  {
    q: "Do I need to run the EA on my own computer 24/7?",
    a: "No. QauntraBot is designed for VPS deployment, ensuring continuous operation independent of your personal machine.",
  },
  {
    q: "Are the performance statistics live or backtested?",
    a: "All published statistics are from live trading accounts, verifiable via MyFxBook tracking links.",
  },
  {
    q: "What is the drawdown, and how is it managed?",
    a: "Maximum drawdown varies by strategy (8.7%–15.1% historically). Each strategy has configurable hard drawdown limits.",
  },
  {
    q: "Can I change the license to a different account number?",
    a: "License transfers are supported up to twice per calendar year at no charge. Institutional holders receive unrestricted transfers.",
  },
  {
    q: "What happens if the EA stops working after a broker update?",
    a: "All active licenses receive build updates via email. Critical fixes are deployed within 24 hours.",
  },
  {
    q: "Is there a trial period or demo version available?",
    a: "We offer a 7-day money-back guarantee. Starter and Pro licenses include demo-account mode.",
  },
];
