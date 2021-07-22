"use strict";

const Promise = require("bluebird");
const AWS = require("aws-sdk");

var client;

if (process.env.IS_OFFLINE) {
  AWS.config.update({ dynamoDbCrc32: false })
  const dynamodbOfflineOptions = {
    region: "local",
    endpoint: "http://localhost:8000"
  };
  client = new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions);
}
else {
  client = new AWS.DynamoDB.DocumentClient();
}

module.exports = (method, params) => {
  return Promise.fromCallback(cb => client[method](params, cb));
};