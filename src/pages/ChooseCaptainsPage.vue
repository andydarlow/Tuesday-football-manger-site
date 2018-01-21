<template>
    <div>
      Choose Captains Page
      <table>
        <tr>
          <th>Player</th>
          <th>Captain?</th>
        </tr>
        <tr v-for="player in playingPlayer">
          <td>{{player.name}}</td>
          <td><input type="checkbox"></td>
        </tr>
      </table>
      <div class="next-step">
        <router-link to="MatchConfigurationPage" tag="button">Back To Choose Team</router-link>
        <router-link to="" tag="button">Finialise Teams</router-link>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'choose-captains-page',
      data () {
        return {
          playingPlayer: [
            {
              name: 'components'
            },
            {
              name: 'andy'
            },
            {
              name: 'jim'
            },
            {
              name: 'Paul'
            },
            {
              name: 'john'
            }
          ]
        }
      }
    }
</script>

<style scoped>

</style>
