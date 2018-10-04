import vue from 'vue'
import loginApp from './login.vue'

export default () => {
  document.querySelectorAll('[data-tj-login]').forEach((login) => {
    new vue({
      el: login,
      render: h => h(loginApp)
    });
  });
};
