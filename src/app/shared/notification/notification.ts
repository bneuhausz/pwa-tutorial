import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  subscribe(sub: PushSubscription) {
    return this.http.post(`${environment.apiUrl}/subscribe`, sub);
  }

  notify() {
    return this.http.post(`${environment.apiUrl}/notify`, null);
  }
}
