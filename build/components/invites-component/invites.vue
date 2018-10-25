<template>
  <div>
    <div v-if="loading" class="tj--text-align-center tj--margin-top-5">
      <loading-dots></loading-dots>
    </div>
    <table></table>
  </div>
</template>

<script>
  import axios from 'axios'
  import loadingDots from '../../vue-components/loading-dots'

  export default {
    name: 'tjandnina-invites',
    data() {
      return {
        invites: [],
        loading: true
      }
    },
    components: {
      loadingDots
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
