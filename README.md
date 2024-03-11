# 4-Develop-Deploy-Serverless-Apps


0. [Configure AWS](#schema0)
1. [Developing and Deploying Serverless](#schema1)
2. [Introduction to Serverless](#schema2)
3. [Exercise: Serverless Lambda](#schema3)
4. [Exercise: Monitoring](#schema4)
5. [REST API](schema5)
6. [Exercise: Get Groups Starter](#schema6)

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