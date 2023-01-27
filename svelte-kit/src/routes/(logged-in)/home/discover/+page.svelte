<script lang="ts">
  import { fade } from "svelte/transition";

  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  import { ajaxUtil } from "$lib/util/ajaxUtil";

  import useReducer from "$lib/state/useReducer";
  //import DisplayBook from "./DisplayBook.svelte";
  //import DisplayRecommendation from "./DisplayRecommendation.svelte";
  import SearchModal from "./SearchModal.svelte";

  export let data: any;

  $: ({ subjects: allSubjects, tags: allTags } = data);

  const initialState: any = {
    selectedBooks: [],
    recommendationsLoading: false,
    recommendations: []
  };
  function reducer(state: any, [type, payload = null]: any) {
    switch (type) {
      case "selectBook":
        return { ...state, selectedBooks: [...state.selectedBooks, payload] };
      case "deSelectBook":
        return { ...state, selectedBooks: state.selectedBooks.filter((b: any) => b != payload) };
      case "startRecommendationsFetch":
        return { ...state, recommendationsLoading: true };
      case "setRecommendations":
        return { ...state, recommendationsLoading: false, recommendations: payload };
    }
    return state;
  }

  let searchModalOpen = false;
  type T = { selectedBooks: any[]; recommendations: any[]; recommendationsLoading: any };
  let [recommendationState, dispatch] = useReducer<T>(reducer, initialState);
  $: ({ selectedBooks, recommendations, recommendationsLoading } = $recommendationState);

  //let { publicUserId } = $appState;

  const closeModal = () => {
    searchModalOpen = false;
  };
  const openModal = () => (searchModalOpen = true);

  $: selectedBooksSet = new Set(selectedBooks.map(b => b._id));

  const getRecommendations = () => {
    //const { userId, loginToken } = getLoginStatus();

    dispatch(["startRecommendationsFetch"]);
    ajaxUtil
      .post("TODO", { bookIds: [...selectedBooksSet] })
      .then(res => {
        //preloadRecommendationImages(res);
        return res;
      })
      .then(resp => dispatch(["setRecommendations", resp.results]));
  };
</script>

<div class="margin-top">
  <FlexRow>
    <div class="col-xs-6">
      <Stack loosest={true}>
        <div style="font-weight: bold">Find some books, and get recommendations based on what's similar</div>

        <FlowItems pushLast={true}>
          <button class="btn btn-default" on:click={openModal}> <i class="fal fa-search" /> Search your books </button>

          {#if selectedBooks.length}
            <button on:click={() => getRecommendations()} disabled={recommendationsLoading} style="margin-left: auto" class="btn btn-primary">
              {#if recommendationsLoading}<i class="far fa-fw fa-spin fa-spinner" />{/if}
              Get Recommendations
            </button>
          {/if}
        </FlowItems>

        <div>
          {#each selectedBooks as book (book._id)}
            <span />
            <!-- <DisplayBook {book} {dispatch} /> -->
          {/each}
        </div>
      </Stack>
    </div>
    <div class="col-xs-6">
      {#if recommendations.length}
        <div transition:fade|local>
          <div style="font-weight: bold; margin-bottom: 5px">Similar books found</div>
          <table class="table table-condensed table-striped">
            <tbody>
              {#each recommendations as book (book._id)}
                <span />
                <!-- <DisplayRecommendation {book} /> -->
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </FlexRow>
  <SearchModal isOpen={searchModalOpen} onHide={closeModal} {allSubjects} {allTags} {dispatch} {selectedBooksSet} />
</div>
