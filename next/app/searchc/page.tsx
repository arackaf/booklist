import Link from "next/link";

export default async function Page(props) {
  await new Promise(res => setTimeout(res, 2000));
  return (
    <div>
      <h1>Search value {props.searchParams.x ?? "<none>"}</h1>

      <Link href="/search?x=a">&nbsp;A&nbsp;</Link>
      <br />
      <br />
      <Link href="/search?x=b">&nbsp;B&nbsp;</Link>
      <br />
      <br />
      <Link href="/search?x=c">&nbsp;C&nbsp;</Link>
    </div>
  );
}
