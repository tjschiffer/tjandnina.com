/**
 * This module allows for the creation of the Google API to access a Google Sheet
 * with the wedding guests in it
 */

import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex);

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

        },
        findRsvp(context, payload) {

        }
    }
});
