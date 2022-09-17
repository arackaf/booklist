//import { setDefaultAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry.js";

// setDefaultAnimation("dialog.show", {
//   keyframes: [
//     { transform: "rotate(-10deg) scale(0.5)", opacity: "0" },
//     { transform: "rotate(0deg) scale(1)", opacity: "1" }
//   ],
//   options: {
//     duration: 500
//   }
// });

class Modal extends HTMLElement {
  ro: ResizeObserver;
  modal: HTMLElement & { open: boolean };
  sd: ShadowRoot;

  contentDiv: HTMLDivElement;
  sizedDiv: HTMLDivElement;

  constructor() {
    super();

    this.sd = this.attachShadow({ mode: "open" });
    this.sd.innerHTML = `
      <style>
        sl-dialog::part(base) {
          align-items: start;
        }
        sl-dialog::part(panel) {
          margin-top: 10vh;
        }
        .sized {
          transition: height 200ms cubic-bezier(0.190, 1.000, 0.220, 1.000);
        }
      </style>
      <sl-dialog
        label="Dialog"
        class="dialog-width"
        style="--width: 50vw;"

      >
        <div class="sized" style="overflow: hidden; height: auto;">
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </sl-dialog>
    `.trim();

    this.modal = this.sd.querySelector("sl-dialog");
    this.contentDiv = this.sd.querySelector(".content");
    this.sizedDiv = this.sd.querySelector(".sized");

    this.ro = new ResizeObserver(this.updateContentSize);
    this.ro.observe(this.contentDiv);

    this.modal.addEventListener("sl-after-show", () => {
      this.active = true;
    });
    this.modal.addEventListener("sl-hide", () => {
      this.active = false;
      this["on-hide"]();
    });
  }

  updateContentSize = () => {
    console.log("RO", this.contentDiv.offsetHeight);
    this.contentHeight = this.contentDiv.offsetHeight;
  };

  get contentHeight() {
    return this.contentDiv.offsetHeight;
  }
  set contentHeight(val) {
    if (this.active) {
      this.updateSizedHeight();
    }
  }

  #activeVal = false;

  ["on-hide"] = () => {};

  get active() {
    return this.#activeVal;
  }
  set active(val) {
    this.#activeVal = val;

    if (!val) {
      this.sizedDiv.style.height = "auto";
    } else {
      this.updateContentSize();
      this.updateSizedHeight();
    }
  }

  updateSizedHeight() {
    this.sizedDiv.style.height = this.contentHeight + "px";
  }

  set open(val) {
    console.log("Open set to", val);
    this.modal.open = val;
  }
}

if (!customElements.get("uikit-modal")) {
  customElements.define("uikit-modal", Modal);
}
