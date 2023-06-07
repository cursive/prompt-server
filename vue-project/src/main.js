// main.js
import { createApp } from 'vue';
import App from './App.vue';
//import PhosphorIcons from "@phosphor-icons/vue"
//import * as PhosphorIcons from "@phosphor-icons/vue";
import router from './router';
import { createPinia } from 'pinia';




const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
//app.use(PhosphorIcons)
app.use(router);
app.mount('#app');
