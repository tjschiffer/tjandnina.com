import vue from 'vue'
import vuejsStorage from 'vuejs-storage'

vue.use(vuejsStorage);

export default () => {
  document.querySelectorAll('[data-tj-navigation]').forEach((navigation) => {
    new vue({
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
        //keep data.open in localStorage
        namespace: 'tj-navigation'
      }
    });
  });
};
