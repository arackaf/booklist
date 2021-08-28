class HelloWorldWc extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
      <h1>Hi there! This is a web component</h1>
    `;
  }
}

customElements.define("hello-world-wc", HelloWorldWc);

class CounterWc extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  get val() {
    return this._val || 0;
  }
  set val(newValue) {
    this._val = newValue;
  }
  render() {
    this.innerHTML = `
      <div>Current value: ${this.val}</div>
    `;
  }
}

customElements.define("counter-wc", CounterWc);
