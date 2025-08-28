import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './shared/network/network';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { NotificationService } from './shared/notification/notification';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (isNewVersionReady()) {
      <span>🆕 New version available! Please reload the application.</span>
      <button (click)="reload()">Reload</button>
    }
    <h1>Welcome to {{ title() }}!</h1>
    @if (network.isOffline()) {
      <span>🚫 Offline</span>
    }

    <button (click)="subscribe()">Subscribe to Notifications</button>
    <button (click)="notify()">Send Notification</button>

    <router-outlet />
  `,
})
export class App {
  protected readonly network = inject(NetworkService);
  private readonly swUpdate = inject(SwUpdate);
  private readonly notification = inject(NotificationService);
  private readonly swPush = inject(SwPush);

  protected readonly title = signal('pwa-tutorial');
  protected readonly isNewVersionReady = signal(false);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter(event => event.type === 'VERSION_READY'))
        .subscribe((event: VersionReadyEvent) => {
          this.isNewVersionReady.set(true);
        });
    }
  }

  protected reload() {
    window.location.reload();
  }

  async subscribe() {
    if (this.swPush.isEnabled) {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      });
      this.notification.subscribe(sub).subscribe();
    }
  }

  notify() {
    this.notification.notify().subscribe();
  }
}
