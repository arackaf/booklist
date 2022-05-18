import { getCrossOriginAttribute } from "./getCrossOriginAttribute";
import { syncSingleChild } from "../helpers/syncChild";
import { decode } from "blurhash";

type blurhash = { w: number; h: number; blurhash: string };

class BookCover extends HTMLElement {
  loaded: boolean = false;
  imageEl?: HTMLImageElement;
  previewEl?: HTMLElement;
  static observedAttributes = ["url"];

  set preview(val: string | blurhash) {
    this.previewEl = this.createPreview(val);
    this.render();
  }

  createPreview(val: string | blurhash): HTMLElement {
    if (typeof val === "string") {
      return base64Preview(val);
    } else {
      return blurHashPreview(val);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "url") {
      this.createMainImage(newValue);
    }
  }

  createMainImage(url: string) {
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
    this.imageEl = img;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const elementMaybe = this.loaded ? this.imageEl : this.previewEl;
    syncSingleChild(this, elementMaybe);
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
