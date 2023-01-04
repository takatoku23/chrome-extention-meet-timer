import { Timer } from "./timer";

interface request {
  message: string;
  value: number;
}

let timer: Timer;

/**
 * chrome apiからrequestを受け取る
 */
chrome.runtime.onMessage.addListener((request: request) => {
  if (request.message === "startTimer") {
    // すでにセットされているタイマーがあればクリアしてから再度インスタンス化してセットする
    if (timer) {
      timer.clearTimer();
    }
    timer = new Timer(request.value);
    timer.startTimer();
  }
  if (request.message === "clearTimer" && timer) {
      timer.clearTimer();
  }
});
