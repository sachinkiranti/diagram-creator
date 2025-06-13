# 🧠 Diagram Creator

A simple, interactive JSON-based flowchart viewer using **Mermaid.js** and **CodeMirror**. Supports live editing, image previews, clickable links, and loading JSON via URL.

---

## ✨ Features

### 🔄 Live Editor
- Edit flowchart structure using JSON.
- Diagram updates automatically as you type.

### 🌐 Load JSON from URL
- Paste a URL to a `.json` file in the input box and click **Load**.
- Or add `?jsonUrl=YOUR_JSON_URL` in the browser address to auto-load.

### 🖼️ Image Support
- Add an `"image"` field to a node to display a 📷 icon.
- Clicking the node opens the image in a popup overlay.

### 🔗 Link Support
- Add a `"link"` field to a node to show a 🔗 icon.
- Clicking the node opens the link in a new browser tab.

### 📥 Export Options
- **Download** the flow as:
  - `flow.json`
  - `diagram.svg`
  - `diagram.png`
- Or **copy** the diagram as PNG to clipboard.

---

## 🧾 Sample JSON

```json
{
  "nodes": [
    { "id": "A", "text": "Start" },
    { "id": "B", "text": "Decision?", "image": "https://example.com/img.png" },
    { "id": "C", "text": "Learn More", "link": "https://example.com" }
  ],
  "edges": [
    { "from": "A", "to": "B" },
    { "from": "B", "to": "C", "label": "Yes" }
  ]
}
```

### 💡 URL Loading Example

```
https://www.raisachin.com.np/diagram-creator/?jsonUrl=https://raw.githubusercontent.com/sachinkiranti/diagram-creator/refs/heads/main/example.json
```