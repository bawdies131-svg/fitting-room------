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

  // ★★★ Firebase の正しいパスに修正 ★★★
  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  // リアルタイム反映
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val() || [];
    renderWaitingList(data);
  });
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

// 番号追加（1〜8）
function addNumber(num) {
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];
    list.push(num);
