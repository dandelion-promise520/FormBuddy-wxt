import "element-plus/dist/index.css";
import "./style.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import VueDndKitPlugin, { IPluginOptions } from "@vue-dnd-kit/core";
import ElementPlus from "element-plus";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(VueDndKitPlugin, {
  defaultOverlay: {
    styles: {
      // Optional custom styles for drag overlay
      opacity: 0.8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "none",
    },
  },
} as IPluginOptions);
// 防止等待动画闪烁
setTimeout(() => {
  app.mount("#app");
}, 300);
