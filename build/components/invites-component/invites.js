import Vue from 'vue'

export default () => {
  document.querySelectorAll('[data-tj-invites]').forEach(async (invites) => {
    const invitesApp = await import('./invites.vue');
    new Vue({
      el: invites,
      render: h => h(invitesApp.default)
    });
  });
};
