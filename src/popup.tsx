import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startedTimer, setStartedTimer] = useState(false);
  const [clearTimer, setClearTimer] = useState(false);

  useEffect(() => {
    if(startedTimer) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              message: "startTimer",
              value: totalMinutes
            }
          );
        }
      });
    }
    setStartedTimer(false);
  }, [startedTimer]);

  useEffect(() => {
    if(clearTimer) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              message: "clearTimer"
            }
          );
        }
      });
    }
    setClearTimer(false);
  }, [clearTimer]);

  /**
   * タイマーハンドル
   */
  const handleStartTimer = () => {
    if(!totalMinutes || totalMinutes < 0) {
      alert("please set the correct value");
      return;
    }
    setStartedTimer(true);
  }

  const handleClearTimer = () => {
    setClearTimer(true);
  }

  const handleTotalMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalMinutes(Number(e.target.value));
  }
  return (
    <>
    <h1>google meet用タイマー設定</h1>
      <div>
        <label>set Minutes:
          <input type="number" onChange={handleTotalMinutesInput} />
        </label>
      </div>
      <button
        onClick={() => handleStartTimer()}
      >
        start
      </button>
      <button
        onClick={() => handleClearTimer()}
      >
        clear
      </button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
