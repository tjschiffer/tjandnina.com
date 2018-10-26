import Vue from 'vue'
import loginApp from './login.vue'

export default () => {
  document.querySelectorAll('[data-tj-login]').forEach((login) => {
    new Vue({
      el: login,
      render: h => h(loginApp)
    });
  });
};
