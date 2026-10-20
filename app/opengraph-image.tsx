import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Samuel — I build software in public. Here's the deeper cut.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The photo doesn't depend on the request, so read it once at module scope.
const photo = `data:image/jpeg;base64,${await readFile(join(process.cwd(), "assets/og-photo.jpg"), "base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#ffffff", padding: 64, gap: 56 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Samuel</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
            <span>I build software</span>
            <span>in public.</span>
            <span style={{ color: "#6b6b6b", fontSize: 54, marginTop: 8 }}>Here&apos;s the deeper cut.</span>
          </div>
          <div style={{ fontSize: 22, color: "#a3a3a3" }}>mericot.com · the weekly write-up</div>
        </div>
        <img src={photo} width={400} height={502} style={{ objectFit: "cover", alignSelf: "center" }} alt="" />
      </div>
    ),
    size,
  );
}
