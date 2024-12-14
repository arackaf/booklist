let _bookViewOverride = $state("");

export const uiState = {
  get bookViewOverride() {
    return _bookViewOverride;
  },
  set bookViewOverride(value: string) {
    _bookViewOverride = value;
  }
};
