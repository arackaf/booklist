const noCoverTemplate = (className: string) => `
  <div class="${className}">
    <div>No Cover</div>
  </div>`;

class NoBookCoverMobile extends HTMLElement {
  connectedCallback() {
    this.innerHTML = noCoverTemplate("no-cover-mobile");
  }
}

class NoBookCoverSmall extends HTMLElement {
  connectedCallback() {
    this.innerHTML = noCoverTemplate("no-cover-small");
  }
}

class NoBookCoverMedium extends HTMLElement {
  connectedCallback() {
    this.innerHTML = noCoverTemplate("no-cover-medium");
  }
}

if (!customElements.get("uikit-no-cover-mobile")) {
  customElements.define("uikit-no-cover-mobile", NoBookCoverMobile);
}

if (!customElements.get("uikit-no-cover-small")) {
  customElements.define("uikit-no-cover-small", NoBookCoverSmall);
}

if (!customElements.get("uikit-no-cover-medium")) {
  customElements.define("uikit-no-cover-medium", NoBookCoverMedium);
}

export default null;
