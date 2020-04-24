'use strict';

const CorsResponse = obj => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  },
  body: JSON.stringify(obj)
});

module.exports.hello = async event => {
  return CorsResponse("HELLO, WORLD!");
};
