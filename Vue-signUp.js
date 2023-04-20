import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
  data() {
    return {
      email: '',
      nickname: '',
      password: '',
      passwordAgain: '',
    };
  },
  methods: {
    // 檢查欄位不可為空
    // logIncheck() {
    //   const inputValue = document.querySelectorAll('input');
    //   console.log(inputValue);

    // },
    // 註冊功能
    signUp() {
      const baseUrl = 'https://todoo.5xcamp.us';

      let obj = {
        user: {
          email: this.email,
          nickname: this.nickname,
          password: this.password,
        },
      };
      console.log(obj);
      axios
        .post(`${baseUrl}/users`, obj)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // console.log(this);
    // console.log(this.email);
    // this.signUp();
    // this.logIncheck();
  },
}).mount('#app');
