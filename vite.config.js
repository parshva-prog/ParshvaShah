import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Three.js + its React bindings are ~700kB raw and are only needed for one
// section far below the fold. Keeping them in the entry chunk meant the browser
// downloaded and parsed the whole WebGL stack before it could paint the hero.
// They now live in their own async chunk, pulled in by React.lazy in Skills.jsx.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/ParshvaShah/',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](three|@react-three|postprocessing)/.test(id)) return 'three'
          if (/[\\/]node_modules[\\/](gsap|lenis)/.test(id)) return 'scroll'
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)/.test(id)) return 'motion'
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          return undefined
        },
      },
    },
  },
})
