import React from "react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import { useSession, signIn, signOut } from "next-auth/react";

import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
  return {
    props: {
      x: 12,
      session: await unstable_getServerSession(context.req, context.res, authOptions)
    }
  };
}

export default function Home(props, xxx) {
  const { data: session } = useSession();

  console.log("client", { session });
  console.log("client ssr", props, xxx);

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
