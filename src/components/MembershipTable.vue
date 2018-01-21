<template>
    <table id="members-list">
      <tr>
        <th class="header" v-for="title in headers">{{title}}</th>
      </tr>
      <tr class="contents" v-for="member in members" :key="member.id">
          <td><EditableTextField :text="member.name"
                                 :onUpdatedText="updateMemberName"
                                 :objectId="member.id"
                                  fieldName="Name"
                                 :validator='{required: true}'></EditableTextField></td>
         <td><EditableTextField  :text="member.email"
                                 :onUpdatedText="updateMemberEmail"
                                 :objectId="member.id"
                                  fieldName="email"
                                 :validator='{required: true, email: true, }'></EditableTextField></td>
          <td> <input id="paid-member"
                      type="checkbox"
                      class="editorCheckbox"
                      :checked="member.isPaidMember"
                      v-on:change="updatePaidMembershipStatus(member.id, $event.target.checked)"></td>
          <td> <input id="reserve-member"
                      type="checkbox"
                      class="editorCheckbox"
                      :checked="member.isReservePlayer"
                      v-on:change="updateReserveMembershipStatus(member.id, $event.target.checked)"></input></td>
          <td><button class="deleteAction" v-on:click='deleteAMember(member.id)'>Delete Member</button></td>
      </tr>
    </table>
</template>

<script>
    import EditableTextField from '@/components/EditableTextfield'
    import { mapMutations } from 'vuex'
    import _ from 'lodash'

    export default {
      name: 'editable-table',
      data () {
        return {
          headers: ['Player Name', 'Email Address', 'Paid Member', 'Reserve Player', 'Action']
        }
      },
      computed: {
        members () {
          return this.$store.state.members
        }
      },
      components: {
        EditableTextField: EditableTextField
      },
      methods: {
        ...mapMutations(['replaceMember', 'deleteMember', 'addMember']),
        updateAttributes: function (object, replacementAttribute) {
          return _.merge({}, object, replacementAttribute)
        },
        findMember: function (playerId) {
          return _.find(this.$store.state.members, {'id': playerId})
        },
        updateMemberName: function (playerId, newName) {
          this.replaceMember(this.updateAttributes(this.findMember(playerId), {name: newName}))
        },
        updateMemberEmail: function (playerId, newEmail) {
          this.replaceMember(this.updateAttributes(this.findMember(playerId), {email: newEmail}))
        },
        confirmDeletion: function () {
          return this.$dialog.confirm('Do you really want to delete this Member?')
        },
        deleteAMember: function (playerId) {
          this.confirmDeletion().then(() =>
            this.deleteMember(this.updateAttributes(this.findMember(playerId)))
          ).catch(() => {})  // cancelled. Do nothing...
        },
        updatePaidMembershipStatus: function (playerId, isPaidMember) {
          this.replaceMember(this.updateAttributes(this.findMember(playerId), { isPaidMember: isPaidMember, isReservePlayer: !isPaidMember }))
        },
        updateReserveMembershipStatus: function (playerId, isReserveMember) {
          this.updatePaidMembershipStatus(playerId, !isReserveMember)
        }
      }
    }
</script>

<style scoped>
  #member-list {
    border-collapse: collapse;
  }

  #member-list, td, th {
    border: 1px solid black;
  }
</style>
