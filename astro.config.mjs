// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://notanai.github.io/SillyFrontend/', // Update to your repo's GitHub Pages URL
    base: '/SillyFrontend/', // Ensures correct asset paths for GitHub Pages subpath
    output: 'static',
    integrations: [mdx(), sitemap(), react()],
});