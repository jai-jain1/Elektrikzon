// A short guide pane shown first in the Studio menu.
const wrap: React.CSSProperties = { padding: "28px 24px", maxWidth: 640, lineHeight: 1.6, fontSize: 15 };
const h: React.CSSProperties = { fontSize: 22, margin: "0 0 12px" };
const note: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid rgba(212,162,76,0.6)",
  background: "rgba(212,162,76,0.1)",
  margin: "16px 0",
};

export function StartHere() {
  return (
    <div style={wrap}>
      <h2 style={h}>Welcome to the ElektrikZone Studio</h2>
      <div style={note}>
        <strong>Publish to make changes live on the website.</strong> Edits are saved as drafts until you press the green
        Publish button at the bottom right. The website updates within a few minutes.
      </div>
      <ol style={{ paddingLeft: 20 }}>
        <li>
          <strong>Site settings</strong>: add your WhatsApp number, address, hours and Instagram. Empty fields show as
          “[ADD: …]” on the site.
        </li>
        <li>
          <strong>Categories</strong>: the types of light you sell (Panel Lights, Strip Lights and so on). Delete any you
          do not stock. <strong>Subcategories</strong> are optional.
        </li>
        <li>
          <strong>Brands</strong>: names only, no logos. Add only brands you stock.
        </li>
        <li>
          <strong>Products by category</strong>: pick a type of light, then press the pencil icon to add a product to it.
          Fill in the wattage, light colours and a selling price, and turn <em>Sample listing</em> OFF for real products.
        </li>
        <li>
          <strong>Reels</strong>: paste Instagram links to show them on the Reels Wall.
        </li>
      </ol>
      <p style={{ opacity: 0.75 }}>
        Never store customer names, customer phone numbers or private notes here: everything in this Studio can be read
        publicly once published.
      </p>
    </div>
  );
}
