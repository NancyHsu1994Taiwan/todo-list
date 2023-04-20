import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      email: '',
      password: '',
      token: '',
      nickname: '',
    };
  },
  methods: {
    logIn() {
      const baseUrl = 'https://todoo.5xcamp.us';
      let obj = {
        user: {
          email: this.email,
          password: this.password,
        },
      };
      console.log(obj);
      axios
        .post(`${baseUrl}/users/sign_in`, obj)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.token = res.headers.authorization;
          this.nickname = res.data.nickname;
          // console.log(this.token, this.nickname);
          localStorage.setItem('userToken', this.token);
          localStorage.setItem('userNickname', this.nickname);
          // console.log('userToken', 'userNickname');
          if (res.data.message == '登入成功') {
            location.href = './todo-list.html';
          } else {
            alert('登入失敗，若尚未註冊請前往註冊頁面註冊');
          }
        })
        .catch((err) => {
          console.log(err.data);
        });
    },
  },
  mounted() {
    console.log(this);
    // this.logIn();
  },
}).mount('#app');
