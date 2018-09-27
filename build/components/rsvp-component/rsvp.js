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
            return 'https://sheets.googleapis.com/v4/spreadsheets/1TIGZJn0ZPDhVjTXFBfIIXrPIQs8pCf20CqRNaCrLvc4/values/Sheet1!A1:D5';
        }
      }
    });
  });
};