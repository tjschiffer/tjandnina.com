/**
 * This module allows for the creation of the Google API to access a Google Sheet
 * with the wedding guests in it
 */

import vue from 'vue'
import vuex from 'vuex'
import options from './auth.json'

vue.use(vuex);

const spreadsheetId = '1TIGZJn0ZPDhVjTXFBfIIXrPIQs8pCf20CqRNaCrLvc4';
const googleApiId = 'google-api';

const KEY_FIRST_NAME = 'FirstName';

const reformatNamesAndZipCodes = () => {

};

export default new vuex.Store({
    state: {
        isLoaded: false
    },
    strict: process.env.NODE_ENV !== 'production',
    mutations: {
        setLoaded: function (state, payload) {
            state.isLoaded = payload;
        }
    },
    actions: {
        initialize(context) {
            // If the api is already loaded or the script tag has already been added
            // do not add the script tag again
            if (this.isLoaded || document.getElementById(googleApiId)) {
                return;
            }

            const initClient = () => {
                window.gapi.client.init(options).then(function () {
                    context.commit('setLoaded', true);
                });
            };

            // Callback must be added to window for the Google API to call
            window.handleClientLoad = () => {
                window.gapi.load('client', initClient);
            };

            // Add Google API to the head, and call handleClientLoad once complete
            // https://developers.google.com/sheets/api/quickstart/js
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.id = googleApiId;
            s.src = 'https://apis.google.com/js/api.js';
            s.setAttribute('async', '');
            s.setAttribute('defer', '');
            s.setAttribute('onload', 'this.onload=function(){};handleClientLoad()');
            s.setAttribute('onreadystatechange', 'if (this.readyState === \'complete\') this.onload()');
            document.head.appendChild(s);
        },
        findRsvp(context, payload) {
            window.gapi.client.sheets.spreadsheets.values.batchGet({
                spreadsheetId: spreadsheetId,
                ranges: ['WeddingGuests!B2:E150','WeddingGuests!K2:K150'],
            }).then(function(response) {
                console.log(response.result);
            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }
    }
});
