import {sampleFootballStore as testSubject} from '@/store/FootballManagerStore.js'
import _ from 'lodash'

describe('mutator addMember functionality', () => {
  it('should add an item in state with members ', () => {
    let testState = {
      members: [
        {
          id: 1,
          name: 'Andy Darlow',
          email: 'darlowandy@gmail.com',
          isPaidMember: true,
          isReservePlayer: false
        },
        {
          id: 99,
          name: 'Paul Naylor',
          email: 'wibble@gmail.com',
          isPaidMember: false,
          isReservePlayer: true
        }]}
    testSubject.mutations.addMember(testState)
    expect(testState.members).toHaveLength(3)
    expect(testState.members[2].id).toBe(100)
  })

  it('should add a player to an empty list members ', () => {
    let testState = {
      members: []
    }
    testSubject.mutations.addMember(testState)
    expect(testState.members).toHaveLength(1)
    expect(testState.members[0]).toEqual({'email': '', 'id': 1, 'isPaidMember': false, 'isReservePlayer': true, 'name': ''})
  })

  it('should add an item in state with 1 members ', () => {
    let testState = {
      members: [
        {
          id: 1,
          name: 'Paul Naylor',
          email: 'wibble@gmail.com',
          isPaidMember: false,
          isReservePlayer: true
        }]}
    testSubject.mutations.addMember(testState)
    expect(testState.members).toHaveLength(2)
    expect(testState.members[0].id).toBe(1)
    expect(testState.members[1].id).toBe(2)
    expect(testState.members[1]).toEqual({'email': '', 'id': 2, 'isPaidMember': false, 'isReservePlayer': true, 'name': ''})
  })
})
