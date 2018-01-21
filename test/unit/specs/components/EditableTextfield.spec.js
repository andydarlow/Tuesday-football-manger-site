import EditableTextField from '@/components/EditableTextfield'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { mount } from 'vue-test-utils'

describe('EditableTextField UnitTests', () => {
  beforeAll(() => {
    Vue.use(VeeValidate)
  })

  it('starts in display mode if there is text', () => {
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'andy', onUpdatedText: p => {}, objectId: 1, validator: {required: false}, fieldName: 'test'}
    })
    let readOnlySection = wrapper.findAll('.texeditor-view')
    expect(readOnlySection.isEmpty()).toBe(false)
    expect(readOnlySection.contains('span')).toBe(true)
  })

  it('starts edit mode if empty text property', () => {
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: '', onUpdatedText: p => console.log(p), objectId: 1, validator: {required: false}, fieldName: 'testField'}
    })
    let editor = wrapper.find('input')
    expect(editor.exists()).toBe(true)
    expect(editor.attributes().name).toBe('editField')
  })

  it('shows editor on click (when there is text displayed', async () => {
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'sample', onUpdatedText: p => {}, objectId: 1, validator: {required: false}, fieldName: 'testField'}
    })
    expect(wrapper.find('.texeditor-view').exists()) // read to start with
    wrapper.find('.texeditor-view').trigger('click')

    let editor = wrapper.find('input')  // should be in editor mode after click
    expect(editor.exists()).toBe(true)
    expect(editor.attributes().name).toBe('editField')
  })

  it('ESC exits the editor (with data restored)', async () => {
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original text', onUpdatedText: (p, t) => {}, objectId: 1, validator: {required: false}, fieldName: 'testField'}
    })
    expect(wrapper.find('.texeditor-view').text()).toBe('original text')
    wrapper.find('.texeditor-view').trigger('click')
    let editor = wrapper.find('input')
    await wrapper.vm.$validator.validateAll()
    editor.element.value = 'My new value'
    editor.trigger('input')

    editor.trigger('keyup.esc')  // undo edit
    expect(wrapper.find('.texeditor-view').text()).toBe('original text')
  })

  it('should update text with text entered into field (after Enter)', async () => {
    let updatedText = ''
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original text', onUpdatedText: (p, t) => { updatedText = t }, objectId: 1, validator: {required: false}, fieldName: 'testField'}
    })
    expect(wrapper.find('.texeditor-view').text()).toBe('original text')
    wrapper.find('.texeditor-view').trigger('click')
    let editor = wrapper.find('input')

    editor.element.value = 'My new value'
    editor.trigger('input')
    await wrapper.vm.$validator.validateAll()
    editor.trigger('keyup.enter')
    expect(wrapper.find('.texeditor-view').text()).toBe('My new value')
    expect(updatedText).toBe('My new value')
  })

  it('not allowed to exit edit if nothing has been entered', async () => {
    Vue.use(VeeValidate)
    let updatedText = ''
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: '', onUpdatedText: (p, t) => { updatedText = t }, objectId: 1, validator: {required: true, email: true}, fieldName: 'testField'}
    })
    // throws user into edit mode to force data to be added
    let editor = wrapper.find('input')

    // pressing enter without a valid entry should keep you in edit mode...

    wrapper.trigger('keyup.enter')
    await wrapper.vm.$validator.validateAll()
    expect(editor.exists()).toBe(true)

    // double check that the editor is still there and there are no errors
    editor = wrapper.find('input')
    expect(updatedText).toBe('')
    expect(editor.exists()).toBe(true)
    expect(editor.text()).toBe('')
  })

  it('allowed to exit edit if nothing has been entered and no validation', async () => {
    let updatedText = ''
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: '', onUpdatedText: (p, t) => { updatedText = t }, objectId: 1, validator: {required: false}, fieldName: 'testField'}
    })

    // throws user into edit mode to force data to be added
    let editor = wrapper.find('input')
    expect(editor.exists()).toBe(true)

    editor.trigger('keyup.enter')
    wrapper.update()
    await wrapper.vm.$validator.validateAll()
    editor = wrapper.find('input')
    expect(updatedText).toBe('')
    expect(editor.exists()).toBe(false)
    expect(wrapper.find('.texeditor-view').text()).toBe('')
  })

  it('allows you to revert with ESC when there are errors', async () => {
    let updatedTextCalled = false
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original', onUpdatedText: (p, t) => { updatedTextCalled = true }, objectId: 1, validator: {required: false, email: true}, fieldName: 'testField'}
    })

    wrapper.find('.texeditor-view').trigger('click')
    // need to wait for tick....
    let editor = wrapper.find('input')
    editor.element.value = 'notemail'
    editor.trigger('input')

    expect(editor.exists()).toBe(true)
    editor.trigger('keyup.esc')
    wrapper.update()
    await wrapper.vm.$validator.validateAll()
    editor = wrapper.find('input')
    expect(updatedTextCalled).toBe(false)
    expect(editor.exists()).toBe(false)
    expect(wrapper.find('.texeditor-view').text()).toBe('original')
  })

  it('shows validation errors', async () => {
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original', onUpdatedText: (p, t) => { }, objectId: 1, validator: {required: true, email: true}, fieldName: 'testField'}
    })

    wrapper.find('.texeditor-view').trigger('click')
    // need to wait for tick....
    let editor = wrapper.find('input')

    editor.element.value = 'notemail'
    editor.trigger('input')
    await wrapper.vm.$validator.validateAll()
    wrapper.update()
    let errorMsg = wrapper.find('span.is-danger')
    expect(errorMsg.element.textContent).toBe('The testField field must be a valid email.')
  })

  it('wont allow you to enter if validation errors', async () => {
    let updatedTextCalled = false
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original', onUpdatedText: (p, t) => { updatedTextCalled = true }, objectId: 1, validator: {required: false, email: true}, fieldName: 'testField'}
    })

    wrapper.find('.texeditor-view').trigger('click')
    // need to wait for tick....
    let editor = wrapper.find('input')
    editor.element.value = 'notemail'
    editor.trigger('input')

    expect(editor.exists()).toBe(true)
    // this is a cheat  - really simulate for all updates and wait fror them to happen
    await wrapper.vm.$validator.validateAll()
    editor.trigger('keyup.enter')
    wrapper.update()
    editor = wrapper.find('input')
    expect(updatedTextCalled).toBe(false)
    expect(editor.exists()).toBe(true)
  })

  it('allows you to enter if no validation errors', async () => {
    let updatedTextCalled = false
    let wrapper = mount(EditableTextField, {
      propsData:
        {text: 'original', onUpdatedText: (p, t) => { updatedTextCalled = true }, objectId: 1, validator: {required: false, email: true}, fieldName: 'testField'}
    })

    wrapper.find('.texeditor-view').trigger('click')
    // need to wait for tick....
    let editor = wrapper.find('input')
    editor.element.value = 'email@google.com'
    editor.trigger('input')

    expect(editor.exists()).toBe(true)
    // this is a cheat  - really simulate for all updates and wait fror them to happen
    await wrapper.vm.$validator.validateAll()
    editor.trigger('keyup.enter')
    wrapper.update()
    editor = wrapper.find('input')
    expect(wrapper.find('.texeditor-view').text()).toBe('email@google.com')
    expect(updatedTextCalled).toBe(true)
    expect(editor.exists()).toBe(false)
  })
})
