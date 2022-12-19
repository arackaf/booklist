type blurhash = { w: number; h: number; blurhash: string };

if (typeof window !== "undefined") {
  class ImageWithPreview extends HTMLElement {
    sd: ShadowRoot;
    mo?: MutationObserver;

    get #imgEl(): any {
      return this.querySelector("img[slot='image']");
    }
    get #previewEl(): any {
      return this.querySelector("img[slot='preview']");
    }

    constructor() {
      super();

      this.sd = this.attachShadow({ mode: "open" });
      this.sd.innerHTML = `<slot name="preview"></slot>`;
    }

    #checkReady = () => {
      if (this.#imgEl && this.#previewEl) {
        this.mo?.disconnect();

        if (this.#imgEl.complete) {
          this.#imgLoad();
        } else {
          this.#imgEl.addEventListener("load", this.#imgLoad);
        }

        return 1;
      }
    };

    connectedCallback() {
      if (!this.#checkReady()) {
        this.mo = new MutationObserver(this.#checkReady);
        this.mo.observe(this, {
          subtree: true,
          childList: true,
          attributes: false
        });
      }
    }

    #imgLoad = () => {
      this.sd.innerHTML = `<slot name="image"></slot>`;
    };
  }

  if (!customElements.get("book-cover")) {
    customElements.define("book-cover", ImageWithPreview);
  }
}

export default null;
