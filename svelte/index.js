
import "./WC.svelte";
import "./WC2.svelte";

class MyWC extends HTMLElement {
  constructor() {
		super();

		const root = this.root = this.attachShadow({ mode: "open" });
		
    this.shadowRoot.innerHTML = `
			<div class"root">
				<h1>Hi</h1>
				<content select="input"></content>
				<h1>There</h1>
				<content select="span"></content>
				<content select="span"></content>
			</div>
		`;
  }
  connectedCallback() {
		const allContents = this.root.querySelectorAll("content");

		for (const c of allContents) {
			debugger;
			for (const item of this.querySelectorAll(c.getAttribute("select"))) {
				c.appendChild(item);
			}
		}
		//let c = this.childNodes;
		//debugger;
  //   const root = this.attachShadow({ mode: "closed" });
  //   root.innerHTML = `
	// 		<div class"root">
	// 			<h1>Hi</h1>
	// 			<content select="input"></content>
	// 			<h1>There</h1>
	// 		</div>
	// 	`;
  }
}

customElements.define("my-wc", MyWC);

// const app = new WC({
// 	props: {},
// });


document.getElementById("svelte-wc").innerHTML = `<svelte-wc id="wca"></svelte-wc><svelte-wc2></svelte-wc2>`;

setTimeout(() => {
	let inst = document.getElementById("wca");
	inst.foo();
}, 250);