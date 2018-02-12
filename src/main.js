// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import * as firebase from 'firebase'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
import Vuex from 'vuex'
import { store } from './store/store'

//Components
import Home from './components/Home.vue'
import SignUp from './components/SignUp.vue'
import HomeVuetify from './components/HomeVuetify.vue'
import Coins from './components/Coins.vue'


Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  //{ path: '/', component: Home }
  //{ path: '/login', component: Login },
  { path: '/', component: HomeVuetify },  
  { path: '/signup', component: SignUp },
  { path: '/coins', component: Coins },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

/* eslint-disable*/
new Vue({
  store:store,
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  created(){
    firebase.initializeApp({
      apiKey: 'AIzaSyBKS2mTEl_u-L1xWbY9xi3QGVSVT37LCg8',
      authDomain: 'inclitibeta.firebaseapp.com',
      databaseURL: 'https://inclitibeta.firebaseio.com',
      projectId: 'inclitibeta',
      storageBucket: 'inclitibeta.appspot.com',
      messagingSenderId: '1037154318940'
    })
  }
})
