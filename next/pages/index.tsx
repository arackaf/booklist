import React from "react";

import { useSession, signIn, signOut } from "next-auth/react";

import styles from "../styles/Home.module.css";

export default function Home(props, xxx) {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      {!session ? (
        <main className={styles.main}>
          Hello World!!!
          <br />
          <button onClick={() => signIn()}>Sign in</button>
          <button onClick={() => fetch("/api/hello")}>Hit endpoint</button>
        </main>
      ) : (
        <main className={styles.main}>
          Welcome, user!
          <button onClick={() => signOut()}>Sign out</button>
          <button onClick={() => fetch("/api/hello")}>Hit endpoint</button>
        </main>
      )}
    </div>
  );
}
