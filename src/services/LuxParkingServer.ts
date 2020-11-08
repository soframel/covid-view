import { CountryCases } from '@/models/countryCases';
import axios, { AxiosResponse } from 'axios';

const serverUrl = process.env.VUE_APP_SERVER_URL;
console.log("loaded server URL=" + serverUrl);

export class LuxParkingServer {

  getTotalCasesPerCountryPer100k(startDate: string, endDate: string): Promise<CountryCases> {
    console.log("fetching country cases for " + startDate + " and " + endDate);
    return new Promise((resolve, reject) => {
      axios.get(serverUrl + "/covid/countryCases?startDate=" + startDate + "&endDate=" + endDate).then((response: AxiosResponse<any>) => {
        if (response.status == 200) {
          resolve(response.data as CountryCases)
        }
        else {
          reject(response.statusText)
        }
      })
      .catch((reason: any) => {
        reject(reason)
      })
    })

  }

}