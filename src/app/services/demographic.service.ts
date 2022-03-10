import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';

import { DemographicInfo} from '../interfaces/demographicInfo.interface';

@Injectable({
  providedIn: 'root'
})
export class DemoGraphicService {


  constructor(private http: HttpClient) {
  }

  demoGraphicGetAll() {
    return this.http.get<DemographicInfo[]>(Constants.ApiUrl + '/api/DemoGraphic/Get');
  }


  demoGraphicGetById(id: number) {
    return this.http.get<DemographicInfo>(Constants.ApiUrl +'/api/DemoGraphic/GetById?id=' + id);
  }

  demoGraphicDelete(id: number) {
    return this.http.delete<boolean>(Constants.ApiUrl +'/api/DemoGraphic/Delete?id=' + id);
  }


  demoGraphicCreateUpdate(demographicInfo: DemographicInfo) {
    return this.http.post<boolean>(Constants.ApiUrl +'/api/DemoGraphic/CreateUpdate',
      JSON.stringify(demographicInfo),
      {
        'headers': { 'content-type': 'application/json' }
      }
    );
  }

}
