const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const OUT_DIR = path.join(__dirname, '_site');
const README = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8');

// Shared slug function
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')       // strip HTML tags
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Extract headings for sidebar TOC
const tocEntries = [];
const headingRegex = /^(#{1,3})\s+(.+)$/gm;
let match;
while ((match = headingRegex.exec(README)) !== null) {
  const level = match[1].length;
  const text = match[2].trim();
  tocEntries.push({ level, text, slug: slugify(text) });
}

// Custom renderer
const renderer = new marked.Renderer();

renderer.heading = function ({ text, depth }) {
  const slug = slugify(text);
  return `<h${depth} id="${slug}">${text}</h${depth}>\n`;
};

renderer.code = function ({ text, lang }) {
  if (lang === 'mermaid') {
    return `<pre class="mermaid">${text}</pre>`;
  }
  return `<pre><code class="language-${lang || ''}">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
};

// Strip the markdown TOC (the list of links between the h1 and first paragraph)
const readmeWithoutToc = README.replace(
  /^(# .+\n)\n*(?:- \[.*\]\(#.*\)\n(?:  .*\n)*)+\n*/m,
  '$1\n'
);

marked.setOptions({ renderer });

const htmlContent = marked.parse(readmeWithoutToc);

// Build sidebar HTML
function buildSidebar(entries) {
  let html = '<nav class="sidebar" id="sidebar">\n';
  html += '  <div class="sidebar-header">\n';
  html += '    <img src="logo.svg" alt="NearForm" class="logo" />\n';
  html += '  </div>\n';
  html += '  <ul class="toc">\n';

  for (const entry of entries) {
    const indent = entry.level - 1;
    html += `    <li class="toc-level-${entry.level}" style="padding-left: ${indent * 12}px">\n`;
    html += `      <a href="#${entry.slug}">${entry.text}</a>\n`;
    html += `    </li>\n`;
  }

  html += '  </ul>\n';
  html += '</nav>\n';
  return html;
}

const sidebar = buildSidebar(tocEntries);

const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AINE - AI-Native SDLC Reference Architecture</title>
  <style>
    :root {
      --nf-dark: #0f1923;
      --nf-navy: #1a2b3c;
      --nf-green: #00d26a;
      --nf-green-dim: #00b35a;
      --nf-text: #e0e6ed;
      --nf-text-muted: #8899aa;
      --nf-border: #2a3b4c;
      --nf-code-bg: #162230;
      --nf-sidebar-w: 300px;
      --nf-hover-bg: #1e3044;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html { scroll-behavior: smooth; scroll-padding-top: 24px; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--nf-dark);
      color: var(--nf-text);
      line-height: 1.7;
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: var(--nf-sidebar-w);
      height: 100vh;
      background: var(--nf-navy);
      border-right: 1px solid var(--nf-border);
      overflow-y: auto;
      z-index: 100;
      transition: transform 0.3s ease;
    }

    .sidebar-header {
      padding: 28px 20px;
      border-bottom: 1px solid var(--nf-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-header .logo {
      height: 22px;
      width: auto;
    }

    .toc {
      list-style: none;
      padding: 12px 0;
    }

    .toc li {
      margin: 0;
    }

    .toc a {
      display: block;
      padding: 6px 20px;
      color: var(--nf-text-muted);
      text-decoration: none;
      font-size: 13px;
      line-height: 1.4;
      border-left: 3px solid transparent;
      transition: all 0.15s ease;
    }

    .toc a:hover {
      color: var(--nf-text);
      background: var(--nf-hover-bg);
    }

    .toc a.active {
      color: var(--nf-green);
      border-left-color: var(--nf-green);
      background: var(--nf-hover-bg);
    }

    .toc-level-1 a { font-weight: 600; font-size: 14px; }
    .toc-level-2 a { font-weight: 500; }
    .toc-level-3 a { font-size: 12.5px; }
    .toc-level-4 a { font-size: 12px; }

    /* Main content */
    .content {
      margin-left: var(--nf-sidebar-w);
      flex: 1;
      max-width: 900px;
      padding: 48px 64px;
    }

    /* Mobile toggle */
    .menu-toggle {
      display: none;
      position: fixed;
      top: 16px; left: 16px;
      z-index: 200;
      background: var(--nf-navy);
      border: 1px solid var(--nf-border);
      color: var(--nf-text);
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
    }

    /* Typography */
    .content h1 {
      font-size: 2rem;
      color: #fff;
      margin: 0 0 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--nf-green);
    }

    .content h2 {
      font-size: 1.5rem;
      color: #fff;
      margin: 48px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--nf-border);
    }

    .content h3 {
      font-size: 1.2rem;
      color: var(--nf-green);
      margin: 32px 0 12px;
    }

    .content h4 {
      font-size: 1.05rem;
      color: var(--nf-text);
      margin: 24px 0 8px;
    }

    .content p {
      margin: 0 0 16px;
    }

    .content a {
      color: var(--nf-green);
      text-decoration: none;
    }

    .content a:hover {
      text-decoration: underline;
    }

    .content ul, .content ol {
      margin: 0 0 16px;
      padding-left: 24px;
    }

    .content li {
      margin-bottom: 6px;
    }

    .content blockquote {
      border-left: 4px solid var(--nf-green);
      padding: 12px 20px;
      margin: 0 0 16px;
      background: var(--nf-code-bg);
      border-radius: 0 6px 6px 0;
      color: var(--nf-text-muted);
    }

    .content blockquote p {
      margin: 0;
    }

    .content hr {
      border: none;
      border-top: 1px solid var(--nf-border);
      margin: 40px 0;
    }

    .content code {
      background: var(--nf-code-bg);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, monospace;
    }

    .content pre {
      background: var(--nf-code-bg);
      border: 1px solid var(--nf-border);
      border-radius: 8px;
      padding: 20px;
      overflow-x: auto;
      margin: 0 0 16px;
    }

    .content pre code {
      background: none;
      padding: 0;
      font-size: 0.85em;
      line-height: 1.6;
    }

    .content strong {
      color: #fff;
    }

    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 16px;
    }

    .content th, .content td {
      padding: 10px 14px;
      border: 1px solid var(--nf-border);
      text-align: left;
    }

    .content th {
      background: var(--nf-navy);
      color: #fff;
    }

    /* Mermaid diagrams */
    .mermaid {
      background: var(--nf-code-bg);
      border: 1px solid var(--nf-border);
      border-radius: 8px;
      padding: 20px;
      margin: 0 0 16px;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .menu-toggle {
        display: block;
      }

      .content {
        margin-left: 0;
        padding: 64px 24px 48px;
      }
    }
  </style>
</head>
<body>
  <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation">&#9776;</button>
  ${sidebar}
  <main class="content">
    ${htmlContent}
  </main>

  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#1e3044',
        primaryTextColor: '#e0e6ed',
        primaryBorderColor: '#2a3b4c',
        lineColor: '#00d26a',
        secondaryColor: '#162230',
        tertiaryColor: '#0f1923'
      }
    });

    // Sidebar toggle for mobile
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Active section highlighting
    const tocLinks = document.querySelectorAll('.toc a');
    const headings = [];
    tocLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) headings.push({ el, link });
    });

    function updateActive() {
      let current = headings[0];
      for (const h of headings) {
        if (h.el.getBoundingClientRect().top <= 60) current = h;
      }
      tocLinks.forEach(l => l.classList.remove('active'));
      if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    // Close sidebar on link click (mobile)
    tocLinks.forEach(link => {
      link.addEventListener('click', () => sidebar.classList.remove('open'));
    });
  </script>
</body>
</html>`;

// Write output
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), fullHTML);

// Copy static files
const STATIC_DIR = path.join(__dirname, 'static');
if (fs.existsSync(STATIC_DIR)) {
  for (const file of fs.readdirSync(STATIC_DIR)) {
    fs.copyFileSync(path.join(STATIC_DIR, file), path.join(OUT_DIR, file));
  }
}
console.log('Built _site/index.html');
