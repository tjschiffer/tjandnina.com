import Vue from 'vue'

export default () => {
  document.querySelectorAll('[data-tj-invites]').forEach(async (invites) => {
    const invitesApp = await import('./invites.vue')
    new Vue({ // eslint-disable-line no-new
      el: invites,
      render: h => h(invitesApp.default)
    })
  })
}
