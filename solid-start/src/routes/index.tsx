import { createSignal } from "solid-js";
import { getJunkValue } from "../../../data/junk";

async function getData() {
  "use server";
  console.log("Loading bfore delay ... ");
  await new Promise(res => setTimeout(res, 1500));
  console.log("Loading after delay ... ");

  return { value: getJunkValue() };
}

export const route = {
  async load() {
    const data = await getData();
    return data;
  }
};

export default function Index(props: any) {
  const [val, setVal] = createSignal(null as any);
  console.log({ props });

  Promise.resolve(props.data).then(val => {
    console.log(val);
    setVal(val);
  });

  return <h1>Ayoooo {val()?.value}</h1>;
}
