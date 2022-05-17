import { clearContainer } from "./clearContent";

export function syncSingleChild(container: HTMLElement, child: HTMLElement) {
  const currentChild = container.firstElementChild;
  if (currentChild !== child) {
    clearContainer(container);
    if (child) {
      container.appendChild(child);
    }
  }
}
