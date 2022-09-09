import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'shell-devices',
  template: `
   <div class='container h-92v flex'>
    <div class="m-auto">
      <button class="btn btn-wide" *ngIf="!device" (click)="addDevice()">Dodaj urządzenie</button>

      <div class="hero" *ngIf="device">
        <div class="hero-content flex-col lg:flex-row">
          <img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">Box Office News!</h1>
            <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

    </div>
   </div>
  `,
})
export class DevicesComponent implements OnInit {
  device = false;

  constructor(private socket: Socket) {
    this.socket.emit('device:delete', (res: string) => console.log(res));
  }

  ngOnInit(): void {}

  addDevice() {
    this.device = !this.device;
  }
}
