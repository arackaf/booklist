// See https://kit.svelte.dev/docs/types#app for information about these interfaces and what to do when importing types

import { DefaultSession } from "@auth/core";

declare module "@auth/core/types" {
  interface Session {
    userId: string;
    legacySync: boolean;
    user: DefaultSession["user"];
  }
}

declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}
