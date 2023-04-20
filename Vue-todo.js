import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      token: localStorage.getItem('userToken'),
      nickName: localStorage.getItem('userNickname'),
      baseUrl: 'https://todoo.5xcamp.us',
      config: {
        headers: {
          Authorization: localStorage.getItem('userToken'),
        },
      },
      todoData: [],
      addContent: '',
      //   editContent: '',
      position: 1,
      uncompletedNum: 0,
    };
  },
  methods: {
    // ✅取得
    getData() {
      console.log(this.config);
      axios
        .get(`${this.baseUrl}/todos`, this.config)
        .then((res) => {
          //   token = res.headers.authorization;
          //   console.log(token);
          //   console.log(res);
          this.todoData = res.data.todos;
          console.log(this.todoData);
          this.renderData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // ✅新增
    addTask() {
      if (this.addContent == '') {
        alert('請輸入內容');
        return;
      }
      let obj = {
        todo: {
          content: this.addContent,
        },
      };
      console.log(obj);
      axios
        .post(`${this.baseUrl}/todos`, obj, this.config)
        .then((res) => {
          console.log(res);
          //   newTask = res.data;
          this.todoData.push(obj);
          //   console.log(this.todoData);
          this.getData();
          this.addContent = '';
        })

        .catch((err) => {
          console.log(err);
        });
    },
    // ❌修改
    // editTask(event) {
    //   let check = event.target.getAttribute('id');
    //   //   let content = event.target.getAttribute('value');
    //   let id = event.target.parentNode.parentNode.getAttribute('data-id');

    //   console.log(check);
    //   console.log(id);
    //   let obj = {
    //     todo: {
    //       content: '',
    //     },
    //   };
    //   //   console.log(check);
    //   //   if (check !== 'task-content') {
    //   //     return;
    //   //   }
    // },

    // ✅刪除
    deleteTask(event) {
      let click = event.target.getAttribute('id');
      let id = event.target.parentNode.parentNode.getAttribute('data-id');
      let num = event.target.parentNode.parentNode.getAttribute('data-num');
      console.log(click);
      console.log(id);
      if (click !== 'deleteBtn') {
        return;
      }
      axios
        .delete(`${this.baseUrl}/todos/${id}`, this.config)
        .then((res) => {
          console.log(res);
          this.todoData.splice(num, 1);
          this.getData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // ✅篩選狀態切換
    filterAll() {
      this.position = 1;
      this.renderData();
    },
    filterYet() {
      this.position = 2;
      this.renderData();
    },
    filterDone() {
      this.position = 3;
      this.renderData();
    },
    // ✅切換已完成或待完成
    switchStatus(event) {
      let check = event.target.getAttribute('id');
      let id = event.target.getAttribute('data-id');
      let obj = this.todoData.filter((item) => item.id === id)[0];
      console.log(id);
      //   console.log(obj);
      console.log(check);
      if (check !== 'checkTodo') {
        return;
      }
      if (id != null) {
        axios
          .patch(`${this.baseUrl}/todos/${id}/toggle`, '', this.config)
          .then((res) => {
            console.log(res);
            // 在總陣列中找到點選的該項的索引位置(此時completed_at=null)，移除，再插入回傳的點選的該項(此時completed_at=當時時間戳)
            this.todoData.splice(this.todoData.indexOf(obj), 1, res.data);
            this.renderData();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // ✅渲染
    renderData() {
      const list = document.querySelector('.list');
      const yetBtn = document.querySelector('.btn-yet');
      const doneBtn = document.querySelector('.btn-done');
      if (this.position == 1) {
        let str = '';
        this.todoData.forEach((item, index) => {
          str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
            item.id
          }" data-completed="${item.completed_at}">
        <label class="d-flex  align-items-center">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
            item.completed_at !== null
              ? './images/check.svg'
              : './images/checkbox.svg'
          }">
          </div>
          <input type="text" id="task-content" class="${
            item.completed_at !== null
              ? 'task-content mx-3 line-through'
              : 'task-content mx-3'
          } border-0" value="${item.content}"></p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg" id="deleteBtn" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
          //   if (item.completed_at === null) {
          //     this.uncompletedNum += 1;
          //   }
        });
        list.innerHTML = str;
      } else if (this.position == 2) {
        let str = '';
        this.todoData.forEach((item, index) => {
          if (!item.completed_at) {
            str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
              item.id
            }" data-completed="${item.completed_at}">
        <label class="d-flex  align-items-center">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
              item.completed_at !== null
                ? './images/check.svg'
                : './images/checkbox.svg'
            }">
          </div>
          <input type="text" class="${
            item.completed_at !== null
              ? 'task-content mx-3 line-through'
              : 'task-content mx-3'
          } border-0" value="${item.content}"></p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg"  id="deleteBtn" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
            // if (item.completed_at === null) {
            //   this.uncompletedNum += 1;
            // }
          }
        });
        list.innerHTML = str;
      } else if (this.position == 3) {
        let str = '';
        this.todoData.forEach((item, index) => {
          if (item.completed_at) {
            str += `<li class="list-item d-flex align-items-center" data-num="${index}" data-id="${
              item.id
            }" data-completed="${item.completed_at}">
        <label class="d-flex  align-items-center">
          <input type="checkbox"/>
          <div class="js-check check">
            <img id="checkTodo" data-id="${item.id}" src="${
              item.completed_at !== null
                ? './images/check.svg'
                : './images/checkbox.svg'
            }">
          </div>
          <input type="text" class="${
            item.completed_at !== null
              ? 'task-content mx-3 line-through'
              : 'task-content mx-3'
          } border-0" value="${item.content}"></p>
        </label>
        <button class="js-delete delete">
          <img src="./images/delete.svg"  id="deleteBtn" alt="" srcset="" class="js-delete"/>
        </button>
      </li>`;
            // if (item.completed_at === null) {
            //   this.uncompletedNum += 1;
            // }
          }
        });
        list.innerHTML = str;
      }
      // 預備畫面消失或顯示
      if (this.todoData.length == 0) {
        document.querySelector('#empty').setAttribute('class', 'd-block');
        document.querySelector('#list').setAttribute('class', 'd-none');
      } else {
        document.querySelector('#empty').setAttribute('class', 'd-none');
        document
          .querySelector('#list')
          .setAttribute('class', 'd-block wrap-task');
      }
      // 計算待完成項目數量
      let incompletedData = this.todoData.filter((item) => {
        return item.completed_at == null;
      });
      console.log(incompletedData);
      this.uncompletedNum = incompletedData.length;
    },
    // ✅檢查登入狀態
    checkLogIn() {
      //   console.log(this.token);
      //   console.log(this.nickName);
      //   console.log(this.baseUrl);
      axios
        .get(`${this.baseUrl}/check`, this.config)
        .then((res) => {
          console.log(res);
          if (this.token == null) {
            location.href = 'login.html';
            alert('登入失敗');

            return;
          }
          //   console.log(this.token);
          //   console.log(this.nickName);
          //   console.log(this.config);
          this.getData();
          //   return;
        })
        .catch((err) => {
          location.href = 'login.html';
        });
    },
    // ✅登出
    logOut() {
      axios
        .delete(`${this.baseUrl}/users/sign_out`, this.config)
        .then((res) => {
          console.log(res);
          alert('已成功登出');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userNickname');
          location.href = './login.html';
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // this.getData();
    // 檢查登入狀態
    this.checkLogIn();
  },
}).mount('#app');
