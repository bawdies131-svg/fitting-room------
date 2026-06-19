let storeNumber = "";
let gender = "";

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
}
