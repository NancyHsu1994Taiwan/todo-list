// 按鈕
const signUpBtn = document.querySelector(".signUp");
// 輸入欄位
const email = document.querySelector(".email");
const nickname = document.querySelector(".nickname");
const password = document.querySelector(".password");
const passwordAgain = document.querySelector(".passwordAgain");
// 警示
const warningEmail = document.querySelector(".warningEmail");
const warningNickname = document.querySelector(".warningNickname");
const warningPassword = document.querySelector(".warningPassword");
const warningAgain = document.querySelector(".warningAgain");
// API
const baseUrl = "https://todoo.5xcamp.us";
let token = "";
// 事件監聽
signUpBtn.addEventListener("click", logIncheck);
signUpBtn.addEventListener("click", signUp);

// 檢查欄位
function logIncheck() {
  //   alert("AA");
  if (email.value == "") {
    warningEmail.innerHTML = `<p class="warning1 warning">此欄位不可為空</p>`;
  }
  if (nickname.value == "") {
    warningNickname.innerHTML = `<p class="warning2 warning">此欄位不可為空</p>`;
  }
  if (password.value == "") {
    warningPassword.innerHTML = `<p class="warning1 warning">此欄位不可為空</p>`;
  }
  if (passwordAgain.value == "") {
    warningAgain.innerHTML = `<p class="warning1 warning">此欄位不可為空</p>`;
  }
}

// 註冊功能

function signUp() {
  let obj = {
    user: {
      email: email.value,
      nickname: nickname.value,
      password: password.value,
    },
  };
  axios
    .post(`${baseUrl}/users`, obj)
    .then((res) => {
      console.log(res);
      token = res.headers.authorization;
      console.log(token);
      if (res.data.message == "註冊成功") {
        alert("恭喜帳號註冊成功");
        location.href = "./index.html";
      } else {
        alert("帳號註冊失敗");
      }
      email.value = ""; //將已經輸入的資料清空
      nickname.value = "";
      password.value = "";
      passwordAgain.value = "./inex";
    })
    .catch((err) => {
      console.log(err);
    });
}
