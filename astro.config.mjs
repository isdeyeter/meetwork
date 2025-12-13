import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://meetwork.com.tr',
  base: '/',
  output: 'static',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: [
            'import',
            'global-builtin',
            'color-functions'
          ]
        }
      }
    },
    // `build.minify` kısmını kaldırıyoruz
    // esbuild ile minification yeterlidir
    esbuild: {
      legalComments: 'none',
      minifySyntax: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      charset: 'utf8',
      keepNames: true
    }
  },

  integrations: [
    mdx(),
    sitemap()
  ]
});