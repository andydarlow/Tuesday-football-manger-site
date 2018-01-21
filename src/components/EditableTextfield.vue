<template>
  <span>
     <input type="text"
            class="textfield-editor"
            v-if="isEdited"
            :placeholder="lastSuccessEdit"
            v-on:keyup.enter="editComplete"
            v-on:keyup.esc="cancelEdit"
            v-model="editedValue"
            v-on:blur="cancelEdit"
            v-validate="validator"
            :data-vv-as="fieldName"
            name="editField"
            ref="editorField"/>
     <span v-show="isEdited && errors.has('editField')" class="help is-danger">{{ errors.first('editField') }}</span>
     <span v-if="!isEdited"
           class="texeditor-view editorField"
           v-on:click="startEdit" >{{lastSuccessEdit}}</span>
  </span>
</template>

<script>
    import Vue from 'vue'
    export default {
      props: ['text', 'onUpdatedText', 'objectId', 'validator', 'fieldName'],
      data () {
        return {
          lastSuccessEdit: this.text,
          editedValue: '',
          isEdited: false
        }
      },
      name: 'editable-textfield',
      methods: {
        textHasErrors: function () {
          return this.errors.has('editField')
        },
        startEdit: function () {
          this.editedValue = ''
          this.isEdited = true
          Vue.nextTick(() => {
            this.errors.clear()
            this.$validator.validateAll()
            this.$refs.editorField.focus()
          })
        },
        stopEdit: function (updatedValue) {
          this.isEdited = false
          this.lastSuccessEdit = updatedValue
          this.editedValue = ''
        },
        editComplete: function () {
          if (this.textHasErrors()) return
          this.stopEdit(this.editedValue)
          this.onUpdatedText(this.objectId, this.lastSuccessEdit)
        },
        cancelEdit: function () {
          if (this.isStringEmpty(this.text) && this.textHasErrors()) return // force something to be edited if this is a new field
          this.stopEdit(this.lastSuccessEdit)
        },
        isStringEmpty: function (testSubject) {
          return testSubject.length === 0
        }
      },
      created: function () {
        // force the user to enter something if the fields are blank to start with
        if (this.isStringEmpty(this.text)) {
          this.startEdit()
        }
      }
    }
</script>

<style scoped>

</style>
