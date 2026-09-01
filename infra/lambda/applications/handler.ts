import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;

  if (method === "GET") {
    const result = await ddb.queryGsi("APPLICATIONS", "DATE#");
    return json(200, result.Items ?? []);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const applicationId = `app-${Date.now()}`;
    const item = {
      pk: `APPLICATION#${applicationId}`,
      sk: "METADATA",
      gsi1pk: "APPLICATIONS",
      gsi1sk: `DATE#${new Date().toISOString()}`,
      ...body,
      id: applicationId,
      createdAt: new Date().toISOString(),
    };
    await ddb.put(item);
    return json(201, item);
  }

  return json(405, { error: "method not allowed" });
}
