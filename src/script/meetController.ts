export class MeetController {

  /**
   * メッセージを送信する
   * @param postMessage 送信するメッセージ
   */
  public sendMessage(
    postMessage: string
  ) {
    const meetTextarea = document.getElementsByTagName("textarea"),
      allButtonElement = document.getElementsByTagName("button");

    for (let i = 0; i < allButtonElement.length; i++) {
      if (
        allButtonElement[i].getAttribute("aria-label") ===
        "参加者全員にメッセージを送信"
      ) {
        meetTextarea[0].value = postMessage;
        allButtonElement[i].disabled = false;
        allButtonElement[i].click();
      }
    }
  }

  /**
   * meetのコメント欄を開く
   */
  public openChat = () => {
    const googleMaterialIcon = document.getElementsByClassName(
      "google-material-icons"
    ) as HTMLCollectionOf<HTMLElement>;
    let chatIconElement: HTMLElement;
    for (let i = 0; i < googleMaterialIcon.length; i++) {
      if (googleMaterialIcon[i].textContent === "chat") {
        chatIconElement = googleMaterialIcon[i];
        chatIconElement.click();
        break;
      }
    }
  };
}
