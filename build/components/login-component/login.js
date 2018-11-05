import Vue from 'vue'

export default () => {
  document.querySelectorAll('[data-tj-login]').forEach(async (login) => {
    const loginApp = await import('./login.vue');
    new Vue({
      el: login,
      render: h => h(loginApp)
    });
  });
};
