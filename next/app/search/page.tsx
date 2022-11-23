import Link from "next/link";
import "./styles.scss";

export default async function Page(props) {
  await new Promise(res => setTimeout(res, 2000));
  return (
    <div>
      <h1>Search value {props.searchParams.x ?? "<none>"}</h1>

      <section>
        Hello
        <span>World</span>
      </section>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <Link href="/search?x=a">&nbsp;A&nbsp;</Link>
          <br />
          <br />
          <Link href="/search?x=b">&nbsp;B&nbsp;</Link>
          <br />
          <br />
          <Link href="/search?x=c">&nbsp;C&nbsp;</Link>
        </div>
        <div style={{ marginLeft: "15px" }}>
          <Link href="/searchb?x=a">&nbsp;A&nbsp;</Link>
          <br />
          <br />
          <Link href="/searchb?x=b">&nbsp;B&nbsp;</Link>
          <br />
          <br />
          <Link href="/searchb?x=c">&nbsp;C&nbsp;</Link>
        </div>
      </div>
    </div>
  );
}
