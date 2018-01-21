import {generateRoutes, generateRouter} from '@/router/RouterFactory'
import ChooseCaptainsPage from '@/pages/ChooseCaptainsPage'
import MembersEditorPage from '@/pages/MembersEditorPage'
import _ from 'lodash'

describe('route generator functionaity', () => {
  it('it has a set of routes', () => {
    const service = {}
    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]}
    let resultSet = generateRoutes(testData, {}, service)
    expect(resultSet).toHaveLength(2)
    let beforeFunctions = _.filter(resultSet, r => r.hasOwnProperty('beforeEnter'))
    expect(beforeFunctions).toHaveLength(2)
  })

  it('has no routes', () => {
    const service = {}
    const testData = {
      mode: 'history',
      routes: []}
    let resultSet = generateRoutes(testData, {}, service)
    expect(resultSet).toHaveLength(0)
    let beforeFunctions = _.filter(resultSet, r => r.hasOwnProperty('beforeEnter'))
    expect(beforeFunctions).toHaveLength(0)
  })

  it('it generates an aut check route for authorised', () => {
    const handleAuthmockCall = jest.fn()
    const loginMockCall = jest.fn()
    loginMockCall.mockReturnValueOnce('')
    const nextMockCall = jest.fn()

    const service = {
      isAuthenticated () { return true },
      login (nextUrl) { return loginMockCall() },
      handleAuthentication () { return new Promise().resolve(handleAuthmockCall()) }
    }
    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]}
    let resultSet = generateRoutes(testData, name => 'testName', service)
    let authCheckRoute = _.find(resultSet, r => !r.isAuthReturnURL)
    expect(authCheckRoute).toBeTruthy()
    authCheckRoute.beforeEnter({name: 'to'}, {name: 'from'}, () => nextMockCall())
    expect(handleAuthmockCall.mock.calls.length).toBe(0)
    expect(loginMockCall.mock.calls.length).toBe(0)
    expect(nextMockCall.mock.calls.length).toBe(1)
  })

  it('it generates an aut check route for not authorised', () => {
    const handleAuthmockCall = jest.fn()
    const loginMockCall = jest.fn()
    loginMockCall.mockReturnValueOnce('')
    const nextMockCall = jest.fn()

    const service = {
      isAuthenticated () { return false },
      login (nextUrl) { return loginMockCall() },
      handleAuthentication () {
        return new Promise((resolve, reject) => {
          handleAuthmockCall()
          resolve('')
        })
      }
    }
    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]}
    let resultSet = generateRoutes(testData, name => 'testName', service)
    let authCheckRoute = _.find(resultSet, r => !r.isAuthReturnURL)
    expect(authCheckRoute).toBeTruthy()
    authCheckRoute.beforeEnter({name: 'to'}, {name: 'from'}, () => nextMockCall())
    expect(handleAuthmockCall.mock.calls.length).toBe(0)
    expect(loginMockCall.mock.calls.length).toBe(1)
    expect(nextMockCall.mock.calls.length).toBe(0)
  })

  it('it generates an return from auth function', async () => {
    const handleAuthmockCall = jest.fn()
    handleAuthmockCall.mockReturnValueOnce('name')
    const loginMockCall = jest.fn()
    loginMockCall.mockReturnValueOnce('')
    const nextMockCall = jest.fn()

    const service = {
      isAuthenticated () { return false },
      login (nextUrl) { return loginMockCall() },
      handleAuthentication () {
        return new Promise((resolve, reject) => {
          handleAuthmockCall()
          resolve('')
        })
      }
    }
    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]}
    let resultSet = generateRoutes(testData, name => 'testName', service)
    let authCheckRoute = _.find(resultSet, r => r.isAuthReturnURL)
    expect(authCheckRoute).toBeTruthy()
    await authCheckRoute.beforeEnter({name: 'to'}, {name: 'from'}, () => nextMockCall)
    expect(handleAuthmockCall.mock.calls.length).toBe(1)
    expect(loginMockCall.mock.calls.length).toBe(0)
    expect(nextMockCall.mock.calls.length).toBe(0)
  })

  it('it generates an return from auth function fail..', async () => {
    const handleAuthmockCall = jest.fn()
    handleAuthmockCall.mockReturnValueOnce('name')
    const loginMockCall = jest.fn()
    loginMockCall.mockReturnValueOnce('')
    const nextMockCall = jest.fn()

    const service = {
      isAuthenticated () { return false },
      login (nextUrl) { return loginMockCall() },
      handleAuthentication () {
        return new Promise((resolve, reject) => {
          handleAuthmockCall()
          reject(new Error('fail'))
        })
      }
    }

    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]
    }
    let resultSet = generateRoutes(testData, name => 'testName', service)
    let authCheckRoute = _.find(resultSet, r => r.isAuthReturnURL)
    expect(authCheckRoute).toBeTruthy()
    await authCheckRoute.beforeEnter({name: 'to'}, {name: 'from'}, () => nextMockCall())
    expect(handleAuthmockCall.mock.calls.length).toBe(1)
    expect(loginMockCall.mock.calls.length).toBe(0)
    expect(nextMockCall.mock.calls.length).toBe(1)
  })
})

describe('router generator functionaity', () => {
  it('it generates a router model', () => {
    const handleAuthmockCall = jest.fn()
    handleAuthmockCall.mockReturnValueOnce('ChooseCaptainsPage')
    const loginMockCall = jest.fn()
    loginMockCall.mockReturnValueOnce('')

    const service = {
      isAuthenticated () { return false },
      login (nextUrl) { return loginMockCall() },
      handleAuthentication () {
        return new Promise((resolve, reject) => {
          handleAuthmockCall()
          resolve('ChooseCaptainsPage')
        })
      }
    }
    const testData = {
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'ChooseCaptainsPage',
          component: ChooseCaptainsPage
        },
        {
          path: '/membersEditor',
          name: 'MembersEditorPage',
          component: MembersEditorPage,
          isAuthReturnURL: true
        }]}
    let resultSet = generateRouter(testData, service)
    expect(resultSet.getMatchedComponents('/')[0].name).toEqual('choose-captains-page')
    resultSet.push({name: 'MembersEditorPage'})
  })
})
