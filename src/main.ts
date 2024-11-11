import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import store from './stores/index';

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
