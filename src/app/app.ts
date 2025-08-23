import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './shared/network/network';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{ title() }}!</h1>
    @if (network.isOffline()) {
      <span>🚫 Offline</span>
    }

    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('pwa-tutorial');
  protected readonly network = inject(NetworkService);
}
