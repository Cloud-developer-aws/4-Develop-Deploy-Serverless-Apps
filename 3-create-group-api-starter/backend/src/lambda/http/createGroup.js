import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const groupsTable = process.env.GROUPS_TABLE

export async function handler(event) {
  console.log("Processing event: ", event);
  const itemId = uuidv4();

  const parsedBody = JSON.parse(event.body);

  // TODO: Implement the function
  const newItem = {
    id: itemId,
    ...parsedBody,
  };
  await dynamoDbDocument.put({
    TableName: groupsTable,
    Item: newItem,
  });
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*', // Permitir solicitudes desde cualquier origen
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET', // Permitir métodos HTTP específicos
      'Access-Control-Allow-Headers': 'Content-Type,Authorization', // Permitir encabezados personalizados y de autorización
      'Access-Control-Allow-Credentials': true // Permitir el envío de credenciales (por ejemplo, cookies)
   
    },
    body: JSON.stringify({
      newItem,
    }),
  };
}