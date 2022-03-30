<script lang="ts">
  import { appState } from "app/state/appState";
  import ajaxUtil from "util/ajaxUtil";
  import { graphqlClient } from "util/graphql";
  import { getIsbnDbBookCover } from "util/isbnDb";

  import UpdateBookSummary from "graphQL/bookSummary/updateBookSummary.graphql";
  import ActionIconButton from "app/components/buttons/ActionIconButton.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import Button from "app/components/buttons/Button.svelte";

  export let book: any;

  const updateSmallCover = ({ _id, url, userId, loginToken }) => {
    const request = { userId, loginToken, url, size: "small" };
    return ajaxUtil.postWithCors(
      process.env.UPLOAD_BOOK_COVER_FROM_URL,
      request,
      res => {
        const newImage = res?.small?.image?.url;

        if (newImage && !res.error) {
          return graphqlClient.processMutation(UpdateBookSummary, { _id, bookSummary: { smallImage: newImage } });
        }
      },
      err => {
        return { failure: true, url: "" };
      }
    );
  };

  $: ({ userId, loginToken } = $appState);
  let newUrl = "";
  let newImg = "";

  const changeImg = evt => {
    evt.preventDefault?.();
    return updateSmallCover({ _id: book._id, url: newUrl, userId, loginToken }).then(() => (newUrl = ""));
  };

  const useFetchedImage = () => {
    return updateSmallCover({ _id: book._id, url: newImg, userId, loginToken }).then(() => (newImg = ""));
  };

  const go = () => {
    getIsbnDbBookCover(book.isbn).then(res => {
      if (res?.result?.image) {
        newImg = res?.result?.image;
      }
    });
  };
</script>

<div class="book-display">
  <div class="img">
    <img alt="Book cover" src={book.smallImage} />
  </div>
  <div class="book-info">
    <div class="title">
      <a target="_blank" href={`https://amazon.com/s?k=${book.title.replace(/\s+/g, "+")}`}>
        {book.title}
      </a>
    </div>
    <div class="author">{(book.authors || []).join(", ")}</div>
    <form on:submit={changeImg}>
      <div class="btn-group">
        <input class="form-control" placeholder="New Cover URL" bind:value={newUrl} />
        <ActionIconButton onClick={changeImg} disabled={!newUrl} class="btn btn-default">
          <i class="far fa-cloud-upload-alt" />
        </ActionIconButton>
      </div>
    </form>
    <Stack style="margin-top: 10px">
      <Button preset="default-xs" style="align-self: flex-start" onClick={go}>Find Cover Image</Button>
      {#if newImg}
        <img alt="Pending new book cover" style="align-self: center" src={newImg} />
        <Button onClick={useFetchedImage} preset="primary">Save</Button>
      {/if}
    </Stack>
  </div>
</div>
