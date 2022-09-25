/**
 * chrome apiからrequestを受け取る
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "startTimer") {
    startInterval(request.value);
  }
  if (request.message === "clearTimer") {
    clearTimer();
  }
})
// 整数のみを送信できるようにするべき
let intervalId: number,
    elapsedSec = 0;

/**
 * タイマーを実行
 * @param totalMinutes 入力された時間（分単位）
 */
const startInterval = (totalMinutes: number) => {
    let totalSec = totalMinutes * 60,
        delayMilSec = 1000;
    openChat();
    intervalId = window.setInterval(IntervalFunc, delayMilSec, totalSec);
}

/**
 * 定期実行される関数
 * @param totalSec 入力された時間(秒単位)
 * @returns 
 */
const IntervalFunc = (totalSec: number) => {
    //startしてから何秒経ったかをカウントする
    elapsedSec+=1;
    let postMessage = chatMessage(totalSec, elapsedSec);
    console.log(elapsedSec);
    console.log(totalSec);

    // 特定の秒数が経過していないときはreturnする
    if (!postMessage) return;
    
    openChat();
    const meetTextarea = document.getElementsByTagName("textarea"),
          allButtonElement = document.getElementsByTagName("button");
    let sendButtonElement: HTMLButtonElement,
        spanParent = meetTextarea[0].previousElementSibling;
    if (!spanParent) {
      return;
    }
    let spanText = spanParent.lastElementChild;
    if (!spanText) {
      return;
    }

    for (let i = 0; i < allButtonElement.length; i++) {
      if (allButtonElement[i].getAttribute("aria-label") === '参加者全員にメッセージを送信') {
        sendButtonElement = allButtonElement[i];

        if (postMessage) {
          meetTextarea[0].value = postMessage;
          sendButtonElement.disabled = false;
          sendButtonElement.click();
          if (totalSec === elapsedSec) {
            window.clearInterval(intervalId);
            elapsedSec = 0;
          }
        }
      }
    }
}

/**
 * 送信するメッセージを返す(メッセージを送信するかどうかも判定しているため責務を分離した方がよいかも)
 * @param totalSec 入力された時間(秒単位)
 * @param elapsedSec 経過時間(秒単位)
 * @returns 
 */
const chatMessage = (totalSec: number, elapsedSec: number):string | null=> {
  let halfTimeSec = Math.ceil(totalSec / 2),
      oneMinuteAgo = totalSec - 60;
  if (elapsedSec === halfTimeSec) {
    let halfTimeMinutes = halfTimeSec / 60,
        halfTimeMinutesInt = Math.floor(halfTimeMinutes),
        halfTimeSecRemaining = halfTimeSec - (halfTimeMinutesInt * 60);

    if (halfTimeMinutesInt && halfTimeSecRemaining) {
      return `残り${String(halfTimeMinutesInt)}分${String(halfTimeSecRemaining)}秒`
    }
    if (!halfTimeMinutesInt) {
      return `残り${String(halfTimeSecRemaining)}秒`
    }
    if (!halfTimeSecRemaining) {
      return `残り${String(halfTimeMinutesInt)}分`
    }
  }
  if (elapsedSec === oneMinuteAgo) {
    return "残り１分"
  }
  if (totalSec === elapsedSec) {
    return "終了"
  }

  return null
}

/**
 * タイマーをクリアする
 */
 const clearTimer = () => {
  elapsedSec = 0;
  window.clearInterval(intervalId);
}

/**
 * meetのコメント欄を開く
 */
 const openChat = () => {
  const googleMaterialIcon = document.getElementsByClassName("google-material-icons") as HTMLCollectionOf<HTMLElement>;
  let chatIconElement!: HTMLElement;
  for (let i = 0; i < googleMaterialIcon.length; i++) {
    if (googleMaterialIcon[i].textContent === "chat") {
      chatIconElement = googleMaterialIcon[i];
      break;
    }
  }
  if (chatIconElement !== undefined) {
    chatIconElement.click();
  }
}
