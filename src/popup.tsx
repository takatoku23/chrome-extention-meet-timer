import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./main.css";

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
    <h1 className="text-lg">時間を入力してください</h1>
      <div>
          <label htmlFor="minutes" className="block mb-2 text-xs font-medium text-gray-900">タイマーセット(分)</label>
            <input
              type="number"
              id="minutes"
              onChange={handleTotalMinutesInput} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
              placeholder=""
              required
            />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block m-1"
        onClick={() => handleStartTimer()}
      >
        start
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block m-1"
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
