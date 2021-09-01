<script lang="ts">
  import { quadOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  import slideAnimate from "app/animationHelpers";
  import FlowItems from "app/components/layout/FlowItems.svelte";

  import ScanResults from "./ScanResults.svelte";
  import BookEntryItem from "./BookEntryItem.svelte";
  import ajaxUtil from "util/ajaxUtil";
  import { getLoginStatus } from "util/loginStatus";

  let manuallyEnterBook = () => {};
  let showScanInstructions = false;

  let focused = 0;
  let selected = null;

  const entryFinished = index => {
    if (index < 9) {
      focused = index + 1;
      selected = index + 1;
    } else {
      focused = 0;
      selected = 0;
    }
  };
</script>

<section transition:fade={{ duration: 150, easing: quadOut }}>
  <FlowItems pushLast={true} xsFlowReverse={true}>
    <div style="flex: 1">
      <div style="display: flex; align-items: center">
        <h4 style="margin-top: 0; margin-bottom: 0; font-size: 16px">
          Enter your books here
          <a on:click={() => (showScanInstructions = !showScanInstructions)}> <i class="fa fa-question-circle" /> </a>
        </h4>
        <button class="btn btn-xs margin-left" onClick={() => manuallyEnterBook()}> Manual entry </button>
        <button
          class="btn btn-xs margin-left"
          on:click={() => {
            const wait = ms => new Promise(res => setTimeout(res, ms));
            (async function () {
              const delay = 250;
              for (let i = 0; i < 1; i++) {
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0198788606", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780618918249", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9798577932152", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "039330700X", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780393308181", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "334455", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0142003344", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0465072704", ...getLoginStatus() });
                await wait(delay);
              }
            })();
          }}
        >
          TEST
        </button>
      </div>
      <div style="margin-top: 10px">
        <div>
          <div use:slideAnimate={{ open: showScanInstructions, fade: true }} class="card card-info card-slim" style="width: 80%">
            <div>
              Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to search for each
              book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
              <br />
              <br />
              After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of books with a
              barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else they may get overridden.
            </div>
          </div>
        </div>
      </div>
      <br />

      {#each Array.from({ length: 10 }) as _, idx}
        <div>
          <BookEntryItem
            on:focus={() => (focused = idx)}
            focused={idx == focused}
            selected={idx == selected}
            entryFinished={() => entryFinished(idx)}
          />
        </div>
      {/each}
    </div>
    <ScanResults />
  </FlowItems>
</section>
