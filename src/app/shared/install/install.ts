import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class InstallService {
  #deferredPrompt?: any;

  canInstall = signal(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.#deferredPrompt = e;
      this.canInstall.set(true);
    });
  }

  promptToInstall(): void {
    if (!this.#deferredPrompt) {
      return;
    }

    this.#deferredPrompt.prompt();

    this.#deferredPrompt.userChoice.then(() => {
      this.#deferredPrompt = null;
      this.canInstall.set(false);
    });
  }

  public isSafari() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
  }
}