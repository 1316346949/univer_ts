import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { univerPlugin } from "@univerjs/vite-plugin";
// https://vite.dev/config/

export default defineConfig({
  // 构建选项
  build: {
    lintOnSave: false, 
    // 输出目录
    outDir: "dist", // 默认为 dist

    // 资源存放目录
    assetsDir: "assets", // 默认为 assets

    // 是否启用代码压缩
    minify: true, // 使用 Terser 压缩工具

    // 是否生成 source map
    sourcemap: false, // 开启 source map，方便调试

    // 是否开启 CSS 代码拆分
    cssCodeSplit: true, // 开启 CSS 拆分

    // 构建目标，支持 ES 版本，确保浏览器兼容
    target: "es2015", // 目标浏览器版本

    // 配置 Rollup 选项
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // 将第三方库打包到 vendor.js
          }
        },
      },
    },

    // 控制文件资源大小，超过该值的文件会作为外部资源处理
    assetsInlineLimit: 4096, // 4KB 以下的文件会被内联处理

    // 是否开启构建时的文件监视
    watch: {
      chokidar: true,
    },
  },

  // 开发服务器配置
  plugins: [vue(), univerPlugin()],
  server: {
    host: "127.0.0.1",
    port: 6500,
  },
});
