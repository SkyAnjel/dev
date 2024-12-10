import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.less';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(ElementPlus).mount('#app');
