import {sampleFootballStore as testSubject} from '@/store/FootballManagerStore.js'
import _ from 'lodash'

describe('mutator deleteMember functionality', () => {
  it('should delete an item in state ', () => {
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
          id: 2,
          name: 'Paul Naylor',
          email: 'wibble@gmail.com',
          isPaidMember: false,
          isReservePlayer: true
        }]}
    testSubject.mutations.deleteMember(testState, {id: 2, name: 'Paul Naylor', email: 'wibble@gmail.com', isPaidMember: false, isReservePlayer: true})
    expect(testState.members).toHaveLength(1)
    expect(testState.members[0].id).toBe(1)  //  should have removed player with id 2
  })

  it('should do nothing (when deleting a player not in the state)', () => {
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
          id: 2,
          name: 'Paul Naylor',
          email: 'wibble@gmail.com',
          isPaidMember: false,
          isReservePlayer: true
        }]}
    testSubject.mutations.deleteMember(testState, {id: 3, name: 'Jim', email: 'jim@gmail.com', isPaidMember: false, isReservePlayer: true})
    expect(testState.members).toHaveLength(2)
    expect(_.sortBy(_.map(testState.members, p => p.id), ['id'])).toEqual([1, 2])
  })

  it('should deal with empty list of members', () => {
    let testState = {
      members: []
    }
    testSubject.mutations.deleteMember(testState, {id: 3, name: 'Jim', email: 'jim@gmail.com', isPaidMember: false, isReservePlayer: true})
    expect(testState.members).toHaveLength(0)
  })

  it('should empty the list if only one item in the list and it is deleted', () => {
    let testState = {
      members: [
        {
          id: 1,
          name: 'Andy Darlow',
          email: 'darlowandy@gmail.com',
          isReservePlayer: false
        }]}
    testSubject.mutations.deleteMember(testState, { id: 1, name: 'Andy Darlow', email: 'darlowandy@gmail.com', isPaidMember: true, isReservePlayer: false})
    expect(testState.members).toHaveLength(0)
  })
})
