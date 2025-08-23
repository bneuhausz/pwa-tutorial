import { isPlatformBrowser } from "@angular/common";
import { computed, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #isOnline = signal(this.#isBrowser ? navigator.onLine : true);

  readonly isOffline = computed(() => !this.#isOnline());

  constructor() {
    if (this.#isBrowser) {
      window.addEventListener('online', () => this.#isOnline.set(true));
      window.addEventListener('offline', () => this.#isOnline.set(false));
    }
  }
}