<template>
  <div>
    <div>Members List</div>
     <MembershipTable></MembershipTable>
    <button v-on:click="addNewMember()">Add Member</button>
  </div>
</template>

<script>
   import MembershipTable from '@/components/MembershipTable'
   import { mapMutations } from 'vuex'

   export default {
     name: 'PlayerEditorPage',
     components: {
       MembershipTable
     },
     methods: {
       ...mapMutations(['addMember']),
       addNewMember: function () {
         this.addMember()
         this.$validator.validateAll()
       }

     }
   }
</script>

<style scoped>

</style>
