import { UserInfo } from "@/types";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // 填充逻辑
    const fillData = (data: string): void => {
      const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement))
        throw new Error("当前页面没有您选中的元素");

      el.value = data;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };

    // 点击按钮发送消息事件
    browser.runtime.onMessage.addListener((message: string, _sender, sendResponse) => {
      console.log("收到来自popup的消息", message);
      fillData(message);

      sendResponse({ success: true, data: "content响应数据" });

      return true;
    });

    const userInfoStorage = storage.defineItem<UserInfo[]>("local:userInfos");

    // 快捷键填充事件
    window.addEventListener("keydown", async (e) => {
      if (e.altKey && e.key !== "Alt") {
        const userInfo = await userInfoStorage.getValue();

        if (!userInfo) throw new Error("用户数据不存在");
        if (+e.key > userInfo.length) throw new Error("您按下的键值没有找到对应您设置的信息");

        fillData(userInfo[+e.key - 1].value);
      }
    });
  },
});
