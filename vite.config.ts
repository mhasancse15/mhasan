import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' uses relative asset paths, so the build works on both
// user sites (<user>.github.io) and project sites (<user>.github.io/<repo>/).
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
