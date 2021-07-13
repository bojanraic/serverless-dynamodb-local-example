const AWS = require("aws-sdk");

var dynamodbOfflineOptions = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  };

var client = new AWS.DynamoDB(dynamodbOfflineOptions) 

var params = {
    TableName: 'local-todos',
    KeySchema: [
        { 
            AttributeName: 'id',
            KeyType: 'HASH',
        }
    ],
    AttributeDefinitions: [ 
        {
            AttributeName: 'id',
            AttributeType: 'S',
        },
    ],
    ProvisionedThroughput: { 
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    }
};

client.createTable(params, function(err, data) {
    if (err) console.log(err); 
    else console.log(data); 
});