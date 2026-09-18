import { ImageResponse } from "next/og";

export const alt = "The Angle Report — Ideas from every side.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020D21",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#38BDF8",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            the
          </div>
          <div
            style={{
              display: "flex",
              color: "#F8FAFC",
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            angle report.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#55C8FF",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Ideas from every side.
          </div>
          <div
            style={{
              display: "flex",
              color: "#9CB0C5",
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 820,
            }}
          >
            Finish today’s biggest stories in 60 seconds.
          </div>
        </div>
      </div>
    ),
    size
  );
}
