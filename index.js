(() => {
  let editor;

  window.onload = () => {
    editor = CodeMirror(document.getElementById('editor'), {
      mode: { name: "javascript", json: true },
      lineNumbers: true,
      tabSize: 2,
      value: JSON.stringify({
        nodes: [
          { id: "A", text: "User clicks" },
          { id: "B", text: "Is logged in?" },
          { id: "C", text: "Show dashboard" },
          { id: "D", text: "Redirect to login" }
        ],
        edges: [
          { from: "A", to: "B" },
          { from: "B", to: "C", label: "Yes" },
          { from: "B", to: "D", label: "No" }
        ]
      }, null, 2)
    });

    editor.on("change", render);
    render();
  };

  async function loadJsonFromUrl() {
    const url = document.getElementById('jsonUrl').value;
    if (!url) return alert("Enter a JSON URL.");
    try {
      const res = await fetch(url);
      const data = await res.json();
      editor.setValue(JSON.stringify(data, null, 2));
    } catch {
      alert("Invalid or inaccessible JSON URL.");
    }
  }

  function jsonToMermaid(json) {
    let code = 'graph TD\n';
    json.nodes.forEach(n => {
      const shape = n.text.includes('?') ? `{${n.text}}` : `[${n.text}]`;
      code += `  ${n.id}${shape}\n`;
    });
    json.edges.forEach(e => {
      const label = e.label ? `|${e.label}|` : '';
      code += `  ${e.from} -->${label} ${e.to}\n`;
    });
    return code;
  }

  async function render() {
    const diagram = document.getElementById('diagram');
    try {
      const json = JSON.parse(editor.getValue());
      const code = jsonToMermaid(json);
      diagram.innerHTML = `<div class="mermaid">${code}</div>`;
      await mermaid.init(undefined, diagram.querySelectorAll('.mermaid'));

      setTimeout(() => {
        const labels = diagram.querySelectorAll('.nodeLabel');
        labels.forEach(label => {
          label.style.cursor = 'pointer';
          label.onclick = () => {
            const nodeText = label.textContent.trim();
            const json = JSON.parse(editor.getValue());
            const matchedNode = json.nodes.find(n => n.text === nodeText);

            if (!matchedNode || !matchedNode.image) {
              alert('No image for this node');
              return;
            }

            let overlay = document.getElementById('imgOverlay');
            if (!overlay) {
              overlay = document.createElement('div');
              overlay.id = 'imgOverlay';
              Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                cursor: 'pointer',
              });
              document.body.appendChild(overlay);
              overlay.onclick = () => {
                overlay.style.display = 'none';
                overlay.innerHTML = '';
              };
            }

            overlay.innerHTML = '';
            const bigImg = document.createElement('img');
            bigImg.src = matchedNode.image;
            Object.assign(bigImg.style, {
              maxWidth: '90%',
              maxHeight: '90%',
              boxShadow: '0 0 20px white',
            });
            overlay.appendChild(bigImg);

            if (matchedNode.preview) {
              const caption = document.createElement('div');
              caption.textContent = matchedNode.preview;
              Object.assign(caption.style, {
                color: 'white',
                marginTop: '10px',
                textAlign: 'center',
                fontSize: '18px',
              });
              overlay.appendChild(caption);
            }

            overlay.style.display = 'flex';
          };
        });
      }, 100);
    } catch {
      diagram.innerHTML = '❌ Invalid JSON';
    }
  }

  window.loadJsonFromUrl = loadJsonFromUrl;
  window.downloadJson = () => {
    const blob = new Blob([editor.getValue()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flow.json';
    a.click();
  };

  window.downloadSvg = () => {
    const svg = document.querySelector('#diagram svg');
    if (!svg) return alert("Render failed.");
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'diagram.svg';
    a.click();
  };

  window.downloadPng = async () => {
    const svg = document.querySelector('#diagram svg');
    if (!svg) return alert('No diagram to download');
    const svgXml = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const bbox = svg.getBBox();
    canvas.width = bbox.width;
    canvas.height = bbox.height;
    const v = await window.canvg.fromString(ctx, svgXml);
    await v.render();
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  window.copyImage = () => {
    const svg = document.querySelector('#diagram svg');
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          .then(() => alert('Copied!'))
          .catch(() => alert('Failed to copy'));
      });
    };
    img.src = URL.createObjectURL(svgBlob);
  };
})();
