import MembershipTable from '@/components/MembershipTable'
import { mount } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import {footballMamagerStore} from '@/store/FootballManagerStore.js'
import _ from 'lodash'
import VeeValidate from 'vee-validate'
import flushPromises from 'flush-promises'
import VuejsDialog from 'vuejs-dialog'
import {firstOrDefault} from '@/utils/ListUtils.js'
// useful utils..

//  TODO move to VueTestutils
const asList = wrapperList => _.map(wrapperList, (e, i, list) => list.at(i))

// useful functions for getting info about the table

const headerText = headerCell => headerCell.element.textContent
const tableTitles = table => _.map(asList(table.findAll('th')), headerText)
const tableRows = table => asList(table.findAll('tr.contents'))

//  TODO move to VueTestutils
// converts html into a model of that table's content
// e.g to  [{"Action": "Delete Member", "Email Address": "joe@gmail.com", "Paid Member": true, "Player Name": "joe", "Reserve Player": false}]
function parseHtmlTable (htmlTable, parserList) {
  const componentForParser = (component, parser) => parser.unknownField ? {exists: () => false} : component.find('.' + parser.className)
  const parsersFor = (htmlComponent, parserList) => _.filter(parserList, p => componentForParser(htmlComponent, p).exists())
  const defaultParser = parserList => _.find(parserList, p => p.unknownField)
  const findParser = (htmlComponent, parserList) => firstOrDefault(parsersFor(htmlComponent, parserList), defaultParser(parserList))

  const renderCell = (cell, parserList) => findParser(cell, parserList).parser(componentForParser(cell, findParser(cell, parserList)))
  const parseRow = (row, parserList) => _.map(asList(row.findAll('td')), cell => renderCell(cell, parserList))

  return _.map(tableRows(htmlTable), row => _.zipObject(tableTitles(htmlTable), parseRow(row, parserList)))
}

const parseEditField = htmlWrapper => htmlWrapper.element.textContent
const parseCheckBoxField = htmlWrapper => htmlWrapper.element.checked
const parsers = [
  { className: 'editorField', parser: parseEditField },
  { className: 'editorCheckbox', parser: parseCheckBoxField },
  { className: 'deleteAction', parser: parseEditField },
  { unknownField: true, parser: () => 'unknown' }

]
const parseTable = wrapper => parseHtmlTable(wrapper.find('table'), parsers)

function createDeletableTable (membersData) {
  let storeData = _.assign({}, footballMamagerStore, {
    state: {
      members: membersData
    }
  })
  let store = new Vuex.Store(storeData)
  return mount(MembershipTable, {
    store: store,
    methods: {
      confirmDeletion: function () {
        return Promise.resolve('')  // simulate clicking ok for delete
      }
    }
  })
}

describe('tests for MembershipTable', () => {
  beforeEach(() => {
    Vue.use(Vuex)
    Vue.use(VeeValidate)
    Vue.use(VuejsDialog)
  })

  it('should render the model', () => {
    let testCase = createDeletableTable(
      [{
        id: 99,
        name: 'joe',
        email: 'joe@gmail.com',
        isPaidMember: true,
        isReservePlayer: false
      }, {
        id: 1,
        name: 'andy',
        email: 'andy@gmail.com',
        isPaidMember: false,
        isReservePlayer: true
      }]
    )
    expect(parseTable(testCase)).toEqual(
      [ { 'Player Name': 'joe',
        'Email Address': 'joe@gmail.com',
        'Paid Member': true,
        'Reserve Player': false,
        Action: 'Delete Member' },
      { 'Player Name': 'andy',
        'Email Address': 'andy@gmail.com',
        'Paid Member': false,
        'Reserve Player': true,
        Action: 'Delete Member' } ]
    )
  })

  it('should delete row on pressing delete AND confirming', async () => {
    let testCase = createDeletableTable(
      [{
        id: 99,
        name: 'joe',
        email: 'joe@gmail.com',
        isPaidMember: true,
        isReservePlayer: false
      }, {
        id: 1,
        name: 'andy',
        email: 'andy@gmail.com',
        isPaidMember: false,
        isReservePlayer: true
      }]
    )
    let secondRowDelete = tableRows(testCase)[1].find('.deleteAction')
    secondRowDelete.trigger('click')
    await flushPromises()

    expect(parseHtmlTable(testCase.find('table'), parsers)).toEqual(
      [{
        'Player Name': 'joe',
        'Email Address': 'joe@gmail.com',
        'Paid Member': true,
        'Reserve Player': false,
        Action: 'Delete Member'
      }])
  })

  it('should delete row on pressing delete AND confirming', async () => {
    let storeData = _.assign({}, footballMamagerStore, {
      state: {
        members: [{
          id: 99,
          name: 'joe',
          email: 'joe@gmail.com',
          isPaidMember: true,
          isReservePlayer: false
        }, {
          id: 1,
          name: 'andy',
          email: 'andy@gmail.com',
          isPaidMember: false,
          isReservePlayer: true
        }]
      }
    })
    let store = new Vuex.Store(storeData)
    let testCase = mount(MembershipTable, {
      store: store,
      methods: {
        confirmDeletion: function () {
          return new Promise((resolve, reject) => {
            reject('pressed cancel')
          })
        }
      }
    })
    let secondRowDelete = tableRows(testCase)[1].find('.deleteAction')
    secondRowDelete.trigger('click')
    await flushPromises()

    expect(parseTable(testCase)).toEqual(
      [ { 'Player Name': 'joe',
        'Email Address': 'joe@gmail.com',
        'Paid Member': true,
        'Reserve Player': false,
        Action: 'Delete Member' },
      { 'Player Name': 'andy',
        'Email Address': 'andy@gmail.com',
        'Paid Member': false,
        'Reserve Player': true,
        Action: 'Delete Member' } ]
    )
  })

  it('should delete all rows', async () => {
    let testCase = createDeletableTable(
      [{
        id: 99,
        name: 'joe',
        email: 'joe@gmail.com',
        isPaidMember: true,
        isReservePlayer: false
      }, {
        id: 1,
        name: 'andy',
        email: 'andy@gmail.com',
        isPaidMember: false,
        isReservePlayer: true
      }]
    )
    let rowDelete = tableRows(testCase)[0].find('.deleteAction')
    rowDelete.trigger('click')
    await flushPromises()

    rowDelete = tableRows(testCase)[0].find('.deleteAction')
    rowDelete.trigger('click')
    await flushPromises()

    expect(parseHtmlTable(testCase.find('table'), parsers)).toEqual([])
  })

  it('change Paid Membership', async () => {
    let testCase = createDeletableTable([{
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: false,
      isReservePlayer: true
    }, {
      id: 12,
      name: 'andy',
      email: 'andy@gmail.com',
      isPaidMember: true,
      isReservePlayer: false }])
    tableRows(testCase)[1].find('#paid-member').trigger('change')
    await flushPromises()
    expect(parseHtmlTable(testCase.find('table'), parsers)).toEqual(
      [{Action: 'Delete Member',
        'Email Address': 'joe@gmail.com',
        'Paid Member': false,
        'Player Name': 'joe',
        'Reserve Player': true},
      { Action: 'Delete Member',
        'Email Address': 'andy@gmail.com',
        'Paid Member': true,
        'Player Name': 'andy',
        'Reserve Player': false}]
    )
  })

  it('change reserve Membership', () => {
    let testCase = createDeletableTable([{
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: false,
      isReservePlayer: true
    }, {
      id: 12,
      name: 'andy',
      email: 'andy@gmail.com',
      isPaidMember: true,
      isReservePlayer: false }])
    tableRows(testCase)[1].find('#reserve-member').trigger('change')
    // jest and flush promises doesn't work that great when loads of tests run in parrallel. So use next tick instead
    testCase.vm.$nextTick(() => {
      expect(parseHtmlTable(testCase.find('table'), parsers)).toEqual(
        [{Action: 'Delete Member',
          'Email Address': 'joe@gmail.com',
          'Paid Member': false,
          'Player Name': 'joe',
          'Reserve Player': true},
        { Action: 'Delete Member',
          'Email Address': 'andy@gmail.com',
          'Paid Member': true,
          'Player Name': 'andy',
          'Reserve Player': false}]
    )
    })
  })

  it('updates names on edit', async () => {
    Vue.use(VeeValidate)
    let testCase = createDeletableTable([{
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: false,
      isReservePlayer: true
    }])
    let nameEditField = tableRows(testCase)[0].findAll('.texeditor-view').at(0)
    nameEditField.trigger('click')
    await testCase.vm.$nextTick()
    let editor = tableRows(testCase)[0].find('.textfield-editor')
    editor.element.value = 'newName'
    editor.trigger('input')
    await testCase.vm.$validator.validateAll()
    await testCase.vm.$nextTick()
    editor.trigger('keyup.enter')
    await testCase.vm.$nextTick()
    let model = testCase.vm.$store.state
    expect(model.members[0].name).toBe('newName')
    expect(model.members[0].email).toBe('joe@gmail.com')
    expect(model.members[0].isPaidMember).toBe(false)
    expect(model.members[0].isReservePlayer).toBe(true)
  })

  it('change email address', async () => {
    Vue.use(VeeValidate)
    let testCase = createDeletableTable([{
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: false,
      isReservePlayer: true
    }])
    let nameEditField = tableRows(testCase)[0].findAll('.texeditor-view').at(1)
    nameEditField.trigger('click')
    await testCase.vm.$nextTick()
    let editor = tableRows(testCase)[0].find('.textfield-editor')
    editor.element.value = 'andy@gmail.com'
    editor.trigger('input')
    await testCase.vm.$validator.validateAll()
    await testCase.vm.$nextTick()
    editor.trigger('keyup.enter')
    await testCase.vm.$nextTick()
    let model = testCase.vm.$store.state
    expect(model.members[0].name).toBe('joe')
    expect(model.members[0].email).toBe('andy@gmail.com')
    expect(model.members[0].isPaidMember).toBe(false)
    expect(model.members[0].isReservePlayer).toBe(true)
  })

  it('confirmDeletion method exists', async () => {
    let testCase = createDeletableTable([{
      id: 99,
      name: 'joe',
      email: 'joe@gmail.com',
      isPaidMember: false,
      isReservePlayer: true
    }])
    let results = testCase.vm.confirmDeletion()
    expect(results.toString()).toBe('[object Promise]')
  })
})
