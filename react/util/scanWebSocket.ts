let ws;
let open = false;
const handlerQueue = [];
const initialMessageQueue = [];

export default {
  open() {
    ws = new WebSocket(process.env.SCAN_WS);

    ws.onopen = () => {
      open = true;
      console.log("IS OPEN");

      initialMessageQueue.forEach(packet => this.send(packet));
      initialMessageQueue.length = 0;
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
