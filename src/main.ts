import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import LocalToolsDetailComp from '@/components/LocalToolsDetailComp.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.component('LocalToolsDetailComp', LocalToolsDetailComp)

app.mount('#app')