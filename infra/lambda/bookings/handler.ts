import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;
  const id = event.pathParameters?.id;
  const userId = event.queryStringParameters?.userId;

  if (method === "GET") {
    if (!userId) return json(400, { error: "userId required" });
    const result = await ddb.queryGsi(`USER#${userId}`, "BOOKING#");
    return json(200, result.Items ?? []);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const bookingId = String(body.id ?? `bkg-${Date.now()}`);
    const item = {
      pk: `BOOKING#${bookingId}`,
      sk: "METADATA",
      gsi1pk: `USER#${body.userId}`,
      gsi1sk: `BOOKING#${bookingId}`,
      ...body,
      id: bookingId,
      status: body.status ?? "pending_payment",
      createdAt: new Date().toISOString(),
    };
    await ddb.put(item);
    return json(201, item);
  }

  if (method === "PATCH" && id) {
    const body = parseBody(event);
    const updated = await ddb.updateStatus(
      `BOOKING#${id}`,
      "METADATA",
      String(body.status ?? "confirmed"),
    );
    return json(200, updated.Attributes ?? {});
  }

  return json(405, { error: "method not allowed" });
}
