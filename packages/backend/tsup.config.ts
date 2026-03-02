import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    clean: true,
    splitting: false,
    bundle: true,
    minify: false,
    sourcemap: true,
    target: "esnext",
    platform: "node",
    // Don't bundle node_modules, keep them external
    external: [/node_modules/],
});
