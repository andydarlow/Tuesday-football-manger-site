import Vue from 'vue'
import Vuex from 'vuex'
import {replaceAll} from '@/utils/ListUtils'
import _ from 'lodash'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const prototypePlayer = {id: 0, name: '', email: '', isPaidMember: false, isReservePlayer: true}

// the model
const footballMamagerStore = {
  state: {
    members: []

  },
  mutations: {
    replaceMember (state, updatedPlayer) {
      state.members = replaceAll(state.members, updatedPlayer, p => p.id === updatedPlayer.id)
    },
    deleteMember (state, playerToDelete) {
      state.members = _.filter(state.members, p => p.id !== playerToDelete.id)
    },
    addMember (state) {
      let newId = _.max(_.concat(_.map(state.members, p => p.id), 0)) + 1
      let newPlayer = _.merge({}, prototypePlayer, {id: newId})
      state.members = _.concat(state.members, newPlayer)
    }
  },
  strict: debug
}

// for testing until code hits the server proper
const sampleMembersData = [
  {
    id: 1,
    name: 'Andy Darlow',
    email: 'darlowandy@gmail.com',
    isPaidMember: true,
    isReservePlayer: false
  },
  {
    id: 2,
    name: 'Paul Naylor',
    email: 'wibble@gmail.com',
    isPaidMember: false,
    isReservePlayer: true
  },
  {
    id: 3,
    name: 'biggles',
    email: 'biggles@gmail.com',
    isPaidMember: false,
    isReservePlayer: true
  }
]
// something with testdata until we have proper service in place
const sampleFootballStore = _.assign({}, footballMamagerStore, {state: { members: sampleMembersData }})
const footballMamagerSingleton = new Vuex.Store(sampleFootballStore)

//  expose footballMamagerStore for unit testing but use the singleton in the code.
export { sampleFootballStore, footballMamagerStore, footballMamagerSingleton as default }
