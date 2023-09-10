import { createApp } from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import './registerServiceWorker';
import store from './store';

createApp(App)
  .use(vuetify)
  .use(store)
  .mount('#app');
