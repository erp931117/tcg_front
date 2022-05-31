import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import vueHeadful from 'vue-headful';
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2';
import ListarComponent from './components/ListarComponent'
import LoginComponent from './components/LoginComponent'


Vue.config.productionTip = false
Vue.use(Vuelidate);
Vue.use(VueRouter);
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);
Vue.component('vue-headful', vueHeadful);

const routes = [{
		path: '/',
		name:'home',
		component: ListarComponent
	},
	{
		path: '/login',
		name: 'login',
		component: LoginComponent
	}
];

const router = new VueRouter({
	routes,
	mode: 'history'
});

new Vue({
	vuetify,
	router,
	render: h => h(App)
}).$mount('#app')
