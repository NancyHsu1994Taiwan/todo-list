// DOM節點
const addTask = document.querySelector(".add-task"); // 新增按鈕
const inputValue = document.querySelector(".input-value"); // 新待辦輸入欄
const empty = document.querySelector(".empty"); // 預備畫面
const list = document.querySelector(".list"); // 總-待辦事項
const filter = document.querySelector(".filter"); // 上方篩選列
const wrapBox = document.querySelector(".js-wrap-task"); // 中央畫面
const nickNameBox = document.querySelector(".nickName"); // 右上角暱稱
const logOutBtn = document.querySelector(".logOut"); // 登出按鈕
const btnAll = document.querySelector(".btn-all");
const btnYet = document.querySelector(".btn-yet");
const btnDone = document.querySelector(".btn-done");

// API
const baseUrl = "https://todoo.5xcamp.us";
let token = localStorage.getItem("userToken");
let nickName = localStorage.getItem("userNickname");
// console.log(token, nickName);
let config = {
  headers: {
    Authorization: token,
  },
};

// 事件監聽
addTask.addEventListener("click", disappear);
addTask.addEventListener("click", renderFilter);
addTask.addEventListener("click", renderBox);
addTask.addEventListener("click", addTasks);
list.addEventListener("click", deleteTask);
// list.addEventListener("click", check);
list.addEventListener("click", switchStatus);
logOutBtn.addEventListener("click", logOut);
btnAll.addEventListener("click", checkAll);
btnYet.addEventListener("click", checkYet);
btnDone.addEventListener("click", checkDone);

// 變數
let data = []; // 儲存所有資料
let checkData = []; // 儲存已完成資料
let restData = []; // 儲存未完成資料
let position = 0;

// 預備畫面消失
function disappear() {
  empty.innerHTML = "";
}
// 顯示待辦區塊
function renderBox() {
  wrapBox.setAttribute("class", "js-wrap-task wrap-task");
  list.setAttribute("class", "list px-4 d-block");
}

// 渲染篩選功能
function renderFilter() {
  filter.setAttribute("class", "d-flex justify-content-between");
  // let filterContent = `
  //       <li><input type="button" value="全部" class="filter-btn"/></li>
  //       <li><input type="button" value="待完成" class="filter-btn"/></li>
  //       <li><input type="button" value="已完成" class="filter-btn"/></li>
  //     `;
  // filter.innerHTML = filterContent;
}

// 資料初始化
// 取得資料
function getData() {
  axios
    .get(`${baseUrl}/todos`, config)
    .then((res) => {
      // token = res.headers.authorization;
      // console.log(token);
      // console.log(res.data);
      data = res.data.todos;

      // console.log(data);
      renderData();
    })
    .catch((err) => {
      console.log(err);
    });
}
getData();

// 新增功能
function addTasks() {
  if (inputValue.value == "") {
    alert("請輸入內容");
    return;
  }
  let obj = {
    todo: {
      content: inputValue.value,
    },
  };

  axios
    .post(`${baseUrl}/todos`, obj, config)
    .then((res) => {
      // console.log(res.data);
      // data = res.data;
      data.push(obj);
      // console.log(data);
      getData();
      inputValue.value = "";
    })

    .catch((err) => {
      console.log(err);
    });
}

// 渲染資料
// 舊
// function renderData() {
//   let str = "";

//   data.forEach((item, index) => {
//     str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
//       item.id
//     }" data-completed="${item.completed_at}">
//         <label class="d-flex">
//           <input type="checkbox"/>
//           <div class="js-check check">
//             <img id="checkTodo" data-id="${item.id}" src="${
//       item.completed_at !== null
//         ? "./images/check.svg"
//         : "./images/checkbox.svg"
//     }">
//             </div>
//           <p class="task-content mx-3">${item.content}</p>
//         </label>
//         <button class="js-delete delete">
//         <img src="./images/delete.svg" alt="" srcset="" class="js-delete"/>
//         </button>
//       </li>`;
//   });

//   list.innerHTML = str;
// }

// 刪除功能
function deleteTask(e) {
  if (e.target.getAttribute("class") !== "js-delete") {
    // console.log(e.target.getAttribute("class"));
    return;
  }
  // console.log(e.target);
  let id = e.target.parentNode.parentNode.getAttribute("data-id");
  let num = e.target.parentNode.parentNode.getAttribute("data-num");
  // console.log(id);
  // console.log(num);
  axios
    .delete(`${baseUrl}/todos/${id}`, config)
    .then((res) => {
      // console.log(id);
      data.splice(num, 1);
      getData();
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(num);
  alert("刪除成功！");
}

// 篩選按鈕狀態切換
function checkAll(e) {
  position = 1;
  btnAll.classList.add("active");
  btnYet.classList.remove("active");
  btnDone.classList.remove("active");
  renderData();
}
function checkYet(e) {
  position = 2;
  btnAll.classList.remove("active");
  btnYet.classList.add("active");
  btnDone.classList.remove("active");
  renderData();
}
function checkDone(e) {
  position = 3;
  btnAll.classList.remove("active");
  btnYet.classList.remove("active");
  btnDone.classList.add("active");
  renderData();
}

// 切換已完成或待完成;
function switchStatus(e) {
  let id = e.target.getAttribute("data-id");
  let obj = data.filter((item) => item.id === id)[0];
  console.log(id);
  console.log(obj);
  if (id != null) {
    axios
      .patch(`${baseUrl}/todos/${id}/toggle`, "", config)
      .then((res) => {
        console.log(res);
        // 在總陣列中找到點選的該項的索引位置(此時completed_at=null)，移除，再插入回傳的點選的該項(此時completed_at=當時時間戳)
        data.splice(data.indexOf(obj), 1, res.data);
        renderData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// --------------------------------------
// 篩選功能
// 舊
// function check(e) {
// 確認核取方塊按鈕
// if (e.target.getAttribute("class") !== "js-check check") {
//  console.log(e.target.getAttribute("class"));
//   return;
// }
// console.log("hi");
// 抓取核取方塊按鈕
// let checkBtn = e.target;
// 抓取待辦事項文字內容
// let taskContent = e.target.parentNode.childNodes[5];
// 抓取該項的ID
// let Id = e.target.parentNode.parentNode.getAttribute("data-id");
// 抓取該項的data-completed屬性(與completed_at連動)
// let completedTime =
//   e.target.parentNode.parentNode.getAttribute("data-completed");

// 點擊後加上刪除線
// 失敗
// taskContent.classList.toggle("line-through");
// listItem.classList.toggle("");
// console.log(checkBtn);
// console.log(Id);
// console.log(e.target.parentNode.childNodes);

// 點擊後加上當下時間戳
// let newData = data.map((item) => {
//   if (item.id == Id) {
//     item.completed_at = Date.now();
//   }

//   return item;
// });
// newData.map((item) => {
//   if (item.completed_at !== null) {
//     checkBtn.innerHTML = `<img src="./images/check.svg" alt="">`;
//   }
// });

// console.log(newData);

// axios
//   .patch(`${baseUrl}/todos/${Id}/toggle`, {}, config)
//   .then((res) => {
//    console.log(res);

//     data = newData;
//     getData();
//     checkData = data.filter((item) => {
//       return item.completed_at != null;
//     });
//     console.log(checkDa  a);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }
// --------------------------------

// 渲染功能
// 新
function renderData() {
  if (position === 1) {
    let str = "";
    data.map((item, index) => {
      str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
        item.id
      }" data-completed="${item.completed_at}">
        <label class="d-flex">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
        item.completed_at !== null
          ? "./images/check.svg"
          : "./images/checkbox.svg"
      }">
          </div>
          <p class="${
            item.completed_at !== null
              ? "task-content mx-3 line-through"
              : "task-content mx-3"
          }">${item.content}</p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
    });
    list.innerHTML = str;
  } else if (position === 2) {
    let str = "";
    data.filter((item, index) => {
      if (!item.completed_at) {
        str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
          item.id
        }" data-completed="${item.completed_at}">
        <label class="d-flex">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
          item.completed_at !== null
            ? "./images/check.svg"
            : "./images/checkbox.svg"
        }">
          </div>
          <p class="${
            item.completed_at !== null
              ? "task-content mx-3 line-through"
              : "task-content mx-3"
          }">${item.content}</p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
      }
    });
    list.innerHTML = str;
  } else if (position === 3) {
    let str = "";
    data.filter((item, index) => {
      if (item.completed_at) {
        str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
          item.id
        }" data-completed="${item.completed_at}">
        <label class="d-flex">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
          item.completed_at !== null
            ? "./images/check.svg"
            : "./images/checkbox.svg"
        }">
          </div>
          <p class="${
            item.completed_at !== null
              ? "task-content mx-3 line-through"
              : "task-content mx-3"
          }">${item.content}</p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
      }
    });
    list.innerHTML = str;
  }
  console.log(data.length);
  if (data.length === 0) {
    wrapBox.setAttribute("class", "js-wrap-task d-none");
    list.setAttribute("class", "list px-4 d-none");
    filter.setAttribute("class", "filter d-none");
    empty.setAttribute(
      "class",
      "empty d-flex flex-column justify-content-center align-items-center"
    );
  } else {
    wrapBox.setAttribute("class", "js-wrap-task wrap-task");
    list.setAttribute("class", "list px-4 d-block");
    filter.setAttribute("class", "filter d-flex");
    empty.setAttribute("class", "empty d-none");
    // let str = "";
    // data.map((item, index) => {
    //   str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
    //     item.id
    //   }" data-completed="${item.completed_at}">
    //     <label class="d-flex">
    //       <input type="checkbox"/>
    //       <div class="js-check check">
    //         <img id="checkTodo" data-id="${item.id}" src="${
    //     item.completed_at !== null
    //       ? "./images/check.svg"
    //       : "./images/checkbox.svg"
    //   }">
    //       </div>
    //       <p class="${
    //         item.completed_at !== null
    //           ? "task-content mx-3 line-through"
    //           : "task-content mx-3"
    //       }">${item.content}</p>
    //     </label>
    //     <button class="js-delete delete">
    //       <img src="./images/delete.svg" alt="" srcset="" class="js-delete"/>
    //     </button>
    //   </li>`;
    // });
    // list.innerHTML = str;
  }
}

// // 帶入用戶暱稱
// function renderNickName() {
//   nickNameBox.textContent = `${nickName}的待辦`;
// }
// renderNickName();

// 檢查登入狀態
axios
  .get(`${baseUrl}/check`, config)
  .then((res) => {
    nickNameBox.textContent = `${nickName}的待辦`;
    getData();
  })
  .catch((err) => {
    location.href = "index.html";
  });

// 登出功能
function logOut() {
  axios
    .delete(`${baseUrl}/users/sign_out`, config)
    .then((res) => {
      console.log(res);
      alert("已成功登出");
      location.href = "./index.html";
    })
    .catch((err) => {
      console.log(err);
    });
}
