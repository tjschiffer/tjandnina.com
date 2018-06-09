import Vue from 'vue'
import vuejsStorage from 'vuejs-storage'

Vue.use(vuejsStorage);

export default (el) => {
  el.querySelectorAll('[data-tj-navigation]').forEach((navigation) => {
    new Vue({
      el: navigation,
      data: {
        open: false
      },
      methods: {
        toggleOpen() {
          this.open = !this.open;
        },
        close() {
          this.open = false;
        },
      },
      storage: {
      keys: ['open'],
        //keep data.count in localStorage
        namespace: 'tj-navigation'
      }
    });
  });
};
