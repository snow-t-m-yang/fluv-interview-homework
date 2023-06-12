import "./globals.css";

export const metadata = {
  title: "Todo List",
  description: "Built by Snow Yang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
