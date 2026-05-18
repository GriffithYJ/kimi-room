"use client";

// Tiny "export ↓" link that dumps a list of localStorage keys into a JSON file
// download. Used as a safety net before DB-primary migration ships, so any
// device-side state (calendar entries, taste cards) can be re-imported if
// localStorage gets wiped.

type Props = {
  keys: string[];
  filename: string; // base name, no extension; date stamp appended
  color: string;
  fontFamily?: string;
};

export function ExportLocalStorageButton({
  keys,
  filename,
  color,
  fontFamily,
}: Props) {
  function handleExport() {
    try {
      const dump: Record<string, unknown> = {};
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw == null) continue;
        try {
          dump[k] = JSON.parse(raw);
        } catch {
          dump[k] = raw;
        }
      }
      const payload = {
        exportedAt: new Date().toISOString(),
        keys,
        data: dump,
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date();
      const stamp = `${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}`;
      a.href = url;
      a.download = `${filename}-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("[export-local]", e);
      alert("Export failed.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      aria-label="Export local data as JSON"
      title="Export local data (JSON backup)"
      style={{
        background: "transparent",
        border: "none",
        color,
        fontSize: 9,
        fontStyle: "italic",
        letterSpacing: 1,
        opacity: 0.55,
        cursor: "pointer",
        padding: "2px 4px",
        fontFamily: fontFamily ?? "inherit",
      }}
    >
      ↓ export
    </button>
  );
}
