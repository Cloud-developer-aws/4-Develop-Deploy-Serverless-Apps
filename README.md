# 4-Develop-Deploy-Serverless-Apps


0. [Configure AWS](#schema0)
1. [Developing and Deploying Serverless](#schema1)
2. [Introduction to Serverless](#schema2)
3. [Exercise: Serverless Lambda](#schema3)
4. [Exercise: Monitoring](#schema4)
5. [REST API](schema5)
6. [Exercise: Get Groups Starter](#schema6)
7. [DynamoDB & CloudFormation: Introduction](#schema7)
8. [Demo-Create DynamoDB table](#schema8)
9. [Exercise: Create new group API](#schema9)
10. [Demo Requests validation](#schema10)
11. [Exercise: Get images api starter](#schema11)
12. [Demo: Get image by ID](#schema12)
13. [Event Processing](#schema13)
14. [Demo - Create an S3 Bucket](#schema14)
15. [Exercise: Presigned URL](#schema15)
16. [Demo S3 Events](#schema16)

<hr>
<a name='schema0'></a>

## 0. Configure AWS
```bash
aws configure 
```
```bash
aws configure set aws_session_token "<SESSIONTOKENHERE>"
```

<hr>
<a name='schema1'></a>

## 1. Developing and Deploying Serverless

### **Generate the Access Keys**
An access key is a combination of:

- Access Key ID
- Secret Access Key, and
- AWS Session Token (Optional)

```bash
export AWS_ACCESS_KEY_ID={copied-access-key}
export AWS_SECRET_ACCESS_KEY={copied-secret-key}
export AWS_SESSION_TOKEN={copied-session-token}
```

Now you can deploy your application using the serverless command using the configured AWS account.
```bash
serverless deploy
```

### **Frontend**


In the `client` folder, you would need to again to install the application's dependencies:
```bash
npm install
```
Then you need to update the `.env` file to use the deployed Serverless backend and Auth0 configuration parameters. It should look like this:
```
REACT_APP_AUTH0_DOMAIN=test-endpoint.auth0.com
REACT_APP_AUTH0_CLIENT_ID=Riz...Te
REACT_APP_API_ENDPOINT=https://7gi12345k2.execute-api.us-east-1.amazonaws.com/dev
```
Now you can start the frontend application:
```bash
npm start
```
This command will start development React server running your application. To access it in the browser, click on the button at the bottom right corner:

### **Backend**
You would first need to download the backend's dependencies:
```bash
npm install
```
Then you would need to expose credentials for an AWS user that the Serverless framework will use to deploy your application:
```bash
export AWS_ACCESS_KEY_ID={copied-access-key}
export AWS_SECRET_ACCESS_KEY={copied-secret-key}
```
Now you can deploy your application using the serverless command using the configured AWS account.
```bash
serverless deploy
```

### **Client**
In the `client` folder, you would need to again install the application's dependencies:
```bash
npm install
```
Then you need to update the `.env` file to use the deployed Serverless backend and Auth0 configuration parameters. It should look like this:
```
REACT_APP_AUTH0_DOMAIN=test-endpoint.auth0.com
REACT_APP_AUTH0_CLIENT_ID=Riz...Te
REACT_APP_API_ENDPOINT=https://7gi12345k2.execute-api.us-east-1.amazonaws.com/dev
```
Now you can start the frontend application:

```bash
npm start
``` 
This should start a development server available at `http://localhost:3000.`

### *Info sls**
To have information about our servers we can use:
```bash
sls info
```

```bash
(base) ➜  backend git:(main) ✗ sls info 
service: serverless-udagram-app
stage: dev
region: us-east-1
stack: serverless-udagram-app-dev
endpoint: GET - https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups
functions:
  GetGroups: serverless-udagram-app-dev-GetGroups

```




<hr>
<a name='schema2'></a>

## 2. Introduction to Serverless

### **Function as a Service (FaaS)**


**Serverless Components**
- FaaS : Function as a service: write code in individual functions and deploy them to a platform to be executed
- Datastores: Storage of data
- Messaging: Send messages from one application to another
- Services: Services that provide functionalities where we don't need to manage servers, i.e. authentication, ML, video processing
![](./img/comp.png)


### **Intro to AWS Lambda**

**Lambda function vs AWS Lambda**

- AWS Lambda is a computing service that runs code in response to events from Amazon Web Services,
- A Lambda function is a single function connected to an event source running in AWS Lambda.

```
export async function handler(event) {
  const number = event.number
  const updatedNum = number++
  return {
    result: updatedNum
  }
}
```

**AWS Lambda limitations**
- At most 10GB of memory per execution
- Functions can run no more that 15 minutes
- Can only write files to /tmp folder
- Limited number of concurrent executions
- Event size up to 6 MB


**Invocation types**

```bash
aws lambda invoke --function-name hello-world --invocation-type RequestResponse  --log-type Tail --payload '{"name":"AWS Lambda"}' result.txt 

cat result.txt
```


**Create a Serverless Project**


- INSTALL 
```bash
npm install -g serverless
```
- CREATE PROJECT 
```bash
serverless create --template aws-nodejs --path folder-name
```
- INSTALL PLUGIN 
```bash
npm install plugin-name --save-dev
```

- DEPLOY PROJECT 
```bash
sls deploy -v
```

### **Environment Variables**


**Using Environment Variables**
Here is how to define two environment variables, `SERVICE_NAME` and `URL` in `serverless.yaml`. Once deployed, these variables will be available to all Lambda functions.
```yml
service: http-metrics
frameworkVersion: '3'

provider:
  ...
  environment:
    SERVICE_NAME: example
    SERVICE_URL: https://example.com
```

Lambda functions can then access these variables using the `process.env` object:
```
const serviceName = process.env.SERVICE_NAME
const url = process.env.SERVICE_URL

```

`IAM Roles`

As a refresher, every IAM statement provides:

- an array of actions,
- the resource on which the action is performed
- the effect of the permission (Allow/Deny)

```
provider:
  ...
  iam:
    role:
      statements:
        - Effect: Allow
          Action: 'cloudwatch:PutMetricData'
          Resource: '*'
```




<hr>
<a name='schema3'></a>


## 3. Exercise: Serverless Lambda

1. Create folder `exercise-serverless` and `cd exercise-serverless`
2. INSTALL 
```bash
npm install -g serverless
```
3. CREATE PROJECT 
```bash
serverless create --template aws-nodejs --path ./
```
New files: `handler.js`, `serverless.yml` and `.gitignore`

4. INSTALL PLUGIN 
```bash
npm install plugin-name --save-dev
```

 5. DEPLOY PROJECT 
```bash
sls deploy -v
```
6. INOVKE
```bahs
aws lambda invoke --function-name hello-world --invocation-type RequestResponse  --log-type Tail --payload '{"name":"AWS Lambda"}' result.txt 
```

<span style="color:RED">Error</span>  


```bash
(base) ➜  exercise-serverless git:(main) ✗ aws lambda invoke --function-name hello-world --invocation-type RequestResponse  --log-type Tail --payload '{"name":"Patri"}' result.txt 

Invalid base64: "{"name":"Patri"}"

```
<span style="color:Cyan">Solution</span>  
```
echo -n '{"name":"Patri"}' | base64
```
```
 aws lambda invoke --function-name HelloWorld --invocation-type RequestResponse --log-type Tail --payload "eyJuYW1lIjoiUGF0cmkifQ==" result.txt

```

7. `serverless.yml`

```yml
service: hello-world-lambda
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs16.x

functions:
  hello:
    handler: lambda.handler
```
8. `package.json`
```json
{
    "name": "hello-lambda",
    "version": "1.0.0",
    "type": "module",
    "description": "",
    "main": "lambda.js",
    "author": ""
}
```

9. `handler.js` to `lambda.js`

10. Deploy
```bash
serverless deploy

```
![](./img/deploy-hello-world.png)


11. Invoke

```bash
serverless invoke --function hello --data '{"name": "Lambda"}'

```
Result
```bash
{
    "result": "Hello Lambda !"
}

```


<hr>
<a name='schema4'></a>


## 4. Exercise: Monitoring

1 . INSTALL 
```bash
npm install 
```
2. Create `lambda.js`

3.  Create `serverless.yml`

4. Create `package.json`
5. Deploy 
```bash
serverless deploy

```
6. Invoke

```bash
serverless invoke --function http-monitor 

```

<hr>
<a name='schema5'></a>

## 5. REST API
**Amazon API Gateway**
What is API Gateway?
- Entry point for API users
- Pass requests to other services
- Process incoming requests

**API Gateway Targets**
Possible targets for an HTTP request processed by API Gateway:

- Lambda Function - call a Lambda function
- HTTP Endpoint - call a public HTTP endpoint
- AWS Service - send a request to an AWS service
- Mock - return a response without calling a backend
- VPC Link - access resource in an Amazon Virtual Private Cloud (VPC)


![](./img/endpoint.png)


**EndPoint Configurations**
There are three primary types of endpoint configuration:

- Configured per API
- Public
  - Edge Optimized Endpoint
  - Regional Endpoint
- Private VPC

**Lambda integration modes**
- Proxy - passes all request information to a Lambda function. Easier to use.
- Non-proxy - allows to transform incoming request using Velocity Template Language


**API Gateway Stages**
![](./img/stages.png)

**Indexes in DynamoDB**

DynamoDB supports two indexes types:

Local secondary index (LSI):
- Like an additional sort key
- Allows to sort items by a different attribute
- Added on the data in a table
Global secondary index (GSI)
- Allows to define a new partition key for the same data
- Allows to define a new partition and sort key for the same data
- Creates copy of the data in a table (data is available via GSI after some delay)







<hr>
<a name='schema6'></a>


## 6. Exercise: Get Groups Starter
1. Add code `getGroups.js`
2. Add code `serverless.yml`
3. Deploy
```bash
sls deploy 
```
```bash
Deploying serverless-udagram-app to stage dev (us-east-1)

✔ Service deployed to stack serverless-udagram-app-dev (104s)

endpoint: GET - https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups
functions:
  GetGroups: serverless-udagram-app-dev-GetGroups (718 B)

Need a faster logging experience than CloudWatch? Try our Dev Mode in Console: run "serverless dev"

```
![](./img/deply-get-groups.png)

4. Testing, endpoint return `sls deploy`

```bash
curl --location --request GET 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups' 
```
```bash 
{"items":[{"id":"1","name":"Dogs","description":"Only dog images here!"},{"id":"2","name":"Nature","description":"What can be a better object for photography"},{"id":"3","name":"Cities","description":"Creative display of urban settings"}]}% 
```

<hr>
<a name='schema7'></a>

## 7. DynamoDB & CloudFormation: Introduction

![dynamodb](./img/dynamodb_1.png)
![dynamodb](./img/dynamodb_2.png)
![dynamodb](./img/dynamodb_3.png)
![dynamodb](./img/dynamodb_4.png)
![dynamodb](./img/dynamodb_5.png)
![dynamodb](./img/dynamodb_6.png)
![dynamodb](./img/dynamodb_7.png)

![dynamodb](./img/dynamodb_8.png)

### **DynamoDB Capacity Modes**

DynamoDB has two capacity modes:

- Provisioned capacity - we need to define the maximum amount of read/write requests DynamoDB can handle. The higher the limit we set, the more we have to pay per month. Requests are throttled if we go above the specified limit.
- On-Demand - DynamoDB will handle as many requests as we send, and we pay per-request. Can be more expensive comparing to Provisioned capacity, but is better for applications with unpredictable traffic patterns

![dynamodb](./img/dynamodb_9.png)
![dynamodb](./img/dynamodb_10.png)
Promise
![dynamodb](./img/dynamodb_11.png)




### **CloudFormation**

![CloudFormation](./img/cf_1.png)
CloudFormation is a services for creation and management of AWS resources

CloudFormation allows us to

- Write YAML/JSON config file
- Changes state of AWS resources
- Version control the infrastructure
CloudFormation is free and we only need to pay for created resources.
![CloudFormation](./img/cf_2.png)
![CloudFormation](./img/cf_3.png)

### **Creating Items with DynamoDB**


![Create Items](./img/create_items_3.png)
![Create Items](./img/create_items_4.png)


### **DynamoDB with Node.js**

When it comes to AWS clients with Node.js we can use two AWS Node.js clients.

- v2 version of the AWS SDK or
- a newer v3 version.

It is a modular SDK, meaning we can specify what parts of the AWS SDK we need in our application, instead of using a JavaScript package for all possible AWS services.

Version 3 (v3) is recommended for new applications.
![node](./img/node_db.png)

![node](./img/node_db_2.png)

El cliente de alto nivel proporcionado por AWS SDK para JavaScript v3, específicamente el módulo DynamoDBDocument. Este cliente de alto nivel es una capa por encima del cliente de bajo nivel y proporciona una interfaz simplificada y más fácil de usar para interactuar con DynamoDB.

Con el cliente de alto nivel, puedes trabajar con objetos JavaScript estándar y no necesitas preocuparte por los detalles de bajo nivel de la API de DynamoDB. Por ejemplo, en lugar de trabajar con atributos de elementos de tabla DynamoDB nativos, puedes trabajar con objetos JavaScript normales.


### **Validate Requests**

![](./img/request.png)

[Demo](./request-validation-demo/)

### **Images API**
![](./img/images_api.png)

![](./img/images_api_2.png)

![](./img/images_api_3.png)
![](./img/images_api_4.png)

A composite key in DynamoDB consists of two elements

- Partition key - what partition to write the item to
- Sort key - to sort elements with the same partition key
- Together - uniquely identify an item, meaning there can be no two items in a table with the same values of the composite key.

NOTE. If a table has a composite key, there can be multiple items with the same partition key, providing they have different values of the sort key.

Composite keys allow to perform queries that can be used to get a subset of items with a specified partition key.

![](./img/images_api-5.png)


### **Queries With Node.js**


![](./img/queries.png)

An example of how to send a query to DynamoDB with Node.js.

```js
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

 const result = await dynamoDbDocument.query({
   TableName: 'GameScore',
   KeyConditionExpression: 'GameId = :gameId',
   ExpressionAttributeValues: {
     ':gameId': '10'
   }
 })

 const items = result.Items

```

**Path parameter**

![](./img/parameters.png)

`serverles.yml`
```yml
functions:
    GetOrders:
      handler: src/images.handler
      events:
        - http:
            method: get
            path: /groups/{groupId}/images

```
![](./img/parameters_2.png)




<hr>
<a name='schema8'></a>

## 8. Demo-Create DynamoDB table

[Create DynamoDB](./create-dynamodb-table-demo/)

### **Create DynamoDB table**
Creating the table will be completed by defining it in serverless config to provision the table

In `serverless.yml`:

1. Define the name of the table as an environmental variable.
- Allows other places in the serverless config to refer to it
- Allows Lambda functions to have access to it to perform DynamboDB requests
Format:
```
<name of table>-<name of the stage where application is deployed>
```
2. Add definition of DynamoDB table
- Add `resources` where CloudFormation definition is added
- Add `Resources` which is the start of the CloudFormation definition and defines the `KeySchema`, `Type`, `Properties`, and `BillingMode`.

### **Connecting API To DynamoDB**
Read Data from DynamoDB Table.

In the current application, data can not yet be written to DynamoDB, so to test reading functionality, the table data will need to be manually inputted.


**Added Dependencies**
- client-dynamodb - a low-level DynamoDB client
- lib-dynamodb - a high-level DynamoDB client

In `getGroups.js`
- remove the static data
- add `import {DynamoDB}` from low-level client and `import {DynamoDBDocument}` from high-level client
- include name of the table `const groupsTable = process.env.GROUPS_TABLE`
- to read items from the table use `scan` on the high-level client name and specify the `TableName` .
- Use the `items` field to get the list of items on the result to return to the API caller.** **
**Permissions In** `serverles.yml`
- Specify the IAM role for the Lambda function and provide the statements for the role
```yml
 iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Scan
          Resource: arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.GROUPS_TABLE}
```

Sample code to read data from DynamoDB:
```
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
 ...
const result = await dynamoDbClient.scan({ // Call parameters
  TableName: "Users",
  Limit: 20
})
```

**Verify Application Can Read Table**
Populate the table manually using the DynamoDB dashboard

- Click on Tables in the dashboard menu and click the table name
-  Click the Actions button and select Create Item
- Define item attributes and create item
- In the Terminal, enter: `curl --location --request GET <specify endpoint>`

**Manually Create Item in DynamoDB Table**
![](./img/create_items.png)
- JSON View
```json
{
 "id": "1",
 "name": "Dogs",
 "description": "Only dog images here!"
}
```
- Create item
![](./img/create_items_2.png)

```bash
(base) ➜  backend git:(main) ✗ curl --location --request GET  https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups

{"items":[{"description":"Only dog images here!","id":"1","name":"Dogs"}]}%     
```

<hr>
<a name='schema9'></a>

[Create Group](./create-group-api-starter/)

## 9. Exercise: Create new group API
In this exercise, you will continue building the API of our application. You will add a new endpoint that allows creating a new image group.

This endpoint will have the path `/gropus` and handle `HTTP POST methods`. To create a new method, we will send a JSON object with two fields, `name`, and `description`, like this:
```json
{
  "name": "Cities",
  "description": "Creative display of urban settings"
}
```

If a new group was successfully created it should return a JSON with a single field newItem that contains data about the newly created item, including an autogenerated ID:
```json

{
  "newItem": {
    "id":"937ea8f3-6342-4b9c-aee5-f3aa02de35ed",
    "name": "Cities",
    "description": "Creative display of urban settings"
  }
}
```
Make sure you use the same field names in our implementation so it works with the web frontend.

**Lambda function**
As the first step in this exercise, you would need to implement the Lambda function that will handle an HTTP request.
```js
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const groupsTable = process.env.GROUPS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const itemId = uuidv4()

  const parsedBody = JSON.parse(event.body)

  // TODO: Implement the function
}
```
In the starter code, we generate a random UUID using the uuid library that we will use as the ID for the DynamoDB item. We also parse the JSON body of the incoming request that contains name and description fields.

To handle a request, you will need to:

- Write a new item to DynamoDB using the `PutItem` method
- Return a response that contains information about the newly created item
Make sure that you return the correct CORS-related headers.

**Serverless.yaml changes**

Once you have the Lambda function implementation, you will need to add a definition for the new method. It should look similar to the definition we already have in the configuration file.
```yml
functions:
  GetGroups:
    handler: src/lambda/http/getGroups.handler
    events:
      - http:
          method: get
          path: groups
          cors: true
  ## TODO: Add a function definition
```

You would also need to update the IAM role definition so that the new Lambda function can create new DynamoDB items.
```yml
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Scan
            # TODO: Add PutItem permissions
          Resource: arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.GROUPS_TABLE}
```


**How to test**
Once you have these changes ready, you will need to install dependencies and deploy the application:
```bash
npm install
```
```bash
serverless deploy
```
```bash
(base) ➜  backend git:(main) ✗ sls deploy

Deploying serverless-udagram-app to stage dev (us-east-1)

✔ Service deployed to stack serverless-udagram-app-dev (72s)

endpoints:
  GET - https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups
  POST - https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups
functions:
  GetGroups: serverless-udagram-app-dev-GetGroups (2.6 MB)
  CreateGroups: serverless-udagram-app-dev-CreateGroups (2.6 MB)

Monitor all your API routes with Serverless Console: run "serverless --console"

```

```
curl --location --request POST 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Name",
    "description": "2345"
}'
```

![add items](./img/add_items.png)




**Client application**


Once the above works, you can see if the application's frontend works with the API. You would first need to update the `.env` file to point the application to your API. Next, you would need to replace the configuration value for `REACT_APP_API_ENDPOINT` with the URL of your API (note that it has the /dev path but no /groups):
```
// client/.env
REACT_APP_API_ENDPOINT=https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups
``` 

![client](./img/client.png)


<hr>
<a name='schema10'></a>


## 10. Demo Requests validation

At this point in our application, a user can create an object with any data field because the application is not validating incoming requests. To fix this, we will implement validation for the `POST/groups` method.

Define a json schema for an image group by:

- Create a folder `models` to put all json schemas for the project
- In `models` create a file for the json schema for the image groups `create-group-request.json`
- In the file add the version schema, title, type and properties
- Add schema to the function definition in `serverless.yml` by adding a request field and specifying the schema endpoint.
```yml
request:
            schemas:
              application/json: ${file(models/create-group-request.json)}
```
**Test** 

```bash
curl --location --request POST 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name1": "Name",
    "description": "2345"
}'
```

```bash
{"message": "Invalid request body"}%   
```

<hr>
<a name='schema11'></a>


## 11. Exercise: Get images api starter

[Get images api starter](./get-images-api-starter/)

We will continue building an API for our application, and in this exercise, you will implement a new endpoint to fetch metadata for all images from a single image group. We won't work with image files yet, and this is something we will develop later. Instead, in this exercise, we will implement API to get metadata about images.


We will define a new table to store image metadata and a Lambda function that returns items from it.



You can create image metadata using the `POST /groups/{groupId}/images` endpoint. Here is an example of a curl command to do it:
```
curl --location --request POST '{Endpoint images}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "New image"
}'
``` 
The web application has been updated to allow getting a list of images from a group and creating a new image in a particular group.

**Implementing a Lambda function**
As always, we will start implementing a Lambda function, but it will be a bit more complex than what we wrote before.

To return a list of images in the groups, you wound need to do the following steps:

- Check if a group with the provided ID exists
  - If the group does not exist, return a result with a 404 error code
  - If the group exists, use the DynamoDB's Query method to fetch a list of images in the group

To get a list of items from a group, you would have to use the Query action and specify an ID of a group from which to get a list of images. You can use the groupExists function to check if a group with the specified ID exists.


**Serverless configuration**
After you've implemented the Lambda function, you would to make a few changes to the `serverless.yaml` file. These changes, too, will be slightly more complex than before.

First, you need to define a new table name for the table where we will store images.

You would then need to define a resource definition for the new DynamoDB table. The main difference between the existing table and the images' table is that the new table will have a composite key with two fields:

- `groupId`(Partition key) - an ID of a group where an image is located
- `timestamp` (Sort key) - a string timestamp for when an image was created

We must also add permissions for our Lambda functions to use the new table. You would need to add a new statement that allows using `dynamodb:Query` and `dynamodb:PutItem` actions on it.

Finally, you would need to add a function definition that handles GET request to the `/gropus/{groupId}/images` path.

**Testing**
Just as before, you first need to deploy your application which you can do using the following commands:
```bash
npm install
```
```bash
serverless deploy
```
To test your implementation, you would need to do the following three steps:

- Create a new group
- Create a new image object
- Fetch all images for the group (using the endpoint you've implemented)


**Create a new group**
To create a new group, you would need to use the following `curl` command:
```bash
curl --location --request POST '{endpoint create group}' --header 'Content-Type: application/json' --data-raw '{
    "name": "Name",
    "description": "2345"
}'

```

```bash
(base) ➜  backend git:(main) ✗ curl --location --request POST 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups' --header 'Content-Type: application/json' --data-raw '{
    "name": "Namesssss",
    "description": "234523456"
}'
{"newItem":{"id":"9d946566-5d3d-4918-b6cb-2c6b24500a71","name":"Namesssss","description":"234523456"}}%  
```

**Create a new image**
Now having a new group, we can create an image in this group. We can do this using the following command (Make sure to replace {your-group-id} with the group ID you got in the previous step):
```bash
curl --location --request POST '{endpoint images}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "New image"
}'
```

```bash
curl --location --request POST 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups/9d946566-5d3d-4918-b6cb-2c6b24500a71/images' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer FwoGZXIvYXdzEJP//////////wEaDFoC0+d9af1ErFDzPSLVAUk2S0eaUcGeJrfuF6+gSySuOq6rGjrEk1nyBWGhwV68Pdup4Tbw+RY6ZO9F7l0KS6N6mJzg72Y4Ebq6jmejMWIjn8WZL5YAz7mOoHBuxgHEpT4dHx4qhqL6K3zlGZrPNylxPOUyZxNIUWJ1VhFpYXHhol7NDE96ZCDd5wbvca2lsE2iDipc7GWV7a9cMDRIwFRID+P798m8yarEtiL5ItihD2pKH7HM1aEHIIeXuHAhzabRgsF6i9K3DyQdQk9qDO7ATd2EFF+CtF0Os3aPtvDZosZ5cSiKqNCvBjItmHkHYMcb42AFCScgmgP3B6aiNE6AD2UwPZzc4JxdYf8ZHMpIMk4cXX2MEjkj' \
--data-raw '{
  "title": "New image"
}'

{"newItem":{"groupId":"9d946566-5d3d-4918-b6cb-2c6b24500a71","timestamp":"2024-03-15T11:40:11.936Z","imageId":"baacdc31-4917-483f-bcb7-ca935530bb3a","title":"New image"}}%   
```


**Fetching all images from a group (using the endpoint you've implemented)**
Now, having an image in the database, we can fetch all images from the group. To do this, we will use the endpoint you've implemented in this exercise:
```bash
curl --location --request GET '{endpoint images}'

```

<hr>
<a name='schema12'></a>


## 12. Demo: Get image by ID

[Demo Get Image by ID](./7-get-images-api-starter/)


- Add a globarl secondary index for the Images tables
- Query images by image ID using the GSI

**Serverless configuration** `serverles.yml`
```yml
 IMAGE_ID_INDEX: ImageIdIndex
```

```yml
GetImage:
    handler: src/lambda/http/getImage.handler
    events:
      - http:
          method: get
          path: images/{imageId}
          cors: true

```

Add GlobalSecondaryIndexes
```yml
 GlobalSecondaryIndexes:
          - IndexName: ${self:provider.environment.IMAGE_ID_INDEX}
            KeySchema:
            - AttributeName: imageId
              KeyType: HASH
            Projection:
              ProjectionType: ALL
```
IAmM permission
```yml
- Effect: Allow
          Action:
            - dynamodb:Query
          Resource: arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.IMAGES_TABLE}/index/${self:provider.environment.IMAGE_ID_INDEX}

```
**Implementing a Lambda function**

[getImage](./7-get-images-api-starter/backend/src/lambda/http/getImage.js)


<hr>
<a name='schema13'></a>

## 13. Event Processing


![](./img/procesing_1.png)

![](./img/procesing_2.png)



### **Cloudformation References**

![S3](./img/s3_2.png)

![S3](./img/s3_3.png)


In YAML files we can use one of the two forms:
```
Ref: logicalName
```
Short form:
```
!Ref logicalName
```
Ref function will return different values depending on what resource type it is used with.


**Processing S3 Events**

![](./img/s3_4.png)

Here is a configuration snippet that can be used to subscribe to S3 events:
```yml
functions:
  process:
    handler: file.handler
    events:
      - s3: bucket-name
        event: s3:ObjectCreated:*
        rules:
            - prefix: images/
            - suffix: .png


```
Use an existing bucket without creating a new one existing
```yml
functions:
  process:
    handler: file.handler
    events:
      - s3: bucket-name
        event: s3:ObjectCreated:*
        existing: true
        rules:
            - prefix: images/
            - suffix: .png
```

[Demo S3 Events](./10-s3-events-demo/)










<hr>
<a name='schema14'></a>

## 14. Demo - Create an S3 Bucket

[Demo - Create an S3 Bucket](./8-create-s3-bucket-demo/)

- Define an S3 bucket resource
  -  Anybody can read images from it
  - Need IAM permissions to write to it
- Will generate presigned URLs later


**Serverless configuration** `serverles.yml`

Environment
```yml
  IMAGES_S3_BUCKET: udagram-images-${self:provider.stage}
```
Resource
```yml
AttachmentsBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:provider.environment.IMAGES_S3_BUCKET}
        PublicAccessBlockConfiguration:
          BlockPublicPolicy: false
          RestrictPublicBuckets: false
        CorsConfiguration:
          CorsRules:
            -
              AllowedOrigins:
                - '*'
              AllowedHeaders:
                - '*'
              AllowedMethods:
                - GET
                - PUT
                - POST
                - DELETE
                - HEAD
              MaxAge: 3000
```
Resource
```yml
  BucketPolicy:
      Type: AWS::S3::BucketPolicy
      Properties:
        PolicyDocument:
          Id: MyPolicy
          Version: "2012-10-17"
          Statement:
            - Sid: PublicReadForGetBucketObjects
              Effect: Allow
              Principal: '*'
              Action: 's3:GetObject'
              Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'
        Bucket: !Ref AttachmentsBucket
```

IAM Role
```yml
  - Effect: Allow
          Action:
            - s3:PutObject
            - s3:GetObject
          Resource: arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*
```


**How to test**
Once you have these changes ready, you will need to install dependencies and deploy the application:
```bash
npm install
```
```bash
serverless deploy
```

![S3](./img/s3.png)


<hr>
<a name='schema14'></a>

## 14. Exercise: Presigned URL
In this exercise, you will implement a new feature that will allow clients to upload images to S3. To implement this, we will update the `createImage` function to return a presigned URL. A client will then use this URL to upload an image to S3 for others to read later. We will see how to generate a presigned URL and how to use it with `curl`.

**Implementing a Lambda function**
`createimage.js`

```js
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
```

**Serverless configuration** `serverles.yml`
- Add Eviroment
- IAM Role
- Resource
Resource
```yml
  BucketPolicy:
      Type: AWS::S3::BucketPolicy
      Properties:
        PolicyDocument:
          Id: MyPolicy
          Version: "2012-10-17"
          Statement:
            - Sid: PublicReadForGetBucketObjects
              Effect: Allow
              Principal: '*'
              Action: 
                - 's3:GetObject'
                - 's3:PutObject'
              Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'
        Bucket: !Ref AttachmentsBucket
```

**How to test**
Once you have these changes ready, you will need to install dependencies and deploy the application:
```bash
npm install
```
```bash
serverless deploy
```


```
curl --location --request POST 'https://1w996fun5l.execute-api.us-east-1.amazonaws.com/dev/groups/62651bed-9edd-4eb6-aba7-050610431ee3/images' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "wilfredaaaa"
}'
```



We can use imageUrl to upload an image to S3 using the following curl command:
```bash
curl -X PUT -T img/mono.jpeg -L "http://udagram-images-925845050374-dev.s3.amazonaws.com/a75d256a-3380-4478-aaf4-52e4c08bfb5f" 

```

**Client application**

```bash
npm install
```

```bash
npm start
```

![](./img/s3_upload.png)




<hr>
<a name='schema16'></a>

## 16. Demo S3 Events