import useSearchState from "./searchState.js";

export default () => {
  const []
  const keyDown = e => {
    if (e.keyCode == 13) {
      searchState.set({ search: e.target.value });
    }
  };

  return (
    <>
      <h1>Current Search: {$searchState.search}</h1>
      <input on:keydown={keyDown} />
    </>
  );
};
