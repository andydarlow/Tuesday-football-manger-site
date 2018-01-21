<template>
    <div id="match-configuration-page">
       <div id="match-title">
        <span id="match-day">Match : {{matchDate()}}</span>
        <button id="cancel-game">Cancel Game</button>
      </div>

      <div class="section"><h2>Playing</h2></div>
      <Draggable  class="dragArea" v-model="playingPlayer":options="{group:'members'}">
        <div v-for="player in playingPlayer">
          <span class="playerName">{{player.name}}</span>
        </div>

      </Draggable>
      <div class="section"><h2>Not Playing</h2></div>
      <Draggable class="dragArea" v-model="NotPlayingPlayer":options="{group:'members'}">
        <div v-for="player in NotPlayingPlayer">
          <span class="playerName">{{player.name}}</span>
        </div>
      </Draggable>
      <div class="section"><h2>Not Responded</h2></div>
      <Draggable class="dragArea" v-model="NotRespondedPlayer":options="{group:'members'}">
        <div v-for="player in NotRespondedPlayer">
          <span class="playerName">{{player.name}}</span>
        </div>
      </Draggable>
      <div class="next-step">
        <router-link to="ChooseCaptainsPage" tag="button">Choose Captains</router-link>
      </div>
    </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import Moment from 'moment'
  export default {
    name: 'match-configuration-page',
    data () {
      return {
        playingPlayer: [
          {
            name: 'harry'
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
        ],
        NotPlayingPlayer: [
          {
            name: 'wilfred'
          },
          {
            name: 'herbert'
          }
        ],
        NotRespondedPlayer: [
          {
            name: 'josh'
          },
          {
            name: 'james'
          }
        ]
      }
    },
    components: {
      Draggable
    },
    methods: {
      matchDate: function () {
        return Moment().format('dddd DD MMM YYYY')
      }
    }
  }
</script>




<style scoped>
  .playerName {
    border-style: solid;
    border-width: 1px;
    width: 100px;
    display:block;
  }
.section {
  text-align: left;
}
  .dragArea {
    min-height: 10px;
  }
</style>
