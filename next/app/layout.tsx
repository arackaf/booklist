export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <h1>Layout root!</h1>
        {children}
      </body>
    </html>
  );
}
