import { getJunkValue } from "../../../data/junk";

export default async function Home() {
  await new Promise(res => setTimeout(res, 1500));
  const val = await getJunkValue();
  return <div className="m-5">Hello World {val}</div>;
}
