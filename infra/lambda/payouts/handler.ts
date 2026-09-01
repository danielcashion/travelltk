import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;
  const creatorId = event.queryStringParameters?.creatorId;

  if (method === "GET") {
    if (!creatorId) return json(400, { error: "creatorId required" });
    const result = await ddb.queryGsi(`CREATOR#${creatorId}`, "PAYOUT#");
    return json(200, result.Items ?? []);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const payoutId = String(body.id ?? `po-${Date.now()}`);
    const item = {
      pk: `PAYOUT#${payoutId}`,
      sk: "METADATA",
      gsi1pk: `CREATOR#${body.creatorId}`,
      gsi1sk: `PAYOUT#${payoutId}`,
      ...body,
      id: payoutId,
      status: body.status ?? "pending",
      createdAt: new Date().toISOString(),
    };
    await ddb.put(item);
    return json(201, item);
  }

  return json(405, { error: "method not allowed" });
}
