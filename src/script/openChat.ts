/**
 * chatを開く
 */
export function openChat() {
  const googleMaterialIcon = document.getElementsByClassName("google-material-icons") as HTMLCollectionOf<HTMLElement>;
  let chatIconElement!: HTMLElement;
  for (let i = 0; i < googleMaterialIcon.length; i++) {
    if (googleMaterialIcon[i].textContent === "chat") {
      chatIconElement = googleMaterialIcon[i];
      break;
    }
  }
  if (chatIconElement !== undefined)
    chatIconElement.click();
}
