import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/images/travelltk_logo_white.png"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0e5c59",
          color: "#f7f1e8",
        }}
      >
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          alt="TravelLTK"
          width={420}
          height={143}
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
        <div style={{ fontSize: 56, marginTop: 36, maxWidth: 900, lineHeight: 1.15 }}>
          Book the trip, not just the inspiration.
        </div>
      </div>
    ),
    size,
  );
}
