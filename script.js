/************************************
 * 店番テンキー入力
 ************************************/
let storeId = "";
let gender = null;

window.pressKey = function (num) {
  if (storeId.length < 3) {
    storeId += String(num);
    updateDisplay();
  }
};

window.clearKey = function () {
  storeId = "";
  updateDisplay();
};

function updateDisplay() {
  document.getElementById("storeDisplay").textContent =
    storeId === "" ? "---" : storeId;
}

window.confirmStore = function () {
  if (storeId.length < 3) {
    alert("店番は3桁で入力してください");
    return;
  }

  document.getElementById("storeInput").style.display = "none";
  document.getElementById("genderSelect").style.display = "block";
};

/************************************
 * 性別選択
 ************************************/
window.selectGender = function (selected) {
  gender = selected;

  document.getElementById("genderSelect").style.display = "none";
  document.getElementById("main").style.display = "block";

  document.getElementById("title").textContent = `${storeId}番（${gender}）`;

  startApp();
};

/************************************
 * Firebase 接続開始
 ************************************/
function startApp() {
  const waitingRef = firebase.database().ref(`stores/${storeId}-${gender}/waiting`);

  let waiting = [];

  waitingRef.on("value", (snapshot) => {
    waiting = snapshot.val() || [];
    render();
  });

  function save() {
    waitingRef.set(waiting);
  }

  /************************************
   * UI 描画
   ************************************/
  function render() {
    const reception = document.getElementById("reception");
    const waitingList = document.getElementById("waitingList");

    reception.innerHTML = "";
    waitingList.innerHTML = "";

    document.getElementById("waitingCount").textContent = waiting.length;

    for (let i = 1; i <= 8; i++) {
      if (!waiting.includes(i)) {
        reception.innerHTML +=
          `<button class="number-button" onclick="addWaiting(${i})">${i}</button>`;
      }
    }

    if (waiting.length === 0) {
      waitingList.innerHTML = '<div class="empty">待機中のお客様はいません</div>';
    } else {
      waiting.forEach((number) => {
        waitingList.innerHTML +=
          `<div class="card">
            <div class="number">${number}番</div>
            <button class="return-button" onclick="returnNumber(${number})">番号札回収</button>
          </div>`;
      });
    }
  }

  /************************************
   * 番号追加
   ************************************/
  window.addWaiting = function (number) {
    if (confirm(`${number}番で受付しますか？`)) {
      waiting.push(number);
      save();
    }
  };

  /************************************
   * 番号削除
   ************************************/
  window.returnNumber = function (number) {
    if (confirm(`${number}番の番号札を回収しますか？`)) {
      waiting = waiting.filter((n) => n !== number);
      save();
    }
  };

  /************************************
   * 全リセット
   ************************************/
  document.getElementById("resetButton").addEventListener("click", () => {
    if (confirm("全てのデータを削除しますか？")) {
      waiting = [];
      save();
    }
  });

  render();
}
