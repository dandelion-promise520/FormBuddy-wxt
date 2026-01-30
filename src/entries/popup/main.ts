import "element-plus/dist/index.css";
import "./style.css";

import ElementPlus from "element-plus";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);

// 防止等待动画闪烁
setTimeout(() => {
  app.mount("#app");
}, 300);
