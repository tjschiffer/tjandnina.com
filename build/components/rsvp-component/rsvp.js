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
      computed: {
        attemptedNotFound: () => {
          return this.attempted && !this.foundRsvp;
        }
      },
      methods: {
        async findRsvp() {
          this.attempted = true;
          try {
            const csrfResponse = await axios.get('/csrf');
            this.inviteFormData._csrf = csrfResponse.data.csrf;
            const findInviteResponse = await axios.post('/findInvite', this.inviteFormData);
            this.guests = findInviteResponse.data.guests;
          } catch (err) {
            console.log(err);
            this.error = true;
          }
        }
      }
    });
  });
};