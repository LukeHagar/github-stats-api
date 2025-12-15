import { Hono } from "hono";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIR = join(__dirname, "../ui");

let cachedHtml: string | null = null;
let cachedJs: string | null = null;
let cachedCss: string | null = null;
let cachedPreviewHtml: string | null = null;

async function getHtml(): Promise<string> {
  if (cachedHtml) return cachedHtml;
  cachedHtml = await readFile(join(UI_DIR, "index.html"), "utf-8");
  return cachedHtml;
}

async function getJs(): Promise<string> {
  if (cachedJs) return cachedJs;
  cachedJs = await readFile(join(UI_DIR, "app.js"), "utf-8");
  return cachedJs;
}

async function getCss(): Promise<string> {
  if (cachedCss) return cachedCss;
  cachedCss = await readFile(join(UI_DIR, "app.css"), "utf-8");
  return cachedCss;
}

async function getPreviewHtmlTemplate(): Promise<string> {
  if (cachedPreviewHtml) return cachedPreviewHtml;
  cachedPreviewHtml = await readFile(join(UI_DIR, "preview.html"), "utf-8");
  return cachedPreviewHtml;
}

export const uiRoutes = new Hono();

uiRoutes.get("/", async (c) => {
  const html = await getHtml();
  return c.html(html);
});

uiRoutes.get("/assets/app.js", async (c) => {
  const js = await getJs();
  return c.text(js, 200, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store",
  });
});

uiRoutes.get("/assets/app.css", async (c) => {
  const css = await getCss();
  return c.text(css, 200, {
    "Content-Type": "text/css; charset=utf-8",
    "Cache-Control": "no-store",
  });
});

uiRoutes.get("/preview/:username", async (c) => {
  const username = c.req.param("username");
  const template = await getPreviewHtmlTemplate();
  // Replace placeholder with actual username (escape for HTML)
  const escapedUsername = username
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  const htmlWithUsername = template.replace(/\{\{USERNAME\}\}/g, escapedUsername);
  return c.html(htmlWithUsername);
});


