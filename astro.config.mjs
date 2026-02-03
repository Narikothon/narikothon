// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://narikothon.zubairiz.com',
  integrations: [
    mdx(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Narikothon',
        short_name: 'Narikothon',
        description: 'Narikothon',
        theme_color: '#008E48',
        background_color: '#ffffff',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});