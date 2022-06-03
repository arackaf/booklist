import { setCrossOriginAttribute } from "./setCrossOriginAttribute";
import { syncSingleChild } from "../helpers/syncChild";
import { decode } from "../node_modules/blurhash/dist/esm/index";

type blurhash = { w: number; h: number; blurhash: string };

class BookCover extends HTMLElement {
  loaded: boolean = false;
  imageEl?: HTMLImageElement;
  previewEl?: HTMLElement;
  noCoverElement: HTMLElement;
  #_url = "";

  set preview(val: string | blurhash) {
    this.previewEl = this.createPreview(val);
    this.render();
  }

  set url(val: string) {
    this.loaded = false;
    this.#_url = val;
    this.createMainImage(val);
    this.render();
  }

  set nocover(val: string) {
    this.noCoverElement = document.createElement(val);
    this.render();
  }

  createPreview(val: string | blurhash): HTMLElement {
    if (typeof val === "string") {
      return base64Preview(val);
    } else if (typeof val === "object" && val !== null) {
      return blurHashPreview(val);
    }
  }

  createMainImage(url: string) {
    this.loaded = false;
    if (!url) {
      this.imageEl = null;
      return;
    }

    const img = document.createElement("img");
    img.alt = "Book cover";
    setCrossOriginAttribute(img, url);
    img.addEventListener("load", () => {
      if (img === this.imageEl) {
        this.loaded = true;
        this.render();
      }
    });
    this.imageEl = img;
    img.src = url;
  }

  render() {
    const elementMaybe = this.loaded ? this.imageEl : this.#_url ? this.previewEl : this.noCoverElement;
    if (elementMaybe) {
      syncSingleChild(this, elementMaybe);
    }
  }
}

if (!customElements.get("uikit-cover")) {
  customElements.define("uikit-cover", BookCover);
}

function base64Preview(val: string): HTMLImageElement {
  const img = document.createElement("img");
  img.src = val;
  return img;
}

function blurHashPreview(preview: blurhash): HTMLCanvasElement {
  const canvasEl = document.createElement("canvas");
  const { w: width, h: height } = preview;

  canvasEl.width = width;
  canvasEl.height = height;

  const pixels = decode(preview.blurhash, width, height);
  const ctx = canvasEl.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  return canvasEl;
}
