const isbnDbKey = "45851_b80fcd6722df2c57c6a057e88796a969";

const isbns = ["9780394746234", "9781613836309"];

async function foo() {
  const _fetch = await import("node-fetch");
  const fetch = _fetch.default;

  // const isbnDbResponse = await fetch(`https://api2.isbndb.com/book/${9781613836309}?results=subjects`, {
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //     Authorization: isbnDbKey
  //   }
  // });

  const isbnDbResponse = await fetch(`https://api2.isbndb.com/books`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: isbnDbKey
    },
    body: `isbns=${isbns},results=subjects`
  });

  const result = await isbnDbResponse.json();

  debugger;

  console.log(isbnDbResponse);
}

foo();
