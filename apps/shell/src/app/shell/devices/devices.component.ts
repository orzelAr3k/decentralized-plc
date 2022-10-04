import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'shell-devices',
  template: `
   <div class='container h-92v flex'>
    <div class="m-auto">
      <div *ngIf="empty" (click)="showModal()"><label class="btn modal-button" for="my-modal">Dodaj urządzenie</label></div>

      <div class="hero" *ngIf="!empty">
        <div class="hero-content flex-col lg:flex-row">
          <img src="../../../assets/plc.png" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">{{ device.name }}</h1>
            <p class="py-6">Host: {{ device.host }}</p>
            <p class="py-6" *ngIf="connect$ | async; let connect">Connect: {{ connect }}</p>
            <p></p>
            <button class="btn btn-primary" (click)="deleteDevice()">Usuń urządzenie</button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
  <span *ngIf="error$ | async; let error">{{ error | json }}</span>



  <!-- modal -->
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal" *ngIf="modal">
    <div class="modal-box relative">
      <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
      <h3 class="text-lg font-bold">Dodaj urządzenie</h3>
      <form #deviceForm="ngForm" class="rounded-lg p-10 bg-slate-800">
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Nazwa urządzenia *</span>
          </label>
          <input
            type="text"
            placeholder="Nazwa"
            class="input input-bordered"
            name="deviceName"
            [(ngModel)]="device.name"
            required
          />
        </div>
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Adres urządzenia *</span>
          </label>
          <input
            type="text"
            placeholder="Adres urządzenia"
            class="input input-bordered"
            name="host"
            [(ngModel)]="device.host"
            required
          />
        </div>
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Rack urządzenia *</span>
          </label>
          <input
            type="number"
            placeholder="Rack"
            class="input input-bordered"
            name="rack"
            [(ngModel)]="device.rack"
            required
          />
        </div>
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Slot urządzenia *</span>
          </label>
          <input
            type="number"
            placeholder="Slot"
            class="input input-bordered"
            name="slot"
            [(ngModel)]="device.slot"
            required
          />
        </div>
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Częstotliwość odświeżania *</span>
          </label>
          <input
            type="number"
            placeholder="Częstotliwość odświeżania *"
            class="input input-bordered"
            name="updateRate"
            [(ngModel)]="device.updateRate"
            required
          />
        </div>
        <div class="form-control">
          <button class="btn btn-primary" [disabled]="!deviceForm.valid" (click)="addDevice()">
            <label for="my-modal">Dodaj</label>
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
})
export class DevicesComponent implements OnInit {
  device: ConfigDeviceDto = {
    _id: '',
    host: '',
    rack: null,
    slot: null,
    name: '',
    ports: [],
    updateRate: null
  };
  empty = true;
  modal = false;
  error$ = this.socket.fromEvent('device:error');
  connect$ = this.socket.fromEvent('device:connect');

  constructor(private socket: Socket) { }

  ngOnInit(): void { 
    this.getDevice();
  }

  getDevice() {
    this.socket.emit('device:get', (device: ConfigDeviceDto) => {
      if (device) {
        this.device = device
        this.empty = false;
      }
    });

  }

  addDevice() {
    this.modal = false;
    this.socket.emit('device:create', this.device.name, this.device.host, this.device.rack, this.device.slot, this.device.updateRate, (d: string | null) => console.log(d));
    this.empty = false;
  }

  deleteDevice() {
    this.socket.emit('device:delete', (d: any) => console.log(d));
    this.device = {} as ConfigDeviceDto;
    this.empty = true;
  }

  showModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }
}
