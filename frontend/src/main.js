import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import vueCookies from 'vue-cookies'

// axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vueCookies)

app.$cookies.config('7d') // 쿠키 저장 7일
app.config.globalProperties.axios = axios; // axios 전역화

app.mount('#app')
