import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Preload the display font: finds the hashed woff2 in the bundle and adds a <link rel="preload">. */
function preloadDisplayFont(): Plugin {
  return {
    name: 'preload-display-font',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find(f =>
          /bricolage-grotesque-latin-standard-normal.*\.woff2$/.test(f),
        );
        if (!file) return [];
        return [
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadDisplayFont()],
});
