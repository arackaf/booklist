import { getCrossOriginAttribute } from "./getCrossOriginAttribute";

type blurhash = { w: number; h: number; blurhash: string };

class BookCover extends HTMLElement {
  imageEl?: HTMLImageElement;
  previewEl?: HTMLElement;

  loaded: boolean = false;

  set preview(val: string | blurhash) {
    console.log("PREVIEW SETTER");
  }

  static observedAttributes = ["url"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "url") {
      console.log("ATTRIBUTE", name, newValue);
      this.appendMainImage(newValue);
    }
  }

  appendMainImage(url: string) {
    if (this.imageEl) {
      this.removeChild(this.imageEl);
    }
    this.loaded = false;
    const img = document.createElement("img");
    img.alt = "Book cover";
    getCrossOriginAttribute(img, url);
    img.src = url;
    img.addEventListener("load", () => {
      if (img === this.imageEl) {
        this.loaded = true;
        this.render();
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const elementMaybe = this.loaded ? this.imageEl : this.previewEl;
    if (elementMaybe !== this.firstElementChild) {
      let removing;
      while (removing = this.firstElementChild) {
        removing.
      }
      this.appendChild(elementMaybe);
    }
  }
}

if (!customElements.get("uikit-cover")) {
  customElements.define("uikit-cover", BookCover);
}
