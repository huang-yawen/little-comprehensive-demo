import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  await server.ssrLoadModule("/ssr-entry.jsx");
} catch (e) {
  console.error("[LOAD FAILED]", e);
} finally {
  await server.close();
}

process.exit(0);
