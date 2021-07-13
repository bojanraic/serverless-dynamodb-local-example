## Serverless Framework Example with DynamoDB Local

This example project is based on the todo API found [here](https://github.com/99x/serverless-react-boilerplate/tree/aws-react/api/todo)

### Choices

For this example, we do not define DynamoDB tables in `serverless.yml`'s `Resources` section. Rather, we invoke a custom JS ([`localdbinit.js`](localdb/migrations/localdbinit.js)) to create the necessary table(s) in local DynamoDB. 

Furthermore, we make use of NPM scripts to streamline local development actions so all we need to do is run `npm run offline`, 
which will: 
- download and install DynamoDBLocal, if needed
- start the local DynamoDB instance in-memory
- create DynamoDB table(s)
- seed the data
- run migrations
- finally, run `sls offline` to start our offline local environment for todo's

### Sample Output

``` bash
 npm run offline

> offline
> npm run start-local-ddb && sleep 2 && npm run init-local-ddb && sleep 2 && sls offline


> start-local-ddb
> sls dynamodb install && sls dynamodb start &

Dynamodb is already installed on path!

> init-local-ddb
> node localdb/migrations/localdbinit.js && sls dynamodb seed && sls dynamodb migrate

Dynamodb Local Started, Visit: http://localhost:8000/shell
{
  TableDescription: {
    AttributeDefinitions: [ [Object] ],
    TableName: 'local-todos',
    KeySchema: [ [Object] ],
    TableStatus: 'ACTIVE',
    CreationDateTime: 2021-07-13T14:27:19.944Z,
    ProvisionedThroughput: {
      LastIncreaseDateTime: 1970-01-01T00:00:00.000Z,
      LastDecreaseDateTime: 1970-01-01T00:00:00.000Z,
      NumberOfDecreasesToday: 0,
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableSizeBytes: 0,
    ItemCount: 0,
    TableArn: 'arn:aws:dynamodb:ddblocal:000000000000:table/local-todos'
  }
}
Seed running complete for table: local-todos
offline: Starting Offline: local/us-east-1.
offline: Offline [http for lambda] listening on http://localhost:3002
offline: Function names exposed for local invocation by aws-sdk:
           * getAllTodos: ddb-local-demo-local-getAllTodos
           * createTodo: ddb-local-demo-local-createTodo
           * updateTodo: ddb-local-demo-local-updateTodo
           * updateTodoStatus: ddb-local-demo-local-updateTodoStatus
           * deleteTodo: ddb-local-demo-local-deleteTodo

   ┌──────────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                      │
   │   GET    | http://localhost:3000/local/todos/getAll                                  │
   │   POST   | http://localhost:3000/2015-03-31/functions/getAllTodos/invocations        │
   │   POST   | http://localhost:3000/local/todos                                         │
   │   POST   | http://localhost:3000/2015-03-31/functions/createTodo/invocations         │
   │   PUT    | http://localhost:3000/local/todos/update                                  │
   │   POST   | http://localhost:3000/2015-03-31/functions/updateTodo/invocations         │
   │   PUT    | http://localhost:3000/local/todos/status                                  │
   │   POST   | http://localhost:3000/2015-03-31/functions/updateTodoStatus/invocations   │
   │   DELETE | http://localhost:3000/local/todos/delete/{id}                             │
   │   POST   | http://localhost:3000/2015-03-31/functions/deleteTodo/invocations         │
   │                                                                                      │
   └──────────────────────────────────────────────────────────────────────────────────────┘

offline: [HTTP] server ready: http://localhost:3000 🚀
offline:
offline: Enter "rp" to replay the last request

```
We can now try to get all todo's using `curl` and `jq` for nice formatting:
``` bash
curl -s localhost:3000/local/todos/getAll | jq
{
  "result": {
    "Items": [
      {
        "id": "43fca9c6-91f4-4593-9e5c-fac85beab5a7",
        "task": "Eat breakfast",
        "isCompleted": true
      },
      {
        "id": "c796d733-9779-45c5-a130-20fd1fd0b652",
        "task": "Wake up",
        "isCompleted": true
      },
      {
        "id": "42828c93-afb5-4761-ba55-becfda40b11b",
        "task": "Go to office",
        "isCompleted": false
      }
    ],
    "Count": 3,
    "ScannedCount": 3
  }
}
```
