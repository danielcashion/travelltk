import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;
  const id = event.pathParameters?.id;

  if (method === "GET" && id) {
    const result = await ddb.get(`USER#${id}`, "PROFILE");
    if (!result.Item) return json(404, { error: "not found" });
    return json(200, result.Item);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const cognitoSub = String(body.cognitoSub ?? "");
    if (!cognitoSub) return json(400, { error: "cognitoSub required" });
    const item = {
      pk: `USER#${cognitoSub}`,
      sk: "PROFILE",
      gsi1pk: `EMAIL#${String(body.email ?? "").toLowerCase()}`,
      gsi1sk: "USER",
      id: `user-${cognitoSub}`,
      email: body.email,
      name: body.name,
      avatarUrl: body.avatarUrl ?? null,
      cognitoSub,
      role: body.role ?? "shopper",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await ddb.put(item);
    return json(200, item);
  }

  return json(405, { error: "method not allowed" });
}
