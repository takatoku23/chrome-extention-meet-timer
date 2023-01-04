import { MeetController } from "./meetController";

// meetのdom操作する系class→timerのような依存関係にしたい
export class Timer {
  /**
   * インターバルID
   */
  private intervalId: number;

  /**
   * 経過時間
   */
  private elapsedSec: number;

  /**
   * 経過時間
   */
  private totalSec: number;

  /**
   * meet画面の操作をするためのクラス
   */
  private readonly meetController: MeetController;

  /**
   * 遅延時間(1秒)
   */
  static readonly DELAY_MILSEC = 1000;

  constructor(public totalMinutes: number) {
    this.intervalId = 0;
    this.elapsedSec = 0;
    this.totalSec = this.totalMinutes * 60;
    this.meetController = new MeetController();
  }

  /**
   * タイマーを実行
   * @param totalMinutes 入力された時間（分単位）
   */
  public startTimer = () => {
    // 先にチャット欄を開いていないとメッセージをtextareにセットできないためタイマーセット時にチャット欄をopenしておく
    this.meetController.openChat()

    // タイマー進行中にスタートボタンが押されたらリセットして再開する
    this.clearTimer();

    this.intervalId = window.setInterval(
      this.IntervalFunc,
      Timer.DELAY_MILSEC,
      this.totalSec
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

    this.meetController.openChat();

    this.meetController.sendMessage(postMessage);

    if (totalSec === this.elapsedSec) {
      this.clearTimer();
    }
  };

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
}
