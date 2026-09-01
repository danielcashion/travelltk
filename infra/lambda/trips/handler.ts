import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ddb, json, parseBody } from "../shared/ddb";

export async function handler(event: APIGatewayProxyEventV2) {
  const method = event.requestContext.http.method;
  const id = event.pathParameters?.id;
  const handle = event.pathParameters?.handle;
  const qs = event.queryStringParameters ?? {};

  if (method === "GET" && handle) {
    const found = await ddb.queryGsi(`HANDLE#${handle}`);
    return json(200, found.Items?.[0] ?? null);
  }

  if (method === "GET" && id) {
    const result = await ddb.get(`TRIP#${id}`, "METADATA");
    if (!result.Item) return json(404, { error: "not found" });
    const legs = await ddb.query(`TRIP#${id}`);
    return json(200, { ...result.Item, days: groupDays(legs.Items ?? []) });
  }

  if (method === "GET") {
    const gsi1pk = qs.creatorId
      ? `CREATOR#${qs.creatorId}`
      : qs.category
        ? `CATEGORY#${qs.category}`
        : qs.destination
          ? `DEST#${qs.destination.toLowerCase()}`
          : "STATUS#published";
    const result = await ddb.queryGsi(gsi1pk);
    return json(200, result.Items ?? []);
  }

  if (method === "POST") {
    const body = parseBody(event);
    const tripId = String(body.id ?? `trip-${Date.now()}`);
    const item = {
      pk: `TRIP#${tripId}`,
      sk: "METADATA",
      gsi1pk: `STATUS#${body.status ?? "draft"}`,
      gsi1sk: `DATE#${new Date().toISOString()}`,
      ...body,
      id: tripId,
    };
    await ddb.put(item);
    return json(201, item);
  }

  if (method === "PUT" && id) {
    const body = parseBody(event);
    const item = { pk: `TRIP#${id}`, sk: "METADATA", ...body, id };
    await ddb.put(item);
    return json(200, item);
  }

  if (method === "DELETE" && id) {
    await ddb.remove(`TRIP#${id}`, "METADATA");
    return json(204, {});
  }

  return json(405, { error: "method not allowed" });
}

function groupDays(items: Record<string, unknown>[]) {
  const legs = items.filter((item) => String(item.sk).startsWith("LEG#"));
  const byDay = new Map<number, Record<string, unknown>[]>();
  for (const leg of legs) {
    const day = Number(leg.dayNumber ?? 1);
    byDay.set(day, [...(byDay.get(day) ?? []), leg]);
  }
  return [...byDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([dayNumber, dayLegs]) => ({ dayNumber, legs: dayLegs }));
}
