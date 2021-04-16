"use strict";

const request = require("request");
const corsResponse = require("../util/corsResponse");
const getSecrets = require("../util/getSecrets");

module.exports.lookupBook = async event => {
  const secrets = await getSecrets();
  const key = secrets["isbn-db-key"];
  const { isbn } = JSON.parse(event.body);

  console.log("KEY", key);
  console.log("body", event.body);
  console.log("url", `https://api2.isbndb.com/book/${isbn}`);

  const result = await new Promise(res => {
    request.get(
      `https://api2.isbndb.com/book/${isbn}`,
      {
        headers: {
          Authorization: key
        }
      },
      (a, b, body) => {
        res(JSON.parse(body));
      }
    );
  });

  return corsResponse({ result });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
