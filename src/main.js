import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import App from './App'
import axios from 'axios'
import VueResource from 'vue-resource';



axios.defaults.withCredentials=true;

Vue.use(ElementUI)
Vue.use(VueResource);
new Vue({
  router,
  VueResource,
  el: '#app',
  template: '<App/>',
  components: { App }

})