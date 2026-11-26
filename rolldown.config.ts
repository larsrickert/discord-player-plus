import { builtinModules } from "node:module";
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import packageJson from "./package.json" with { type: "json" };

const external = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];

const tsconfig = "tsconfig.app.json";

export default defineConfig({
  input: "src/index.ts",
  tsconfig,
  output: {
    cleanDir: true,
  },
  external: [
    ...external,
    ...builtinModules.map((module) => (module.startsWith(":node") ? module : `node:${module}`)),
  ],
  plugins: [dts({ tsconfig })],
});
