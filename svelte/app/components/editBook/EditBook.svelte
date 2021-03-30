<script lang="ts">
  import Tabs from "../layout/tabs/Tabs.svelte";
  import TabHeaders from "../layout/tabs/TabHeaders.svelte";
  import TabHeader from "../layout/tabs/TabHeader.svelte";
  import TabContents from "../layout/tabs/TabContents.svelte";
  import TabContent from "../layout/tabs/TabContent.svelte";

  import EditBookInfo from "./EditBookInfo.svelte";
  import ManageBookCover from "./ManageBookCover.svelte";

  export let book: any;
  export let saveBook: any;

  const updateBook = fn => (book = fn(book));
</script>

<Tabs defaultTab="basic">
  <TabHeaders>
    <TabHeader tabName="basic"><a>Book info</a></TabHeader>
    <TabHeader tabName="covers"><a>Covers</a></TabHeader>
  </TabHeaders>
  <TabContents>
    <TabContent tabName="basic">
      {#if book}
        <EditBookInfo {saveBook} {book} />
      {/if}
    </TabContent>
    <TabContent tabName="covers">
      {#if book}
        <div class="form-group">
          <label>Small Cover</label>
          <ManageBookCover _id={book._id} imgKey="smallImage" size="small" img={book.smallImage} updateBookObject={updateBook} />
        </div>
        <hr />
        <div class="form-group">
          <label>Medium Cover</label>
          <ManageBookCover _id={book._id} imgKey="mediumImage" size="medium" img={book.mediumImage} updateBookObject={updateBook} />
        </div>
      {/if}
    </TabContent>
    <TabContent tabName="c">C Content</TabContent>
  </TabContents>
</Tabs>
