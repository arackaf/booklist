"use strict";

const aws = require("aws-sdk");

module.exports.connect = async (event, context) => {
  console.log("CONNECTION:", "obj", typeof (aws && aws.ApiGatewayManagementApi), "event", event, "context", context);

  let messenger = new aws.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });

  setTimeout(() => {
    console.log("Sending to:", event.requestContext.connectionId);
    messenger.postToConnection(
      { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify({ message: "Hello, World!!!" }) },
      (err, data) => {
        console.log("CALLBACK", "ERROR", err, "DATA", data);
      }
    );
  }, 2000);

  console.log("Here goes");

  return {
    statusCode: 200
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.disconnect = async (event, context) => {
  console.log("DIS-CONNECT:", "event", "event", "context", context);

  return {
    statusCode: 200
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
