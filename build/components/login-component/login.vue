<template>
  <div>
    <form v-on:submit.prevent="sumbitForm">
      <div class="tj--width-half tj--width-full--tab tj--margin-hor-auto tj--padding-hor-1">
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
        <div class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2">
          <label for="username" class="tj--white-space-no-wrap tj--margin-right-1">Username:</label>
          <div class="tj-grid-flex__cell"><input id="username"
                                                 type="text"
                                                 class="tj-input tj--width-full"
                                                 required
                                                 v-model="loginData.username"></div>
        </div>
        <div class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2">
          <label for="password" class="tj--white-space-no-wrap tj--margin-right-1">Password:</label>
          <div class="tj-grid-flex__cell"><input id="password"
                                                 type="password"
                                                 class="tj-input tj--width-full"
                                                 required
                                                 v-model="loginData.password"></div>
        </div>
        <div class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2">
          <label for="remember" class="tj--white-space-no-wrap tj--margin-right-1">Remember Me:</label>
          <input id="remember"
                 type="checkbox"
                 v-model="loginData.remember">
        </div>
        <div class="tj--text-align-right">
          <button class="tj-button">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';
  const defaultErrorMessage = 'An unknown error has occurred.';

  export default {
    name: 'login',
    data() {
      return {
        loginData: {
          username: null,
          password: null,
          remember: null,
          _csrf: null, // Note _ is reserved for internal vue methods, csurf uses req.body._csrf; bind using this.$data._csrf
        },
        errorMessage: null
      }
    },
    methods: {
      async sumbitForm() {
        try {
          const csrfResponse = await axios.get('/csrf');
          this.loginData._csrf = csrfResponse.data.csrf;
          const loginResponse = await axios.post('/login', this.$data.loginData);
          if (loginResponse.data.errorMessage) {
            this.errorMessage = loginResponse.data.errorMessage;
            return;
          }
          //window.location.href = loginResponse.data.redirectUrl;
        } catch(err) {
          this.errorMessage = defaultErrorMessage;
        }
      }
    }
  }
</script>
