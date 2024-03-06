# 4-Develop-Deploy-Serverless-Apps



1. [Developing and Deploying Serverless](#schema1)

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