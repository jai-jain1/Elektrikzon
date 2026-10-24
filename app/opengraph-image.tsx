import { ImageResponse } from "next/og";

export const alt = "ElektrikZone · Electrical products, wholesale and retail, Ulhasnagar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge runtime: the Node build of @vercel/og fails on Windows paths with spaces.
export const runtime = "edge";

// Generated at build time: no remote images or fonts.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), rgba(0,0,0,0) 60%), #000000",
          color: "#F5F5F7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "3px solid #A1A1A6",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#F5F5F7" }} />
          </div>
          <div style={{ display: "flex", fontSize: 40 }}>
            Elektrik<span style={{ color: "#86868B" }}>Zone</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Light, power and control, chosen with care.
          </div>
          <div style={{ fontSize: 28, color: "#86868B" }}>
            Electrical products · Wholesale and retail · Ulhasnagar, Maharashtra
          </div>
        </div>
      </div>
    ),
    size,
  );
}
