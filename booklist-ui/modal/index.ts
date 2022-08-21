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
  modal: HTMLElement & { open: boolean };
  sd: ShadowRoot;

  constructor() {
    super();

    /*

        on:sl-hide={() => {
          console.log("Hiding");
          open = false;
        }}

*/

    this.sd = this.attachShadow({ mode: "open" });
    this.sd.innerHTML = `
      <style>
        sl-dialog::part(base) {
          align-items: start;
        }
        sl-dialog::part(panel) {
          margin-top: 10vh;
        }
      </style>
      <sl-dialog
        {open}
        label="Dialog"
        class="dialog-width"
        style="--width: 50vw;"

      >
        <slot></slot>
      </sl-dialog>
    `.trim();

    this.modal = this.sd.querySelector("sl-dialog");
  }

  set open(val) {
    this.modal.open = val;
  }
}

if (!customElements.get("uikit-modal")) {
  customElements.define("uikit-modal", Modal);
}
