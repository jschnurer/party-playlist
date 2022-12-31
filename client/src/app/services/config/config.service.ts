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
  });

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  private loadConfig() {
    const configUrl = isDevMode()
      ? '/assets/local.config.json'
      : '/assets/config.json';

    this.http.get(configUrl)
      .subscribe((envResponse: any) => {
        const config: IConfig = { baseApiEndpoint: "" };
        Object.assign(config, envResponse);
        this.config.next(config);
      });
  }
}
