<template>
  <div>
    <div
      v-if="loading"
      class="tj--text-align-center tj--margin-top-5"
    >
      <loading-dots />
    </div>
    <form
      v-else
      @submit.prevent="sumbitForm"
    >
      <div class="tj--width-half tj--width-full--tab tj--margin-hor-auto tj--padding-hor-1">
        <div
          v-if="errorMessage"
          class="tj--width-full
                    tj--border-radius-3
                    tj--bg-red
                    tj--border-dark-gray
                    tj--font-dark-gray
                    tj--padding-1
                    tj--text-align-center
                    tj--margin-bottom-2"
          v-text="errorMessage"
        />
        <div
          class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2"
        >
          <label
            for="username"
            class="tj--white-space-no-wrap tj--margin-right-1"
          >
            Username:
          </label>
          <div class="tj-grid-flex__cell">
            <input
              id="username"
              v-model="loginFormData.username"
              type="text"
              class="tj-input tj--width-full"
              required
            >
          </div>
        </div>
        <div
          class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2"
        >
          <label
            for="password"
            class="tj--white-space-no-wrap tj--margin-right-1"
          >
            Password:
          </label>
          <div class="tj-grid-flex__cell">
            <input
              id="password"
              v-model="loginFormData.password"
              type="password"
              class="tj-input tj--width-full"
              required
            >
          </div>
        </div>
        <div
          class="tj-grid-flex
                    tj-grid-flex--align-center
                    tj--margin-bottom-2"
        >
          <label
            for="remember"
            class="tj--white-space-no-wrap tj--margin-right-1"
          >
            Remember Me:
          </label>
          <input
            id="remember"
            v-model="loginFormData.remember"
            type="checkbox"
          >
        </div>
        <div class="tj--text-align-right">
          <button class="tj-button--parisian-sky">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import loadingDots from '../../vue-components/loading-dots'
const defaultErrorMessage = 'An unknown error has occurred.'

export default {
  name: 'Login',
  components: {
    loadingDots
  },
  data () {
    return {
      loginFormData: {
        username: null,
        password: null,
        remember: null,
        _csrf: null
      },
      errorMessage: null,
      loading: false
    }
  },
  methods: {
    async sumbitForm () {
      this.loading = true
      try {
        const csrfResponse = await axios.get('/csrf')
        this.loginFormData._csrf = csrfResponse.data.csrf
        // Pass the search query to make sure the redirectUrl works
        const loginResponse = await axios.post('/login' + window.location.search, this.$data.loginFormData)
        if (loginResponse.data.errorMessage) {
          this.errorMessage = loginResponse.data.errorMessage
          this.loading = false
          return
        }
        window.location.href = loginResponse.data.redirectUrl
      } catch (err) {
        this.errorMessage = defaultErrorMessage
        this.loading = false
      }
    }
  }
}
</script>
