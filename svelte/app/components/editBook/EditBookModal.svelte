<script lang="ts">
  import Tabs from "../layout/tabs/Tabs.svelte";
  import TabHeaders from "../layout/tabs/TabHeaders.svelte";
  import TabHeader from "../layout/tabs/TabHeader.svelte";
  import TabContents from "../layout/tabs/TabContents.svelte";
  import TabContent from "../layout/tabs/TabContent.svelte";

  import Modal from "../ui/Modal.svelte";
  import EditBookInfo from "./EditBookInfo.svelte";

  export let book;
  export let isOpen = false;
  export let onHide;
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false}>
  <Tabs defaultTab="a">
    <TabHeaders>
      <TabHeader tabName="a">A</TabHeader>
      <TabHeader tabName="b">B</TabHeader>
      <TabHeader tabName="c">C</TabHeader>
    </TabHeaders>
    <TabContents>
      <TabContent tabName="a">A Content</TabContent>
      <TabContent tabName="b">B Content</TabContent>
      <TabContent tabName="c">C Content</TabContent>
    </TabContents>
  </Tabs>

  <EditBookInfo {book} />
</Modal>
