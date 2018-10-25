<template>
  <div>
    <div v-if="errorMessage"
         v-text="errorMessage"
         class="tj--width-full
                    tj--border-radius-3
                    tj--bg-red
                    tj--border-dark-gray
                    tj--font-dark-gray
                    tj--padding-1
                    tj--text-align-center
                    tj--margin-bottom-2">
    </div>
    <div v-else-if="loading" class="tj--text-align-center tj--margin-top-5">
      <loading-dots></loading-dots>
    </div>
    <table v-else></table>
  </div>
</template>

<script>
  import axios from 'axios'
  import loadingDots from '../../vue-components/loading-dots'
  const defaultErrorMessage = 'An unknown error has occurred.';

  export default {
    name: 'invites',
    data() {
      return {
        invites: [],
        loading: true,
        errorMessage: null
      }
    },
    components: {
      loadingDots
    },
    async beforeCreate() {
      try {
        const invitesResponse = await axios.post('/invites');
        this.invites = invitesResponse.data.invitesWithGuests;
      } catch(err) {
        this.errorMessage = defaultErrorMessage;
      }
      this.loading = false;
    },
    methods: {
      async sumbitForm() {
        this.loading = true;
        try {
          const csrfResponse = await axios.get('/csrf');
          this.loginFormData._csrf = csrfResponse.data.csrf;
          // Pass the search query to make sure the redirectUrl works
          const loginResponse = await axios.post('/login' + window.location.search, this.$data.loginFormData);
          if (loginResponse.data.errorMessage) {
            this.errorMessage = loginResponse.data.errorMessage;
            this.loading = false;
            return;
          }
          window.location.href = loginResponse.data.redirectUrl;
        } catch(err) {
          this.errorMessage = defaultErrorMessage;
          this.loading = false;
        }
      }
    }
  }
</script>
