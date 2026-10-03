#!/usr/bin/env node
// tools/build-site.mjs
//
// Generate the hub's self-contained `index.html` for this satellite from
// README.md. No network and no dependencies: the README is a short heading and
// a paragraph, so a tiny block parser is enough, and the stylesheet is inline.
// The page links to the committed `main.pdf` by a relative path, so the two
// files work from whatever prefix the hub serves the dist under.
//
// Usage: node tools/build-site.mjs [distDir]   (default: dist)

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const distDir = process.argv[2] ?? 'dist';
const readme = readFileSync('README.md', 'utf8');

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Minimal block parser: ATX headings (# .. ######) and blank-line-separated
// paragraphs. Everything is HTML-escaped, so README content cannot inject
// markup into the page.
const blocks = [];
let paragraph = [];
let firstHeading = '';

const flushParagraph = () => {
  if (paragraph.length === 0) return;
  blocks.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
  paragraph = [];
};

for (const line of readme.replace(/\r\n?/g, '\n').split('\n')) {
  const heading = /^(#{1,6})\s+(.*?)\s*$/.exec(line);
  if (heading) {
    flushParagraph();
    const level = heading[1].length;
    const text = heading[2].replace(/\s+#+\s*$/, '');
    if (level === 1 && firstHeading === '') firstHeading = text;
    blocks.push(`<h${level}>${escapeHtml(text)}</h${level}>`);
  } else if (line.trim() === '') {
    flushParagraph();
  } else {
    paragraph.push(line.trim());
  }
}
flushParagraph();

const title = firstHeading === '' ? 'Construction.AI Proposal' : firstHeading;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0 auto;
      max-width: 44rem;
      padding: 2.5rem 1.25rem 4rem;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.65;
      color: #1c1c1c;
      background: #ffffff;
    }
    h1 { font-size: 1.9rem; line-height: 1.25; margin: 0 0 1rem; }
    h2 { font-size: 1.3rem; margin: 2rem 0 0.75rem; }
    p { margin: 0 0 1rem; }
    .download {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.65rem 1.1rem;
      border: 1px solid #861f41;
      border-radius: 0.5rem;
      color: #861f41;
      font-weight: 600;
      text-decoration: none;
    }
    .download:hover, .download:focus { background: #861f41; color: #ffffff; }
    @media (prefers-color-scheme: dark) {
      body { color: #e8e8e8; background: #16181d; }
      .download { border-color: #e5751f; color: #e5751f; }
      .download:hover, .download:focus { background: #e5751f; color: #16181d; }
    }
  </style>
</head>
<body>
      ${blocks.join('\n      ')}
      <p><a class="download" href="main.pdf">Download the proposal (PDF)</a></p>
</body>
</html>
`;

mkdirSync(distDir, { recursive: true });
writeFileSync(path.join(distDir, 'index.html'), html);
