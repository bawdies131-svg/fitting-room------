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

  // Firebase の正しいパス
  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  // リアルタイム反映
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val() || [];
    renderWaitingList(data);
    updateButtons(data); // ← 追加：番号札の表示/非表示を同期
  });
}

// 番号札の表示/非表示を Firebase と同期
function updateButtons(list) {
  // 1〜8 のボタンをチェック
  for (let i = 1; i <= 8; i++) {
    const btn = document.querySelector(`button[data-num="${i}"]`);
    if (!btn) continue;

    if (list.includes(i)) {
      btn.style.display = "none"; // 使用中 → 非表示
    } else {
      btn.style.display = "inline-block"; // 空き → 表示
    }
  }
}

// 待機リスト描画
function renderWaitingList(list) {
  const waitingList = document.getElementById("waitingList");
  waitingList.innerHTML = "";

  list.forEach((num, index) => {
    const div = document.createElement("div");
    div.textContent = num;
    div.className = "waiting-item";

    const btn = document.createElement("button");
    btn.textContent = "回収";
    btn.onclick = () => removeNumber(index);

    div.appendChild(btn);
    waitingList.appendChild(div);
  });

  document.getElementById("waitingCount").textContent = list.length;
}

// 番号追加（押したら消える）
function addNumber(num) {
  // ボタンを非表示にする
  const btn = document.querySelector(`button[data-num="${num}"]`);
  if (btn) btn.style.display = "none";

  // Firebase に追加
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];
    list.push(num);
    dbRef.set(list);
  });
}

// 番号削除（回収したら復活）
function removeNumber(index) {
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];
    const removed = list[index]; // 回収した番号

    list.splice(index, 1);
    dbRef.set(list);

    // ボタンを復活
    const btn = document.querySelector(`button[data-num="${removed}"]`);
    if (btn) btn.style.display = "inline-block";
  });
}

// 全リセット
document.getElementById("resetButton").onclick = () => {
  if (confirm("本当にリセットしますか？")) {
    dbRef.set([]);
  }
};
