# vite-nuxt-auto-sitemap
Nuxt3 automatically generates sitemap file

## Usage

Install

```bash
npm i vite-nuxt-auto-sitemap -D
```

Add it to `nuxt.config.ts`

```ts
// nuxt.config.ts
import autoSitemap from "vite-nuxt-auto-sitemap"

export default {
  vite: {
    plugins: process.env.NODE_ENV === 'production' ? [
      viteNuxtautoSitemap({
        host: 'https://xxx.com'
      }),
    ] : [],
  }
};

```

## Configuration

Current available options:

```ts
autoSitemap({
  /**
  * Required domain name
  */
  host: '' | []
  /**
  * Page directory relative to process directory
  */
  dirPath: './pages',
  /**
  * The relative to process directory path of sitemap output
  */
  sitemapOutPath: './public/sitemap.xml'
})
```
