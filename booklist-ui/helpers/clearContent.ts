export function clearContainer(el: HTMLElement) {
  let child: Element;

  while ((child = el.firstElementChild)) {
    el.removeChild(child);
  }
}
