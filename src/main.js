// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routerConfig from './router/RoutesList'
import VeeValidate from 'vee-validate'
import VuejsDialog from 'vuejs-dialog'
import AuthService from '@/services/Auth0Service.js'
import Vuex from 'vuex'
import store from '@/store/FootballManagerStore'
import {generateRouter} from '@/router/RouterFactory'
import Router from 'vue-router'

Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(VuejsDialog)
Vue.use(Vuex)
Vue.use(Router)
let authService = new AuthService({
  domain: 'turhnamtuesfootie.eu.auth0.com',
  clientID: 'mwHPdAU9pAhhE9bIuym8xTiavulGOYmQ',
  redirectUri: 'http://localhost:8080/authcallback',
  audience: 'https://turhnamtuesfootie.eu.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: generateRouter(routerConfig, authService),
  template: '<App/>',
  components: { App },
  store
})
