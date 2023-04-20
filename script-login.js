// 按鈕
const logInBtn = document.querySelector(".logIn");
// 輸入欄位
const email = document.querySelector(".email");
const password = document.querySelector(".password");
// 警示
const warning1 = document.querySelector(".warning1");
const warning2 = document.querySelector(".warning2");
// API
const baseUrl = "https://todoo.5xcamp.us";
let token = "";

// 事件監聽
logInBtn.addEventListener("click", logIncheck);
logInBtn.addEventListener("click", logIn);
// signUpBtn.addEventListener("click", signUpcheck);

// 檢查欄位
function logIncheck() {
  //   alert("AA");
  if (email.value == "") {
    warning1.innerHTML = `<p class="warning1 warning">此欄位不可為空</p>`;
  }
  if (password.value == "") {
    warning2.innerHTML = `<p class="warning2 warning">此欄位不可為空</p>`;
  }
}

// 登入
function logIn() {
  let obj = {
    user: {
      email: email.value.trim(),
      password: password.value.trim(),
    },
  };
  axios
    .post(`${baseUrl}/users/sign_in`, obj)
    .then((res) => {
      console.log(res.data);
      token = res.headers.authorization;
      nickname = res.data.nickname;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userNickname", nickname);
      if (res.data.message == "登入成功") {
        location.href = "./todo-list.html";
      } else {
        alert("登入失敗，若尚未註冊請前往註冊頁面註冊");
      }
    })
    .catch((err) => {
      console.log(err.data);
    });
}
