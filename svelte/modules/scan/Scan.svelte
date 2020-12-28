<script lang="ts">
  import slideAnimate from "app/animationHelpers";

  import FlowItems from "app/components/layout/FlowItems.svelte";

  /*
          <SlideInContents opacity={true} in={showScanInstructions} style="width: 80%">
            </SlideInContents>
            
            */

  let entryList = [];
  let toggleInstructions = "";
  let manuallyEnterBook = () => {};
  let showScanInstructions = false;
</script>

<section>
  <FlowItems pushLast={true} xsFlowReverse={true}>
    <div style="flex: 1">
      <div style="display: flex; align-items: center">
        <h4 style="margin-top: 0; margin-bottom: 0; font-size: 16px">
          Enter your books here
          <a on:click={() => (showScanInstructions = !showScanInstructions)}> <i class="fa fa-question-circle" /> </a>
        </h4>
        <button class="btn btn-xs margin-left" onClick={() => manuallyEnterBook()}> Manual entry </button>
      </div>
      <div style="margin-top: 10px">
        <div>
          <div class="card card-info card-slim" style="width: 80%">
            <div use:slideAnimate={{ open: showScanInstructions, fade: true }} >
              Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to search for each
              book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
              <br />
              <br />
              After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of books with a
              barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else they may get
              overridden.
            </div>
          </div>
        </div>
        <hr />
      </div>
      <br />
      {#each entryList as entry, i}
        <div>
          <!-- <BookEntryItem ref={inputRefs[i]} entryFinished={() => entryFinished(i)} /> -->
        </div>
      {/each}
    </div>
    <div style="flex: 1" />
    <!-- <ScanResults /> -->
  </FlowItems>
</section>
