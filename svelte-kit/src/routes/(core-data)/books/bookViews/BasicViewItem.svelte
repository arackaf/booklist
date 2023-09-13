<script lang="ts">
  import { pan, swipe } from "svelte-gestures";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";

  export let book: Book;
  export let isPublic: boolean;

  function onPan(msg: string, e: any) {
    console.log(msg, e);
  }

  function onSwipe(e: any) {
    console.log("Swipe", e);
  }
</script>

<div
  use:pan={{ delay: 0 }}
  use:swipe
  on:pan={e => onPan("Pan", e)}
  on:panup={e => onPan("Pan Up", e)}
  on:pandown={e => onPan("Pan Down", e)}
  on:panmove={e => onPan("Pan Move", e)}
  on:swipe={onSwipe}
  class="py-1 border-b border-b-neutral-400 listGroupItem first:border-t-primary-8 first:border-t-[2px] hover:bg-primary-10"
>
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <BookCover size="mobile" {book} />
    </div>
    <div style="overflow: hidden">
      <div style="display: flex; flex-direction: column; height: 100%">
        <span class="text-sm leading-[normal] truncate">{book.title}</span>
        <SubTitleText>{book.authors.length ? book.authors.join(", ") : ""}</SubTitleText>
      </div>
    </div>
  </div>
</div>
