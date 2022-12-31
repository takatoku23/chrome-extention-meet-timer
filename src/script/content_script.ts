import { Timer } from "./timer";

interface request {
  message: string;
  value: number;
}

const timer = new Timer();
// 途中でstartしたらバグるのでその対応をする
/**
 * chrome apiからrequestを受け取る
*/
chrome.runtime.onMessage.addListener((request: request) => {
  if (request.message === "startTimer") {
    timer.startInterval(request.value);
  }
  if (request.message === "clearTimer") {
    timer.clearTimer();
  }
})
