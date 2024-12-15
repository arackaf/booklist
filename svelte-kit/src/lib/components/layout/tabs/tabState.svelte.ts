export type TabState = ReturnType<typeof createTabState>;

export const createTabState = (currentTab: string) => {
  let currentTabState = $state(currentTab);
  return {
    setTab(tab: string) {
      currentTabState = tab;
    },
    get currentTab() {
      return currentTabState;
    }
  };
};
