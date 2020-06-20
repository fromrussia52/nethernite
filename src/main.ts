import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/scss/styles.scss';
import 'bootstrap';
import { BootstrapVue } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
