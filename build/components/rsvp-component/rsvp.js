import vue from 'vue'
import axios from 'axios'

import vuejsStorage from 'vuejs-storage'

vue.use(vuejsStorage);

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
        guestData: {
          invite: {},
          guests: []
        }
      },
      computed: {
        attemptedNotFound() {
          return this.error || (this.attempted && this.guestData.guests.length === 0);
        },
        foundGuests() {
          return this.guestData.guests.length > 0;
        }
      },
      methods: {
        async findRsvp() {
          // Only update the first name for the Easter Egg on submit
          // so as to not update ui on first name change
          this.firstNameForEasterEgg = this.inviteFormData.firstName;

          try {
            const csrfResponse = await axios.get('/csrf');
            this.inviteFormData._csrf = csrfResponse.data.csrf;
            const findInviteResponse = await axios.post('/findInvite', this.inviteFormData);
            if (findInviteResponse.data.success !== true) {
              this.error = true;
              return;
            }
            this.guestData.invite = findInviteResponse.data.guestData.invite || {};
            this.guestData.guests = findInviteResponse.data.guestData.guests || [];
          } catch (err) {
            console.log(err);
            this.error = true;
          }
          this.attempted = true;
        }
      },
      storage: {
        keys: ['attempted','rsvped','error','firstNameForEasterEgg','inviteFormData','guestData'],
        namespace: 'tj-rsvp'
      }
    });
  });
};