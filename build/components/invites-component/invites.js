import Vue from 'vue'

export default () => {
  document.querySelectorAll('[data-tj-invites]').forEach(async (login) => {
    const invitesApp = await import('./invites.vue');
    new Vue({
      el: login,
      render: h => h(invitesApp)
    });
  });
};