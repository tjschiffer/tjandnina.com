import Vue from 'vue'
import invitesApp from './invites.vue'

export default () => {
  document.querySelectorAll('[data-tj-invites]').forEach((login) => {
    new Vue({
      el: login,
      render: h => h(invitesApp)
    });
  });
};