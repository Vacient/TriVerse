import "./globals.css";
import "./dashboard.css";
import "./print.css";

export const metadata = {
  title: "TriVerse — AI-Powered Travel Agent | Plan less. Travel more.",
  description:
    "Your autonomous AI travel agent plans, tracks, and adapts your entire journey around your budget.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6C4CF1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
