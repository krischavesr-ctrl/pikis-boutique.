import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
plugins: [react()],
build: {
rollupOptions: {
input: {
main: fileURLToPath(new URL('./index.html', import.meta.url)),
admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
},
},
},
})
