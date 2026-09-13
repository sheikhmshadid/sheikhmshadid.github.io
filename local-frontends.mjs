import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

for (const [name, source, port, apiPort] of [
  ['cieve', '../cieve', 5173, 3001],
  ['studio', '../ninetyfourohfive/frontend', 3000, 8000],
]) {
  const root = path.resolve(source);
  const { createServer } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')));
  const { default: react } = await import(pathToFileURL(path.join(root, 'node_modules/@vitejs/plugin-react/dist/index.js')));
  let css;
  if (name === 'studio') {
    const require = createRequire(path.join(root, 'package.json'));
    const { default: config } = await import(pathToFileURL(path.join(root, 'tailwind.config.js')));
    css = { postcss: { plugins: [require('tailwindcss')({ ...config, content: [path.join(root, 'index.html'), path.join(root, 'src/**/*.{js,ts,jsx,tsx}')] }), require('autoprefixer')()] } };
  }
  const server = await createServer({
    root,
    configFile: false,
    cacheDir: path.resolve('.runtime', 'frontend-cache', 'node_modules', `.vite-${name}`),
    plugins: [react()],
    css,
    server: { host: '127.0.0.1', port, strictPort: true, proxy: { '/api': `http://127.0.0.1:${apiPort}` } },
  });
  await server.listen();
  console.log(`${name}: http://localhost:${port}`);
}
