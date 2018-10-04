import vue from 'vue'
import vuex from 'vuex'
import weddingInvites from '../../vuex-modules/wedding-invites/wedding-invites'

export default () => {
  document.querySelectorAll('[data-tj-rsvp]').forEach((rsvp) => {
    new vue({
      el: rsvp,
      store: weddingInvites,
      data: {
        foundRsvp: false,
        rsvped: false,
        firstName: null,
        lastName: null,
        zipCode: null
      },
      created() {
        this.$store.dispatch('initialize')
      },
      computed: vuex.mapState({
          isLoaded: (state) => {
              return state.isLoaded;
          },
      }),
      methods: {
        findRsvp() {
          this.$store.dispatch('findRsvp', )
        }
      }
    });
  });
};