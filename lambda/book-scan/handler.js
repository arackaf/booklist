"use strict";

const aws = require("aws-sdk");

module.exports.connect = async (event, context) => {
  console.log("CONNECTION:", "obj", typeof (aws && aws.ApiGatewayManagementApi), "event", event, "context", context);

  let messenger = new aws.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });

  console.log("PRE TIMEOUT");
  try {
    setTimeout(() => {
      console.log("IN TIMEOUT");
      try {
        console.log("Sending to:", event.requestContext.connectionId);
        messenger.postToConnection(
          { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify({ message: "Hello, World One" }) },
          (err, data) => {
            console.log("CALLBACK", "ERROR", err, "DATA", data);
          }
        );
      } catch (er) {
        console.log("ERROR CAUGHT", er);
      }
    }, 4000);
  } catch (er) {
    console.log("OUTER ERROR", er);
  }

  console.log("Here goes");

  return {
    statusCode: 200
  };
};

module.exports.disconnect = async (event, context) => {
  console.log("DIS-CONNECT:", "event", "event", "context", context);

  return {
    statusCode: 200
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

let i = 0;

module.exports.foo = async (event, context) => {
  console.log("FOO");

  try {
    let messenger = new aws.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });

    console.log("Set up with", event.requestContext.domainName + "/" + event.requestContext.stage);

    await new Promise(res => {
      messenger.postToConnection(
        { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify({ message: "Hello, World TWO Baby " + i++ }) },
        (err, data) => {
          res();
          console.log("CALLBACK", "ERROR", err, "DATA", data);
        }
      );
    });
  } catch (er) {
    console.log("ERROR in foo", er);
  }

  return {
    statusCode: 200
  };
};
