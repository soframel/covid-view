<template>
  <div id="casesPerCountry">
<p class="chartOptions">
    <span class="label">From:</span>
    <datepicker class="option" v-model="startDate" name="startDate"></datepicker> 
    <span class="label">To:</span>
    <datepicker class="option" v-model="endDate" name="endDate"></datepicker>    
</p>
  <div class="chartContainer">
      <CasesPerCountryChart ref="chart" v-bind:startDate="startDate" v-bind:endDate="endDate" :styles="{height: '80vh', width: '80vw', position: 'relative'}" />
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import CasesPerCountryChart from './CasesPerCountryChart.vue';

export default Vue.extend({
  name: 'CasesPerCountry',
  components: {
    Datepicker,
    CasesPerCountryChart
  },
  data () {
    return {
    startDate: new Date(2020,2,1),
    endDate: new Date()
    }
  },

});
</script>

<style scoped lang="scss">
.chartOptions{
  display: flex
}
.label{
  margin: 5px;
}
.option{
margin: 5px;
}

.chartContainer{
  position: relative;
  margin: auto;
  height: 80vh;
  width: 80vw;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
