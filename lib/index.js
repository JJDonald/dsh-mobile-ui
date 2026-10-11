/**
 * dsh-mobile-ui host half.
 *
 * Contributes three things to every served index.html, so the phone layout is
 * in place at first paint instead of after the client bundle materializes:
 *   1. a viewport meta with viewport-fit=cover (safe areas) and
 *      interactive-widget=resizes-content (Android shrinks the layout viewport
 *      for the soft keyboard), plus home-screen web-app metas;
 *   2. a tiny head script that mirrors `(max-width: 760px)` onto
 *      `html[data-mui="mobile"]` — the single switch every rule keys on;
 *   3. the mobile stylesheet (lib/mobile.css), all rules scoped under that
 *      attribute, so wider windows are untouched.
 * Behaviors (drawer, app bar, keyboard) live in the browser half, lib/client.js.
 */
import { readFileSync } from 'node:fs'

export const name = 'dsh-mobile-ui'
export const inject = ['webServer']

/** Single breakpoint shared with lib/client.js. */
export const BREAKPOINT = 760

const VIEWPORT = 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content'
const APP_METAS = [
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
  '<meta name="apple-mobile-web-app-title" content="DSH">',
].join('')

const MODE_SCRIPT = `(function(){var r=document.documentElement,m=matchMedia('(max-width: ${BREAKPOINT}px)');` +
  `function s(){if(m.matches)r.setAttribute('data-mui','mobile');else r.removeAttribute('data-mui')}` +
  `s();m.addEventListener('change',s)})()`

/**
 * @param {string} html - index.html after DSH's own rows.
 * @returns {string} html with the mobile viewport and app metas.
 */
export function rewriteIndex(html) {
  const meta = `<meta name="viewport" content="${VIEWPORT}">`
  const replaced = html.replace(/<meta\s+name=["']viewport["'][^>]*>/i, meta)
  const withViewport = replaced === html ? html.replace(/<head[^>]*>/i, m => m + meta) : replaced
  return withViewport.replace(/<\/head>/i, APP_METAS + '</head>')
}

export function apply(ctx) {
  // Read per index render: a page reload picks up stylesheet edits without a
  // host restart, and the file is a few KB.
  const cssUrl = new URL('./mobile.css', import.meta.url)
  ctx.effect(() => ctx.webServer.tapIndex(rewriteIndex), 'dsh-mobile-ui: index metas')
  ctx.on('webserver/index-inject', table => {
    table.push({ kind: 'script', placement: 'head', text: MODE_SCRIPT })
    table.push({ kind: 'style', text: readFileSync(cssUrl, 'utf8') })
  })
}
