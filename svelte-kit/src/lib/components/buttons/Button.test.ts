import { describe, it, expect } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/svelte";
import Button from "./Button.svelte";

describe("button tests", () => {
  it("Renders", async () => {
    const { container } = render(Button, { props: {} });

    const btn = container.querySelector("button")!;
    expect(btn.tagName).toBe("BUTTON");

    // await fireEvent.click(inc);

    // waitFor(() => {
    //   expect(count.textContent).toBe("1");
    // });
  });
});
