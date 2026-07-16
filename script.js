let storeNumber = "";
let gender = "";
let dbRef = null;

const savedStore = localStorage.getItem("storeNumber");
const savedGender = localStorage.getItem("gender");

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
  localStorage.setItem("storeNumber", storeNumber);
localStorage.setItem("gender", gender);

  document.getElementById("genderSelect").style.display = "none";
  document.getElementById("main").style.display = "block";

  document.getElementById("title").textContent =
    (gender === "men" ? "メンズ" : "レディース") +
    " ／ 店番 " + storeNumber;

  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  dbRef.on("value", snapshot => {

    const list = snapshot.val() || [];

    renderWaitingList(list);
    updateButtons(list);

  });

}

// 番号札表示
function updateButtons(list) {

  for (let i = 1; i <= 8; i++) {

    const btn = document.querySelector(`button[data-num="${i}"]`);

    if (!btn) continue;

    btn.style.display = list.includes(i)
      ? "none"
      : "inline-block";

  }

}

// 待機リスト
function renderWaitingList(list) {

  const waitingList = document.getElementById("waitingList");
  waitingList.innerHTML = "";

  const order = ["①","②","③","④","⑤","⑥","⑦","⑧"];

  list.forEach((num,index)=>{

    const item = document.createElement("div");
    item.className = "waiting-item";

    const text = document.createElement("span");
    text.textContent = `${order[index]}　番号札${num}`;

    const button = document.createElement("button");
    btn.classList.add("pressed");

setTimeout(() => {
  btn.classList.remove("pressed");
}, 100);
    button.textContent = "回収";

    button.onclick = ()=>removeNumber(index);

    item.appendChild(text);
    item.appendChild(button);

    waitingList.appendChild(item);

  });

  document.getElementById("waitingCount").textContent = list.length;

}
// 番号札追加
function addNumber(num){

  // スマホなら振動
  if(navigator.vibrate){
    navigator.vibrate(40);
  }

  const btn = document.querySelector(`button[data-num="${num}"]`);

  btn.disabled = true;
  btn.style.background = "#9e9e9e";

  setTimeout(()=>{
    btn.disabled = false;
    btn.style.background = "#1976d2";
  },300);

  dbRef.once("value").then(snapshot=>{

    const list = snapshot.val() || [];

    if(list.includes(num)) return;

    list.push(num);

    dbRef.set(list);

  });

}

// 回収
function removeNumber(index){

  dbRef.once("value").then(snapshot=>{

    const list = snapshot.val() || [];

    const num = list[index];

    list.splice(index,1);

    dbRef.set(list);
  });
}
function startSavedSetting(){

  storeNumber = savedStore;
  gender = savedGender;

  document.getElementById("savedSetting").style.display = "none";
  document.getElementById("main").style.display = "block";

  document.getElementById("title").textContent =
    (gender === "men" ? "メンズ" : "レディース") +
    " ／ 店番 " + storeNumber;

  dbRef = firebase.database().ref(`stores/${storeNumber}/${gender}/waiting`);

  dbRef.on("value", snapshot => {

    const list = snapshot.val() || [];

    renderWaitingList(list);
    updateButtons(list);

  });

}

// 店番・性別変更
function changeSetting(){

  localStorage.removeItem("storeNumber");
  localStorage.removeItem("gender");

  location.reload();

}
// 起動時
window.onload = function () {

  if(savedStore && savedGender){

    document.getElementById("savedStore").textContent = savedStore;
    document.getElementById("savedGender").textContent =
      savedGender === "men" ? "メンズ" : "レディース";

    document.getElementById("savedSetting").style.display = "block";
    document.getElementById("storeInput").style.display = "none";

  }

};
