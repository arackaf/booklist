<script context="module" lang="ts">
  const initialState: any = {
    selectedBooks: [],
    recommendationsLoading: false,
    recommendations: []
  };
  function reducer(state, [type, payload = null]) {
    switch (type) {
      case "selectBook":
        return { ...state, selectedBooks: [...state.selectedBooks, payload] };
      case "deSelectBook":
        return { ...state, selectedBooks: state.selectedBooks.filter(b => b != payload) };
      case "startRecommendationsFetch":
        return { ...state, recommendationsLoading: true };
      case "setRecommendations":
        return { ...state, recommendationsLoading: false, recommendations: payload };
    }
    return state;
  }
</script>

<script lang="ts">
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  import { appState } from "app/state/appState";
  import ajaxUtil from "util/ajaxUtil";

  import useReducer from "util/useReducer";
  import DisplayBook from "./DisplayBook.svelte";
  import DisplayRecommendation from "./DisplayRecommendation.svelte";
  import SearchModal from "./SearchModal.svelte";

  let searchModalOpen = false;
  type T = { selectedBooks: any; recommendations: any[]; recommendationsLoading: any };
  let [recommendationState, dispatch] = useReducer<T>(reducer, initialState);
  $: ({ selectedBooks, recommendations, recommendationsLoading } = $recommendationState);

  let { publicUserId } = $appState;

  const closeModal = () => {
    searchModalOpen = false;
  };
  const openModal = () => (searchModalOpen = true);

  $: selectedBooksSet = new Set(selectedBooks.map(b => b._id));

  const getRecommendations = publicUserId => {
    dispatch(["startRecommendationsFetch"]);
    ajaxUtil.post("/book/getRecommendations", { bookIds: [...selectedBooksSet], publicUserId }).then(resp => {
      dispatch(["setRecommendations", resp.results]);
    });
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
            <button
              on:click={() => getRecommendations(publicUserId)}
              disabled={recommendationsLoading}
              style="margin-left: auto"
              class="btn btn-primary"
            >
              {#if recommendationsLoading}<i class="fa fa-fw fa-spin fa-spinner" />{/if}
              Get Recommendations
            </button>
          {/if}
        </FlowItems>

        <div>
          {#each selectedBooks as book}
            <DisplayBook {book} {dispatch} />
          {/each}
        </div>
      </Stack>
    </div>
    <div class="col-xs-6">
      <div>
        {#if recommendations.length}
          <div style="font-weight: bold; margin-bottom: 5px">Similar books found</div>
          <table class="table table-condensed table-striped">
            <tbody>
              {#each recommendations as book (book._id)}
                <DisplayRecommendation {book} />
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </FlexRow>
  <SearchModal isOpen={searchModalOpen} onHide={closeModal} {dispatch} {selectedBooksSet} />
</div>
