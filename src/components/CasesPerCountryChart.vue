
<script lang="ts">
import Vue from 'vue';
import { Line } from 'vue-chartjs'
import {ChartData, ChartDataSets, ChartOptions} from 'chart.js'
import { LuxParkingServer } from '@/services/LuxParkingServer';
import { CountryCases } from '@/models/countryCases';
import { CountryCase } from '@/models/countryCase';

export default Vue.extend({
  name: 'CasesPerCountryChart',
  extends: Line,
  props: {
    startDate: Date,
    endDate: Date
  },
  watch: {
    startDate: function (date: Date, oldDate: Date) {
      this.showGraph()
    },
    endDate: function (date: Date, oldDate: Date) {
      this.showGraph()
    },
  },
  inject: ['server'],
  data () {
      const result={
        chartData: {
          labels: []   
        } as ChartData,
        templateDataSets: {
          fr: { 
            label: 'France',
            fill: false,
            borderColor: '#04086c',
            backgroundColor: '#04086c',
            borderWidth: 1
          } as ChartDataSets,
          lu: { 
            label: 'Luxembourg',
            fill: false,
            borderColor: '#0a6b00',
            backgroundColor: '#0a6b00',
            borderWidth: 1
          } as ChartDataSets,
          ch: { 
            label: 'Swiss',
            fill: false,
            borderColor: '#ff0000',
            backgroundColor: '#ff0000',
            borderWidth: 1
          } as ChartDataSets,
          default: { 
            label: 'Unknown',
            fill: false,
            borderColor: '#003366',
            backgroundColor: '#003366',
            borderWidth: 1
          } as ChartDataSets
        },
        options: {
          title: {
            display: true,
            text: "Number of Cases Per Country For 100 000 Inhabitants",
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: true
          },          
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1,
          elements: {
            point: {
              radius: 1
            }
          }
        } as ChartOptions
      }

      return result as (typeof result & {server: LuxParkingServer})
    },
    methods: {
      mapDatesToLabels(data: CountryCases): Array<string>{
        return Object.keys(data)
      }, 
      getDefaultTemplateForCountry(country: string): ChartDataSets | undefined{
        let entry: ChartDataSets | undefined=undefined
        switch(country){
                case 'FR': {
                  entry=this.templateDataSets.fr;
                  break
                }
                case 'LU': {
                  entry=this.templateDataSets.lu;
                  break
                }
                case 'CH': {
                  entry=this.templateDataSets.ch;
                  break
                }
                default: {
                  //entry=this.templateDataSets.default
                  return undefined
                }
              }              
              entry.label=country;
              return entry;
      },
      mapCountryCasesToChartDataSets(data: CountryCases): ChartDataSets[]{        
        const map=new Map<string, ChartDataSets>()     

        const values=Object.values(data)
        const allCountries=values.flat().map(v => v.country).filter(c => (c!=null) && c!="")
        const countries=[...new Set(allCountries)];

        for (const date of Object.keys(data)){
          const countriesData: CountryCase[]=data[date]
          //console.info(date+": processing data")

          const processedCountries=new Array<string>()
          for(const c of countriesData){
            let entry: ChartDataSets | undefined=undefined
            processedCountries.push(c.country)
            if(map.has(c.country)){
              entry=map.get(c.country)
              if(entry && entry.data){
                entry.data.push(c.totalCasesPer100kInhabitants)
              }              
            }
            else{
              entry=this.getDefaultTemplateForCountry(c.country)              
              if(entry){
                entry.data=[c.totalCasesPer100kInhabitants]
                map.set(c.country, entry)
              }
            }
          }

          //if one country is missing for a date, add empty value!          
          if(processedCountries.length < countries.length){
            //console.log("processed "+processedCountries.length+" countries, on "+countries.length)
            //find the missing ones
            const missing=countries.filter(c => !processedCountries.includes(c))
            missing.forEach((country: string) => {
              console.warn(date+": data for "+country+" was missing")
              if(map.has(country)){
                const entry=map.get(country)
                if(entry && entry.data){
                  entry.data.push()
                }              
              }
              else{
                const entry=this.getDefaultTemplateForCountry(country)   
                if(entry){
                  entry.data=[null]
                  map.set(country, entry)
                }
              }
            })
          }
        }
        return Array.from(map.values())
      },
      showGraph(){
        this.server.getTotalCasesPerCountryPer100k(this.$props.startDate.toISOString(), this.$props.endDate.toISOString()).then((data: CountryCases) => {          
          this.chartData.labels=this.mapDatesToLabels(data);
          this.chartData.datasets=this.mapCountryCasesToChartDataSets(data);        
          (this as any).renderChart(this.chartData, this.options)
      });
    },
    },    
    mounted () {
      this.showGraph();
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
