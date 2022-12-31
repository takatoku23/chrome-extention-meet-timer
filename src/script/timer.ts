export class Timer {
  /**
   * インターバルID
   */
  intervalId: number;

  /**
   * 経過時間
   */
  elapsedSec: number;

  // /**
  //  * 入力された時間
  //  */
  // total: number;

  constructor() {
    this.intervalId = 0;
    this.elapsedSec = 0;
  }

  /**
   * タイマーを実行
   * @param totalMinutes 入力された時間（分単位）
   */
  public startInterval = (totalMinutes: number) => {
    let totalSec = totalMinutes * 60,
      delayMilSec = 1000;
    this.openChat();
    console.log(this.intervalId);

    // タイマー進行中にスタートボタンが押されたらリセットして再開する
    this.clearTimer();

    this.intervalId = window.setInterval(
      this.IntervalFunc,
      delayMilSec,
      totalSec
    );
  };

  /**
   * タイマーをクリアする
   */
  public clearTimer = () => {
    this.elapsedSec = 0;
    window.clearInterval(this.intervalId);
  };

  /**
   * 定期実行される関数
   * @param totalSec 入力された時間(秒単位)
   * @returns
   */
  private IntervalFunc = (totalSec: number) => {
    //何秒経ったかをカウントする
    this.elapsedSec += 1;
    console.log(this.intervalId);
    console.log(this.elapsedSec);
    console.log(totalSec);

    // 特定の秒数が経過していないときはreturnする
    if (!this.isPostMessage(totalSec, this.elapsedSec)) return;
    const postMessage = this.chatMessage(totalSec, this.elapsedSec);

    this.openChat();

    this.sendMessage(totalSec, postMessage);
  };

  private sendMessage(totalSec: number, postMessage: string) {
    const meetTextarea = document.getElementsByTagName("textarea"),
      allButtonElement = document.getElementsByTagName("button");
    let sendButtonElement: HTMLButtonElement,
      spanParent = meetTextarea[0].previousElementSibling,
      spanText = spanParent ? spanParent.lastElementChild : undefined;

    for (let i = 0; i < allButtonElement.length; i++) {
      if (
        allButtonElement[i].getAttribute("aria-label") ===
        "参加者全員にメッセージを送信"
      ) {
        meetTextarea[0].value = postMessage;
        allButtonElement[i].disabled = false;
        allButtonElement[i].click();
        if (totalSec === this.elapsedSec) {
          this.clearTimer()
        }
      }
    }
  }

  /**
   * 送信するメッセージを返す
   * @param totalSec 入力された時間(秒単位)
   * @param elapsedSec 経過時間(秒単位)
   * @return string
   */
  private chatMessage = (totalSec: number, elapsedSec: number) => {
    let halfTimeSec = Math.ceil(totalSec / 2),
      oneMinuteAgo = totalSec - 60;

    if (elapsedSec === halfTimeSec) {
      let halfTimeMinutes = halfTimeSec / 60,
        halfTimeMinutesInt = Math.floor(halfTimeMinutes),
        halfTimeSecRemaining = halfTimeSec - halfTimeMinutesInt * 60;

      if (halfTimeMinutesInt && halfTimeSecRemaining) {
        return `残り${String(halfTimeMinutesInt)}分${String(
          halfTimeSecRemaining
        )}秒`;
      }
      if (!halfTimeMinutesInt) {
        return `残り${String(halfTimeSecRemaining)}秒`;
      }

      return `残り${String(halfTimeMinutesInt)}分`;
    }

    if (elapsedSec === oneMinuteAgo) {
      return "残り１分";
    }

    return "終了";
  };

  /**
   * メッセージを送信するか判定
   * @param totalSec
   * @param elapsedSec
   * @returns boolean
   */
  private isPostMessage = (totalSec: number, elapsedSec: number) => {
    const halfTimeSec = Math.ceil(totalSec / 2),
      oneMinuteAgo = totalSec - 60;

    if (
      elapsedSec === halfTimeSec ||
      elapsedSec === oneMinuteAgo ||
      elapsedSec === totalSec
    ) {
      return true;
    }

    return false;
  };

  /**
   * meetのコメント欄を開く
   */
  private openChat = () => {
    const googleMaterialIcon = document.getElementsByClassName(
      "google-material-icons"
    ) as HTMLCollectionOf<HTMLElement>;
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
  };
}
