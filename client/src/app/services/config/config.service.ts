import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IConfig from 'src/models/IConfig';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: BehaviorSubject<IConfig> = new BehaviorSubject<IConfig>({
    baseApiEndpoint: "",
    socketEndpoint: "",
  });

  constructor(private http: HttpClient) {}

  loadConfig() {
    const configUrl = isDevMode()
      ? '/assets/local.config.json'
      : '/assets/config.json';

    return this.http.get(configUrl)
      .toPromise()
      .then(data => {
        this.config.next(data as IConfig);
      });
  }
}
