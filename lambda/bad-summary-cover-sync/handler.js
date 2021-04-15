"use strict";

const updateBookSummaryCovers = require("./handlerCode");

exports.badCoverSync = async event => {
  await updateBookSummaryCovers();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Done!" })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
