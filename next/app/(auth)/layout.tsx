export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("ON SERVER IN NESTED ROUTE");

  return (
    <section>
      <h1>Nested root!</h1>
      {children}
    </section>
  );
}
