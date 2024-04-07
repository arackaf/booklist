import { getJunkValue } from "../../../data/junk";

export default async function Home() {
  const val = await getJunkValue();
  return <div className="m-5">Hello World {val}</div>;
}
