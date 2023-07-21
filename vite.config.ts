import { resolve } from "node:path";
import { readFile } from "fs/promises";
import { defineConfig } from "vite";
import copy from "rollup-plugin-copy";

export default defineConfig({
  build: {
    outDir: resolve("dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 5 * 1024 * 1024,
    rollupOptions: {
      input: ["src/scripts/content.ts", "src/popup/index.tsx"],
      output: {
        entryFileNames: ({ name }) => {
          if (name === "content") {
            return `scripts/${name}.js`;
          } else {
            return `popup/${name}.js`;
          }
        },
      },
    },
  },
  plugins: [
    {
      name: "hackly resolve modules for disabling code-splitting",
      enforce: "pre",
      resolveId(source, importer) {
        if (
          source.endsWith("presetColors") &&
          importer?.endsWith("content.ts")
        ) {
          return {
            id: resolve("src/share/presetColors.ts?is_copied"),
          };
        }
      },
      load(id) {
        if (id.endsWith("src/share/presetColors.ts?is_copied")) {
          return readFile("src/share/presetColors.ts", "utf-8");
        }
      },
    },
    copy({
      targets: [
        {
          src: "src/popup/index.html",
          dest: "dist/popup/",
        },
        {
          src: "manifest.json",
          dest: "dist/",
        },
        {
          src: "images/icons/",
          dest: "dist/",
        },
      ],
      hook: "writeBundle",
    }),
  ],
});
