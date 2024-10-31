<h1>R3F Canvas VIDEO RECORDING</h1>

The file useVideRecorder.jsx is a hook that enables recording of the canvas in R3F.

It will download in webm on chrome, and mp4 in safari / iOS.

To enable the native "share pop up" on iOS devices, make sure to have https enabled when serving locally.

You can generate a self-signed certificate using OpenSSL, running these commands to create a .key and .crt file:

```openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt -days 365```

if using Vite,
make sure to update the vite.config.js to include the HTTPS server configuration : 

```
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
```

The code above will ignore localhost.key and .crt when uploading to an online server with https enabled.

when starting the dev server with 
```npm run dev```

Your Vite project will now be accessible via https://localhost:3000.
