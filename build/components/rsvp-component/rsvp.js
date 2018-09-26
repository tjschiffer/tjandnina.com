import Vue from 'vue'

import LoadGoogleAPI from 'load-google-api'
import options from '../../auth.json'

const contacts = new LoadGoogleAPI(options);


export default (el) => {
  el.querySelectorAll('[data-tj-rsvp]').forEach((rsvp) => {
    console.log(contacts);
    new Vue({
      el: rsvp,
      data: {
        foundRsvp: false,
        rsvped: false
      },
      methods: {
        findRsvp() {

        }
      }
    });
  });
};