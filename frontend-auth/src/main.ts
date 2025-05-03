import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router, { setupAuthWatcher } from './router';
import { createPinia } from 'pinia';
import AuthPlugin from './plugins/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(AuthPlugin);

// Setup auth watcher after Pinia is properly initialized
setupAuthWatcher()

app.mount('#app');