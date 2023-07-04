import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendDataService {
  modelDataUrl: string = 'https://python-backend.ajapro.com/model-data';
  fetchDataUrl: string = 'https://python-backend.ajapro.com/fetch-data';
  valuesPostUrl: string = 'https://python-backend.ajapro.com/feed-data';

  constructor(private http: HttpClient) {}

  // model data
  getModelData(): any {
    return this.http.get(this.modelDataUrl);
  }

  // fetch data
  getfetchData(): any {
    return this.http.get(this.fetchDataUrl);
  }
  getValuesForRCY(region: any, city: string, year: any) {
    return this.http.request('POST', this.valuesPostUrl, {
      params: { city, region, year },
    });
  }
}
