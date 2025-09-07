import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './shared/network/network';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { NotificationService } from './shared/notification/notification';
import { environment } from '../environments/environment';
import { Todos } from "./todos";

interface AppData {
  version: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Todos],
  template: `
    @if (isNewVersionReady()) {
      <span>🆕 Version ({{ newVersion() }}) is available! Please reload the application.</span>
      <button (click)="reload()">Reload</button>
    }
    <h1>Welcome to {{ title() }}!</h1>
    @if (network.isOffline()) {
      <span>🚫 Offline</span>
    }

    <button (click)="subscribe()" [disabled]="isSubscribeDisabled()">Subscribe to Notifications</button>
    <button (click)="notify()" [disabled]="isNotifyDisabled()">Send Notification</button>
    <button (click)="toggleTodos()">Toggle Todos</button>

    @if (showTodos()) {
      <app-todos></app-todos>
    }

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
  protected readonly newVersion = signal('');
  protected readonly isSubscribeDisabled = signal(false);
  protected readonly isNotifyDisabled = signal(false);

  protected readonly showTodos = signal(false);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter(event => event.type === 'VERSION_READY'))
        .subscribe((event: VersionReadyEvent) => {
          this.newVersion.set((event.latestVersion.appData as AppData)?.version ?? '');
          this.isNewVersionReady.set(true);
        });
    }
  }

  protected reload() {
    window.location.reload();
  }

  async subscribe() {
    if (this.swPush.isEnabled) {
      this.isSubscribeDisabled.set(true);
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      });
      this.notification.subscribe(sub).subscribe(
        {
          next: () => {
            alert('Subscribed to notifications');
            this.isSubscribeDisabled.set(false);
          },
          error: err => {
            alert('Could not subscribe to notifications: ' + err);
            this.isSubscribeDisabled.set(false);
          }
        }
      );
    }
  }

  notify() {
    this.notification.notify().subscribe(
      {
        next: () => {
          alert('Notification sent');
          this.isNotifyDisabled.set(false);
        },
        error: err => {
          alert('Could not send notification: ' + err);
          this.isNotifyDisabled.set(false);
        }
      }
    );
  }

  toggleTodos() {
    this.showTodos.set(!this.showTodos());
  }
}
