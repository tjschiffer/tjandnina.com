import vue from 'vue'
import axios from 'axios'

export default () => {
  document.querySelectorAll('[data-tj-rsvp]').forEach((rsvp) => {
    new vue({
      el: rsvp,
      data: {
        attempted: false,
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
        attemptedNotFound() {
          return this.error || (this.attempted && this.guests.length === 0);
        },
        foundGuests() {
          return this.guests.length > 0;
        }
      },
      methods: {
        async findRsvp(event) {
          // Rather than using v-model binding,
          // only update the form data values on findRsvp
          // This avoids changes to ui while the user is typing
          this.inviteFormData = event.target
            .getElementsByTagName('input')
            .reduce((inviteFormData, input) => {
              return inviteFormData[input.name] = input.value;
            }, {});

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