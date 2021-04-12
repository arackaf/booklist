<script lang="ts">
  let ws;

  function connect() {
    ws = new WebSocket("wss://08k4tjaorc.execute-api.us-east-1.amazonaws.com/dev");
    ws.onopen = () => {
      console.log("OPEN");
    };

    ws.onmessage = ({ data }) => {
      console.log("DATA!!!", data);
    };

    setTimeout(() => {
      ws.send(`{ action: "foo" }`);
    }, 2000);

    setTimeout(() => {
      console.log("---");
      ws.send(`{ action: "foo" }`);
    }, 4000);

    setTimeout(() => {
      console.log("---");
      ws.send(`{ action: "foo" }`);
    }, 6000);
  }
</script>

<h1>Hello World!</h1>

<button on:click={connect}>Connect</button>
