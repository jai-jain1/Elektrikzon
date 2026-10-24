// Shown at /studio until a real Sanity project ID is in .env.local.
// Inline styles: the website stylesheet is not loaded on Studio routes.
export function StudioNotConfigured() {
  const code: React.CSSProperties = {
    display: "block",
    padding: "12px 14px",
    borderRadius: 8,
    background: "#1d1d1f",
    color: "#f5f5f7",
    fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: 14,
    overflowX: "auto",
  };
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#f5f5f7",
        fontFamily: "system-ui, sans-serif",
        padding: "64px 20px",
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>ElektrikZone Studio is not connected yet</h1>
        <p>The Studio needs your Sanity project ID. Until then the website shows its sample catalogue.</p>
        <ol style={{ paddingLeft: 20 }}>
          <li>
            Open <strong>sanity.io/manage</strong>, choose your project and copy the <strong>Project ID</strong>.
          </li>
          <li>
            Open the file <strong>.env.local</strong> in the project folder and set:
            <code style={code}>NEXT_PUBLIC_SANITY_PROJECT_ID=yourprojectid</code>
          </li>
          <li>Stop the dev server (Ctrl+C) and start it again with npm run dev.</li>
        </ol>
      </div>
    </main>
  );
}
