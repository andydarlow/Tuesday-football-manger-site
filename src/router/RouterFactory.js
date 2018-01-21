import _ from 'lodash'
import Router from 'vue-router'

//  --------------------------------
//  actions performed on each page trabsition
//  ----------------------------------

function returnFromAuthAction (gotoUrlFunction, authService) {
  return async (to, from, next) => {
    try {
      gotoUrlFunction(await authService.handleAuthentication())
    } catch (authError) {
      console.log('error: ' + authError)
      next()
    }
  }
}

const authCheckAction = (gotoUrlFunction, authService) =>
  (to, from, next) => authService.isAuthenticated() ? next() : authService.login(to)

// ------------------------

const getActionForRoute = (route) => route.isAuthReturnURL ? returnFromAuthAction : authCheckAction
const addAction = (route, action) => _.merge({}, route, {beforeEnter: action})

// add appropiate Security actions to each route transaction
const generateRoutes = (routerConfig, gotoUrlFunction, authService) =>
    _.map(routerConfig.routes, r => addAction(r, getActionForRoute(r)(gotoUrlFunction, authService)))

// generate a route with security config added
function generateRouter (routerConfig, authService) {
  let router = new Router(_.omit(routerConfig, 'routes'))
  router.addRoutes(generateRoutes(routerConfig, name => router.replace({name: name}), authService))
  return router
}

export { generateRouter, generateRoutes }
