## Serverless Framework Example with DynamoDB Local

This example project is based on the todo API found [here](https://github.com/99x/serverless-react-boilerplate/tree/aws-react/api/todo)

### Choices

For this example, we do not define DynamoDB table(s) or IAM-relalted details in `serverless.yml`. Rather, we assume resources and permissions are handled by the (Dev)Ops Team outside of Serverless Project for the real environments. Hence, for local/offline scenario, we use `sls-local.yml` configuration file and include all plugins and settings needed for local/offline environment, including running DynamoDB Local, complete with table creation, data seeding and migrations. 

Furthermore, we make use of NPM scripts to streamline local development actions so all we need to do is run `npm run local`, 
which will: 
- download and install DynamoDBLocal, if needed
- start the local DynamoDB instance in-memory
- create DynamoDB table (from `localdb/todo.yml`)
- seed the data (from `localdb/todo-seed.json`)
- run migrations, if any
- finally, run `sls offline -c sls-local.yml` to start our offline local environment for todo's API.

### Sample Output

``` bash
  npm run local

> local
> npm run install-local-ddb && sls offline start -c sls-local.yml


> install-local-ddb
> sls dynamodb install -c sls-local.yml

Dynamodb is already installed on path!
Dynamodb Local Started, Visit: http://localhost:8000/shell
Serverless: DynamoDB - created table local-todos
Seed running complete for table: local-todos
offline: Starting Offline: local/us-east-1.
offline: Offline [http for lambda] listening on http://localhost:3002
offline: Function names exposed for local invocation by aws-sdk:
           * getAllTodos: todos-demo-local-getAllTodos
           * createTodo: todos-demo-local-createTodo
           * updateTodo: todos-demo-local-updateTodo
           * updateTodoStatus: todos-demo-local-updateTodoStatus
           * deleteTodo: todos-demo-local-deleteTodo

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
We can now try to get all todo's by using `curl` and `jq` for nice formatting:
``` bash
curl -s localhost:3000/local/todos/getAll | jq
{
  "result": {
    "Items": [
      {
        "id": "1",
        "task": "Eat breakfast",
        "isCompleted": true
      },
      {
        "id": "2",
        "task": "Wake up",
        "isCompleted": true
      },
      {
        "id": "3",
        "task": "Go to office",
        "isCompleted": false
      }
    ],
    "Count": 3,
    "ScannedCount": 3
  }
}
```
### Running on AWS 

To run this example on AWS, we need to: 
- create a DynamoDB Table as defined in `localdb/todo.yml`
- populate the table with some data item(s), for example: 
```javascript 
{
  "id": "123",
  "isCompleted": false,
  "task": "Push the code"
}
  ```
- give IAM permissions to the DynamoDB table for the role called `todos-demo-<stage>-<region>-lambdaRole`, or alternatively, specify roles and granular permissions with each function declared

After that, we can deploy as 
``` bash 
sls deploy --verbose 

Serverless: Running "serverless" installed locally (in service node_modules)
Serverless: Packaging service...
Serverless: Excluding development dependencies...
......
Output clipped
......
Service Information
service: todos-demo
stage: dev
region: us-east-1
stack: todos-demo-dev
resources: 41
api keys:
  None
endpoints:
  GET - https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos/getAll
  POST - https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos
  PUT - https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos/update
  PUT - https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos/status
  DELETE - https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos/delete/{id}
functions:
  getAllTodos: todos-demo-dev-getAllTodos
  createTodo: todos-demo-dev-createTodo
  updateTodo: todos-demo-dev-updateTodo
  updateTodoStatus: todos-demo-dev-updateTodoStatus
  deleteTodo: todos-demo-dev-deleteTodo
......
Output clipped
......

```

Finally, we can send a GET request to call the `getAllTodos` function directly on AWS: 

``` bash
curl -s https://xxxyyyzzz.execute-api.us-east-1.amazonaws.com/dev/todos/getAll | jq
{
  "result": {
    "Items": [
      {
        "task": "Push the code",
        "id": "123",
        "isCompleted": false
      }
    ],
    "Count": 1,
    "ScannedCount": 1
  }
} 
```