import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendDataService {
  modelDataUrl: string = 'https://python-backend.ajapro.com/model-data';
  fetchDataUrl: string = 'https://python-backend.ajapro.com/fetch-data';
  valuesPostUrl: any = 'https://python-backend.ajapro.com/feed-data';

  constructor(private httpClient: HttpClient) {}

  // model data
  getModelData(): any {
    return this.httpClient.get(this.modelDataUrl);
  }

  // fetch data
  getRegionCityYear(): any {
    return this.httpClient.get(this.fetchDataUrl);
  }
  getChartValues(region: any, city: string, year: any) {
    return this.httpClient.request('POST', this.valuesPostUrl, {
      params: { city, region, year },
    });
  }

  
}
