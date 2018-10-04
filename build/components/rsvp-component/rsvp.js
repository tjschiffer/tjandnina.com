import vue from 'vue'
import axios from 'axios'

export default () => {
  document.querySelectorAll('[data-tj-rsvp]').forEach((rsvp) => {
    new vue({
      el: rsvp,
      data: {
        attempted: false,
        foundRsvp: false,
        rsvped: false,
        error: false,
        inviteFormData: {
          firstName: null,
          lastName: null,
          zipCode: null,
          _csrf: null
        },
        guests: []
      },
      created() {
        this.$store.dispatch('initialize')
      },
      computed: {
        attemptedNotFound: () => {
          return this.attempted && !this.foundRsvp;
        }
      },
      methods: {
        async findRsvp() {
          try {
            const csrfResponse = await axios.get('/csrf');
            this.loginFormData._csrf = csrfResponse.data.csrf;
            const findInviteResponse = await axios.post('/findInvite', this.inviteFormData);
            this.guests = findInviteResponse.data.guests;
          } catch (err) {
            this.error = true;
          }
        }
      }
    });
  });
};