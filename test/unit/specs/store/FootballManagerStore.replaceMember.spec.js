import {sampleFootballStore as testSubject} from '@/store/FootballManagerStore.js'
import _ from 'lodash'

describe('mutator replaceMember functionality', () => {
  it('should replace item in list ', () => {
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
    testSubject.mutations.replaceMember(testState, {
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
    expect(testState.members).toHaveLength(2)
    expect(_.find(testState.members, p => p.id === 99)).toEqual({
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
  })

  it('should replace item in list ', () => {
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
    testSubject.mutations.replaceMember(testState, {
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
    expect(testState.members).toHaveLength(2)
    expect(_.find(testState.members, p => p.id === 99)).toEqual({
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
  })

  it('should do nothing if player not in list ', () => {
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
    testSubject.mutations.replaceMember(testState, {
      id: 100,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
    expect(testState.members).toHaveLength(2)
    expect(testState.members).toEqual([
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
      }])
  })

  it('should do nothing on an empty list', () => {
    let testState = {
      members: []
    }
    testSubject.mutations.replaceMember(testState, {
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: true,
      isReservePlayer: false
    })
    expect(testState.members).toEqual([])
  })
})
