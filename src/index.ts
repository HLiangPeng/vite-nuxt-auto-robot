import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface paramsType {
  host: string | string[]
  dirPath?: string
  sitemapOutPath?: string
}

const getFiles = (dirPath: string) => {
  const pageFilesPath: string[] = []
  const getFile = (dirPath: string) => {
    const files: string[] = fs.readdirSync(path.join(process.cwd(), dirPath))
    files.forEach((f) => {
      const currentFileStat = fs.statSync(path.join(process.cwd(), `${dirPath}/${f}`))
      if (f.includes('.vue') && currentFileStat) {
        return pageFilesPath.push(`${dirPath}/${f.slice(0, -4)}`)
      }
      getFile(`${dirPath}/${f}`)
    })
  }
  getFile(dirPath)
  return pageFilesPath
}

const getUrlContent = (
  pageFilesPath: string[] = [],
  dirPath: string,
  host: string | string[]
) => {
  const routes = pageFilesPath.map((f) => f.slice(dirPath.length + 1))

  return routes.reduce((pre, route) => {
    let routeContent = ''
    if (typeof host === 'string') {
      routeContent = `<url>
        <loc>${host}/${route}</loc>
      </url>`
    } else if (Array.isArray(host)) {
      host.forEach((h) => {
        routeContent += `<url>
          <loc>${h}/${route}</loc>
        </url>
      `
      })
    }
    return `${pre}
    ${routeContent}`
  }, '')
}

const getSitemapContent = (urlContent: string) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlContent}
  </urlset>`
}

export default function viteNuxtAutoSitemap({
  host,
  dirPath = './pages',
  sitemapOutPath = './public/sitemap.xml',
}: paramsType) {
  return {
    name: 'vite-nuxt-auto-sitemap',
    // apply: 'build',
    buildStart() {
      const pageFilesPath = getFiles(dirPath)
      const urlContent = getUrlContent(pageFilesPath, dirPath, host)
      const sitemapContent = getSitemapContent(urlContent)
      fs.writeFileSync(path.join(process.cwd(), sitemapOutPath), sitemapContent)
    },
  }
}
