const fetch = require("node-fetch");

(async function () {
  try {
    const key = "45851_b80fcd6722df2c57c6a057e88796a969";

    const isbns = ["0198788606", "998", "1617295116", "234"];

    // const fetchResponse = await fetch(`https://api2.isbndb.com/book/0198788606`, {
    //   headers: {
    //     Authorization: key
    //   }
    // });

    const fetchResponse = await fetch(`https://api2.isbndb.com/books`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: key
        //isbns: isbns.join(",")
      },
      body: `isbns=${isbns.join(",")}`
      //body: JSON.stringify({ isbns: isbns[0] })
    });

    //const text = await fetchResponse.text();
    const json = await fetchResponse.json();

    console.log(fetchResponse);
  } catch (err) {
    console.log(err);
  }
})();

var o = {
  total: 2,
  requested: 4,
  data: [
    {
      publisher: "Manning Publications",
      language: "en_US",
      image: "https://images.isbndb.com/covers/51/19/9781617295119.jpg",
      title_long: "Amazon Web Services in Action",
      edition: "2nd",
      dimensions: "Height: 9.25 Inches, Length: 7.38 Inches, Weight: 2.14730243188 Pounds, Width: 1.2 Inches",
      pages: 528,
      date_published: "2018-10-08T00:00:01Z",
      authors: ["Andreas Wittig", "Michael Wittig"],
      title: "Amazon Web Services in Action",
      isbn13: "9781617295119",
      msrp: "54.99",
      binding: "Paperback",
      isbn: "1617295116"
    },
    {
      publisher: "Penguin Books/OUP Oxford/Black Swan",
      language: "en",
      image: "https://images.isbndb.com/covers/86/07/9780198788607.jpg",
      title_long: "Richard Dawkins 3 Books Collection Set (The Blind Watchmaker, The Selfish Gene, The God Delusion)",
      date_published: "2020",
      authors: ["Richard Dawkins"],
      title: "Richard Dawkins 3 Books Collection Set (The Blind Watchmaker, The Selfish Gene, The God Delusion)",
      isbn13: "9780198788607",
      msrp: "0.00",
      binding: "Paperback",
      related: { "Kindle Edition": "0191093076" },
      isbn: "0198788606"
    }
  ]
};


{
  "_id" : ObjectId("60a93d871ef910ff2c3e7f18"),
  "isbn" : "0199291152",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 2 */
{
  "_id" : ObjectId("60a93d921ef910ff2c3e7f19"),
  "isbn" : "0192880519",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 3 */
{
  "_id" : ObjectId("60a93d9d1ef910ff2c3e7f1a"),
  "isbn" : "0393338665",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 4 */
{
  "_id" : ObjectId("60a93da61ef910ff2c3e7f1b"),
  "isbn" : "0814758371",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 5 */
{
  "_id" : ObjectId("60a93db91ef910ff2c3e7f1c"),
  "isbn" : "0060976519",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 6 */
{
  "_id" : ObjectId("60a93dc01ef910ff2c3e7f1d"),
  "isbn" : "0393062244",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 7 */
{
  "_id" : ObjectId("60a93dc71ef910ff2c3e7f1e"),
  "isbn" : "067401832X",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 8 */
{
  "_id" : ObjectId("60a93dce1ef910ff2c3e7f1f"),
  "isbn" : "0944344860",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 9 */
{
  "_id" : ObjectId("60a93df71ef910ff2c3e7f20"),
  "isbn" : "1617292850",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 10 */
{
  "_id" : ObjectId("60a93e001ef910ff2c3e7f21"),
  "isbn" : "1617295868",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 11 */
{
  "_id" : ObjectId("60a93e0b1ef910ff2c3e7f22"),
  "isbn" : "9781593279509",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 12 */
{
  "_id" : ObjectId("60a93e151ef910ff2c3e7f23"),
  "isbn" : "9781492057017",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 13 */
{
  "_id" : ObjectId("60a93e1f1ef910ff2c3e7f24"),
  "isbn" : "9781492059899",
  "userId" : "60a93babcc3928454b5d1cc6"
}

/* 14 */
{
  "_id" : ObjectId("60a93f46fc47e30005d5010e"),
  "userId" : "",
  "isbn" : "Hello There"
}