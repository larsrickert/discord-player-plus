import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
  },
  env: {
    builtin: true,
    node: true,
  },
});
