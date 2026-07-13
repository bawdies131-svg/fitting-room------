let storeNumber = "";
let gender = "";
let dbRef = null;

// 店番入力
function pressKey(num) {
  if (storeNumber.length < 3) {
    storeNumber += num;
    document.getElementById("storeDisplay").textContent = storeNumber;
  }
}

function clearKey() {
  storeNumber = "";
  document.getElementById("storeDisplay").textContent = "---";
}

function confirmStore() {
  if (storeNumber === "") {
    alert("店番を入力してください");
    return;
  }

  document.getElementById("storeInput").style.display = "none";
  document.getElementById("genderSelect").style.display = "block";
}

// 性別選択
function selectGender(g) {
  gender = g;

  document.getElementById("genderSelect").style.display = "none";
  document.getElementById("main").style.display = "block";

  document.getElementById("title").textContent =
    (gender === "men" ? "メンズ" : "レディース") +
    " / 店番 " + storeNumber;

  // Firebase のパス
  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  // リアルタイム同期
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val() || [];
    renderWaitingList(data);
    updateButtons(data);
  });
}

// 番号札の表示・非表示
function updateButtons(list) {
  for (let i = 1; i <= 8; i++) {
    const btn = document.querySelector(`button[data-num="${i}"]`);
    if (!btn) continue;

    if (list.includes(i)) {
      btn.style.display = "none";
    } else {
      btn.style.display = "inline-block";
    }
  }
}

// 待機リスト描画
function renderWaitingList(list) {
  const waitingList = document.getElementById("waitingList");
  waitingList.innerHTML = "";

  list.forEach((num, index) => {
    const div = document.createElement("div");
    div.className = "waiting-item";
    div.textContent = num;

    const btn = document.createElement("button");
    btn.textContent = "回収";
    btn.onclick = () => removeNumber(index);

    div.appendChild(btn);
    waitingList.appendChild(div);
  });

  document.getElementById("waitingCount").textContent = list.length;
}

// 番号追加
function addNumber(num) {
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];

    if (!list.includes(num)) {
      list.push(num);
      dbRef.set(list);
    }
  });
}

// 番号削除
function removeNumber(index) {
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];
    list.splice(index, 1);
    dbRef.set(list);
  });
}

// 全リセット
document.getElementById("resetButton").onclick = () => {
  if (confirm("本当にリセットしますか？")) {
    dbRef.set([]);
  }
};

// =========================
// 戻るボタン
// =========================
function goBack() {
  // =========================
// 店番選択へ戻る
// =========================
function backToStore() {

  if (dbRef) {
    dbRef.off();
  }

  storeNumber = "";
  gender = "";
  dbRef = null;

  document.getElementById("storeDisplay").textContent = "---";
  document.getElementById("waitingList").innerHTML = "";
  document.getElementById("waitingCount").textContent = "0";

  document.querySelectorAll(".number-buttons button").forEach(btn => {
    btn.style.display = "inline-block";
  });

  document.getElementById("main").style.display = "none";
  document.getElementById("genderSelect").style.display = "none";
  document.getElementById("storeInput").style.display = "block";
}

// =========================
// 性別選択へ戻る
// =========================
function backToGender() {

  if (dbRef) {
    dbRef.off();
  }

  gender = "";
  dbRef = null;

  document.getElementById("waitingList").innerHTML = "";
  document.getElementById("waitingCount").textContent = "0";

  document.querySelectorAll(".number-buttons button").forEach(btn => {
    btn.style.display = "inline-block";
  });

  document.getElementById("main").style.display = "none";
  document.getElementById("genderSelect").style.display = "block";
}

  // Firebase監視解除
  if (dbRef) {
    dbRef.off();
  }

  // 初期化
  storeNumber = "";
  gender = "";
  dbRef = null;

  document.getElementById("storeDisplay").textContent = "---";
  document.getElementById("waitingList").innerHTML = "";
  document.getElementById("waitingCount").textContent = "0";

  // 番号札を全部表示
  document.querySelectorAll(".number-buttons button").forEach(btn => {
    btn.style.display = "inline-block";
  });

  // 画面切替
  document.getElementById("main").style.display = "none";
  document.getElementById("genderSelect").style.display = "none";
  document.getElementById("storeInput").style.display = "block";
}
