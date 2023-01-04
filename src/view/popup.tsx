import React, { useEffect, useState } from "react";
import "./main.css";

export const Popup = () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startedTimer, setStartedTimer] = useState(false);
  const [clearTimer, setClearTimer] = useState(false);

  useEffect(() => {
    if (startedTimer) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            message: "startTimer",
            value: totalMinutes,
          });
        }
      });
    }
    setStartedTimer(false);
  }, [startedTimer]);

  useEffect(() => {
    if (clearTimer) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            message: "clearTimer",
          });
        }
      });
    }
    setClearTimer(false);
  }, [clearTimer]);

  /**
   * タイマーハンドル
   */
  const handleStartTimer = () => {
    if (!totalMinutes || totalMinutes < 0 || !Number.isInteger(totalMinutes)) {
      alert("正しい値を入力してください");
      return;
    }
    setStartedTimer(true);
  };

  const handleClearTimer = () => {
    setClearTimer(true);
  };

  const handleTotalMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalMinutes(Number(e.target.value));
  };
  return (
    <>
      <h1 className="text-lg">時間を入力してください</h1>
      <div className=" space-y-4">
        <p className=" text-xs">
          ＊入力した時間が半分、全て経過した時のみmeetのチャットを送信します。
        </p>
        <div>
          <label
            htmlFor="minutes"
            className="block mb-2 text-xs font-medium text-gray-900"
          >
            タイマーセット(分)
          </label>
          <input
            type="number"
            id="minutes"
            max={60}
            min={1}
            onChange={handleTotalMinutesInput}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
            placeholder=""
            required
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full"
            onClick={() => handleStartTimer()}
          >
            start
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full"
            onClick={() => handleClearTimer()}
          >
            clear
          </button>
        </div>
      </div>
    </>
  );
};
