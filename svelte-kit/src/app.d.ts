// See https://kit.svelte.dev/docs/types#app for information about these interfaces and what to do when importing types

import type { ScanWebSocketManage } from "$lib/util/scanUtils";
import { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    userId: string;
    provider: string;
    legacySync: boolean;
    user: DefaultSession["user"];
  }
}

declare global {
  interface Window {
    ws: ScanWebSocketManage;
  }
}
