export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      console.log("收到来自popup的消息", message);

      sendResponse({ success: true, data: "content响应数据" });

      return true;
    });
  },
});
