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

  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  dbRef.on("value", (snapshot) => {
    const list = snapshot.val() || [];
    renderWaitingList(list);
    updateButtons(list);
  });
}

// 番号札の表示・非表示
function updateButtons(list) {
  for (let i = 1; i <= 8; i++) {
    const btn = document.querySelector(`button[data-num="${i}"]`);
    if (!btn) continue;

    btn.style.display = list.includes(i) ? "none" : "inline-block";
  }
}

// 待機リスト表示
function renderWaitingList(list) {
  const waitingList = document.getElementById("waitingList");
  waitingList.innerHTML = "";

  list.forEach((num, index) => {
    const item = document.createElement("div");
    item.className = "waiting-item";

    const text = document.createElement("span");
    text.textContent = num;

    const button = document.createElement("button");
    button.textContent = "回収";
    button.onclick = () => removeNumber(index);

    item.appendChild(text);
    item.appendChild(button);

    waitingList.appendChild(item);
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

// 回収
function removeNumber(index) {
  dbRef.once("value").then((snapshot) => {
    const list = snapshot.val() || [];

    list.splice(index, 1);

    dbRef.set(list);
  });
}
