type Url = {
  url: string
}
chrome.runtime.onMessage.addListener(() => {
  
});
function notify(message: Url) {
  chrome.notifications.create({
    "type": "basic",
    "iconUrl": chrome.extension.getURL("link.png"),
    "title": "リンクをクリックしました!",
    "message": message.url
  });
}
