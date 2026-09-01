import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const token = env.INSTAGRAM_ACCESS_TOKEN;
const id = env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
if (!token || !id) {
  console.error("missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID");
  process.exit(1);
}

function redact(value) {
  return JSON.parse(
    JSON.stringify(value, (key, v) => {
      if (
        key === "access_token" ||
        (typeof v === "string" && v.includes("access_token="))
      ) {
        return "[redacted]";
      }
      return v;
    }),
  );
}

async function getJson(url) {
  const res = await fetch(url);
  const json = await res.json();
  return { status: res.status, json };
}

const q = new URLSearchParams({ access_token: token });

const debug = await getJson(
  `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(token)}&${q}`,
);
const data = debug.json.data || {};
console.log(
  JSON.stringify(
    {
      tokenValid: data.is_valid,
      appName: data.application,
      appId: data.app_id,
      type: data.type,
      scopes: data.scopes,
      hasInsights: Array.isArray(data.scopes)
        ? data.scopes.includes("instagram_manage_insights")
        : false,
      expiresAt: data.expires_at,
      dataAccessExpiresAt: data.data_access_expires_at,
    },
    null,
    2,
  ),
);

const fields = `business_discovery.username(eileengu){username,name,followers_count,profile_picture_url,media.limit(1){media_type,permalink,media_url,thumbnail_url}}`;
const discovery = await getJson(
  `https://graph.facebook.com/v21.0/${id}?fields=${encodeURIComponent(fields)}&${q}`,
);
const err = discovery.json.error;
if (err) {
  console.log(
    JSON.stringify(
      {
        discovery: "failed",
        http: discovery.status,
        code: err.code,
        type: err.type,
        message: err.message,
      },
      null,
      2,
    ),
  );
} else {
  const d = discovery.json.business_discovery || {};
  console.log(
    JSON.stringify(
      {
        discovery: "ok",
        username: d.username,
        name: d.name,
        followers: d.followers_count,
        hasProfilePic: Boolean(d.profile_picture_url),
        latestMediaType: d.media?.data?.[0]?.media_type ?? null,
        hasMediaUrl: Boolean(
          d.media?.data?.[0]?.media_url || d.media?.data?.[0]?.thumbnail_url,
        ),
      },
      null,
      2,
    ),
  );
}
