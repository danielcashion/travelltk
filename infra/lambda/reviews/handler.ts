import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;
  const tripId = event.queryStringParameters?.tripId;

  if (method === "GET") {
    if (!tripId) return json(400, { error: "tripId required" });
    const result = await ddb.query(`TRIP#${tripId}`);
    const reviews = (result.Items ?? []).filter((item) =>
      String(item.sk).startsWith("REVIEW#"),
    );
    return json(200, reviews);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const reviewId = String(body.id ?? `rev-${Date.now()}`);
    const item = {
      pk: `TRIP#${body.tripId}`,
      sk: `REVIEW#${reviewId}`,
      ...body,
      id: reviewId,
      createdAt: new Date().toISOString(),
    };
    await ddb.put(item);
    return json(201, item);
  }

  return json(405, { error: "method not allowed" });
}
