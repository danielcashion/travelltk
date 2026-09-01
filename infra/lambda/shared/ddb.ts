import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const TABLE = process.env.TABLE_NAME ?? "TravelLtk";

export const ddb = {
  get: (pk: string, sk: string) =>
    client.send(new GetCommand({ TableName: TABLE, Key: { pk, sk } })),
  put: (item: Record<string, unknown>) =>
    client.send(new PutCommand({ TableName: TABLE, Item: item })),
  query: (pk: string) =>
    client.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
      }),
    ),
  queryGsi: (gsi1pk: string, begins?: string) =>
    client.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "gsi1",
        KeyConditionExpression: begins
          ? "gsi1pk = :pk AND begins_with(gsi1sk, :sk)"
          : "gsi1pk = :pk",
        ExpressionAttributeValues: begins
          ? { ":pk": gsi1pk, ":sk": begins }
          : { ":pk": gsi1pk },
      }),
    ),
  updateStatus: (pk: string, sk: string, status: string) =>
    client.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { pk, sk },
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status },
        ReturnValues: "ALL_NEW",
      }),
    ),
  remove: (pk: string, sk: string) =>
    client.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk } })),
};

export function json(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function parseBody(event: { body?: string | null }) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body) as Record<string, unknown>;
  } catch {
    return {};
  }
}
