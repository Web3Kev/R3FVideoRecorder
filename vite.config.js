import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: process.env.NODE_ENV === 'development' && fs.existsSync(path.resolve(__dirname, 'localhost.key')) && fs.existsSync(path.resolve(__dirname, 'localhost.crt'))
      ? {
          key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt')),
        }
      : false,
    host: 'localhost',
    port: 3000,
  },
});