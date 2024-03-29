import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../auth/utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const groupsTable = process.env.GROUPS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const itemId = uuidv4()

  const parsedBody = JSON.parse(event.body)

  const authorization = event.headers.Authorization;
  // TODO: Extract user ID using "getUserId"
  const userId = getUserId(authorization)
  const newItem = {
    id: itemId,
    // TODO: Add "userId" field to the new item
    userId,
    ...parsedBody
  }

  await dynamoDbClient.put({
    TableName: groupsTable,
    Item: newItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}