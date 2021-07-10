import ajaxUtil from "./ajaxUtil";
import localStorageManager from "./localStorage";
import { getCookieLookup } from "./loginStatus";

let ws;
let open = false;
const handlerQueue = [];
const initialMessageQueue = [];

export const scanWebSocket = {
  open() {
    ws = new WebSocket(process.env.SCAN_WS);

    ws.onopen = () => {
      open = true;
      console.log("IS OPEN");

      initialMessageQueue.forEach(packet => this.send(packet));
      initialMessageQueue.length = 0;
    };

    ws.onmessage = ({ data }) => {
      handlerQueue.forEach(handler => handler(data));
    };
  },
  addHandler(handler) {
    handlerQueue.push(handler);
  },
  send(packet) {
    if (open) {
      ws.send(JSON.stringify(packet));
    } else {
      initialMessageQueue.push(packet);
    }
  }
};

const SCAN_PENDING_COUNT = "book-scan-pending-count";

export function saveScanPendingCount(count) {
  localStorageManager.set(SCAN_PENDING_COUNT, count);
}

export function getScanPendingCount(): number {
  return parseInt(localStorageManager.get(SCAN_PENDING_COUNT), 10);
}

export async function checkPendingCount() {
  const cookieHash = getCookieLookup();

  const pendingCountResult = await ajaxUtil.getWithCors(process.env.CHECK_SCAN_STATUS, {
    userId: cookieHash.userId,
    loginToken: cookieHash.loginToken
  });
  if (pendingCountResult?.pendingCount == null) {
    return;
  }

  const { pendingCount } = pendingCountResult;
  saveScanPendingCount(pendingCountResult.pendingCount);
  dispatchScanDataUpdate({ pendingCount });
}

export function dispatchScanDataUpdate(packet) {
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { ...packet } }));
}
