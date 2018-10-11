import vue from 'vue'
import axios from 'axios'

import vuejsStorage from 'vuejs-storage'

vue.use(vuejsStorage);

const getDefaultData = () => {
  return {
    attempted: false,
    error: false,
    firstNameForEasterEgg: null,
    loading: false,
    rsvped: false,
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
  };
};

export default () => {
  document.querySelectorAll('[data-tj-rsvp]').forEach((rsvp) => {
    new vue({
      el: rsvp,
      data: getDefaultData,
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
          this.error = false;

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
        },
        updateGuestAttending(index, newValue) {
          if (index >= this.guestData.guests.length) {
            return;
          }
          this.guestData.guests[index].attending = newValue;
        },
        updateGuestAttendingWelcomeEvent(index, newValue) {
          if (index >= this.guestData.guests.length) {
            return;
          }
          this.guestData.guests[index].attending_welcome_event = newValue;
        },
        updateGuestAttendingAfterParty(index, newValue) {
          if (index >= this.guestData.guests.length) {
            return;
          }
          this.guestData.guests[index].attending_after_party = newValue;
        },
        goBackToSearch() {
          this.attempted = false;
          this.guestData = {
            invite: {},
            guests: []
          }
        },
        resetData() {

        },
        async submitRsvp() {
          this.error = false;
          try {
            const submitInviteResponse = await axios.post('/submitInvite', this.guestData);
            if (submitInviteResponse.data.success !== true) {
              this.error = true;
              return;
            }
            // Reset the data to the default values but with rsvped = true
            // This will show the thank you message then reset rsvped
            // to false on page load since it is not stored in vuejs-storage
            const newData = getDefaultData();
            newData.rsvped = true;
            this.$data = newData;
          } catch (err) {
            this.error = true;
          }
        },
      },
      storage: {
        // Keep all keys except rsvped so the thank you screen is not persistent
        keys: ['attempted','error','firstNameForEasterEgg','inviteFormData','guestData'],
        namespace: 'tj-rsvp'
      }
    });
  });
};