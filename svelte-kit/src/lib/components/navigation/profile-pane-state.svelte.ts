class ProfilePaneState {
  isOpen = $state(false);

  open = () => (this.isOpen = true);
  close = () => (this.isOpen = false);
  setOpen = (newValue: boolean) => (this.isOpen = newValue);
}

export const profilePaneState = new ProfilePaneState();
