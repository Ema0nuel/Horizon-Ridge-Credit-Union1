// /* eslint-disable no-unused-vars */
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import compression from 'vite-plugin-compression'

// export default defineConfig(({ command, mode }) => {
//   const isProduction = mode === 'production'

//   return {
//     plugins: [
//       react(),
//       compression({
//         verbose: true,
//         disable: false,
//         threshold: 1024,
//         algorithm: 'brotli',
//         ext: '.br',
//       }),
//       compression({
//         verbose: true,
//         disable: false,
//         threshold: 1024,
//         algorithm: 'gzip',
//         ext: '.gz',
//       }),
//     ],
//     build: {
//       mode: 'production',
//       target: 'esnext',
//       minify: 'terser',
//       terserOptions: {
//         compress: {
//           drop_console: true,
//           drop_debugger: true,
//         },
//         format: {
//           comments: false,
//         },
//       },
//       rollupOptions: {
//         output: {
//           manualChunks: (id) => {
//             if (id.includes('node_modules/react-dom')) return 'vendor-react'
//             if (id.includes('node_modules/react')) return 'vendor-react'
//             if (id.includes('node_modules/react-router')) return 'vendor-router'
//             if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
//             if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) {
//               return 'vendor-icons'
//             }
//             if (id.includes('node_modules/axios') || id.includes('node_modules/@supabase')) {
//               return 'vendor-api'
//             }
//             if (id.includes('src/pages/main/auth/')) return 'auth-pages'
//             if (id.includes('src/pages/main/user/')) return 'user-pages'
//             if (id.includes('src/pages/admin/')) return 'admin-pages'
//             if (id.includes('src/pages/main/portal/')) return 'portal-pages'
//             if (id.includes('src/Services/') || id.includes('src/services/')) return 'services'
//             if (id.includes('src/hooks/')) return 'hooks'
//           },
//         },
//       },
//       chunkSizeWarningLimit: 1000,
//       reportCompressedSize: true,
//       sourcemap: false,
//       cssCodeSplit: true,
//     },
//     optimizeDeps: {
//       include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
//     },
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
