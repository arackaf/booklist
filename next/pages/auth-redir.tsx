import React from "react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useSession, signIn, signOut } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";

import styles from "../styles/Home.module.css";
import { Session } from "next-auth";

export const getServerSideProps: GetServerSideProps = async context => {
  const session2: Session = await unstable_getServerSession(context.req, context.res, authOptions);

  const session = (await unstable_getServerSession(context.req, context.res, authOptions)) as any;
  console.log({ session });
  if (!session?.userId) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
  }

  return {
    props: {}
  };
};

export default function Home() {
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
