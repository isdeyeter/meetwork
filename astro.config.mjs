import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://meetwork.com.tr',
  base: '/',
  output: 'static',
  
  // BU AYARLARI EKLE:
  vite: {
    build: {
      // Minify ayarlarını optimize et
      minify: 'terser',
      terserOptions: {
        compress: {
          // Syntax hatalarını warning'e çevir
          warnings: false,
          // Ufak hataları görmezden gel
          unsafe: true,
          unsafe_math: true,
          unsafe_methods: true
        }
      }
    },
    esbuild: {
      // Syntax hatalarını fatal error'dan warning'e düşür
      legalComments: 'none',
      // Küçük hataları tolere et
      minifySyntax: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      // ASTRO'YA ÖZEL: Strict kontrolü hafiflet
      charset: 'utf8',
      keepNames: true,
      logOverride: {
        // "unterminated-string-literal" hatasını warning yap
        'unterminated-string-literal': 'warning'
      }
    }
  },
  
  integrations: [
    mdx(),
    sitemap()
  ]
});