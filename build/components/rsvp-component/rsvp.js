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
        firstNameForEasterEgg: null,
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
        async findRsvp() {
          // Only update the first name for the Easter Egg on submit
          // so as to not update ui on first name change
          this.firstNameForEasterEgg = this.inviteFormData.firstName;

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