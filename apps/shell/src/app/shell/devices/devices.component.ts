import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { DeviceService } from './device.service';
import { lastValueFrom } from 'rxjs';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DeviceService],
  selector: 'shell-devices',
  template: `
   <div class='container h-80v flex'>
    <div class="m-auto">
      <label *ngIf="empty" class="btn modal-button" for="my-modal" (click)="showModal()">Dodaj urządzenie</label>
      <div class="hero" *ngIf="!empty">
        <div class="hero-content flex-col lg:flex-row">
          <img src="../../../assets/plc.png" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="mb-6 text-5xl font-bold">{{ device.name }}</h1>
            <p class="my-1">Host: {{ device.host }}</p>
            <p>Odświażanie: {{ device.updateRate }} ms</p>
            <p class="py-3 text-2xl" [ngClass]="{'text-red-800': (connect$ | async) === false, 'text-green-400': (connect$ | async)}">Status: {{ (connect$ | async) ? 'Aktywny' : 'Nieaktywny' }}</p>
            <button class="btn btn-primary mt-6" (click)="deleteDevice()">Usuń urządzenie</button>
          </div>
        </div>
      </div>
      <span *ngIf="error$ | async; let error">{{ error | json }}</span>
    </div>
  </div>

  <!-- modal -->
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal" *ngIf="modal">
    <div class="modal-box relative">
      <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
      <h3 class="text-lg font-bold">Dodaj urządzenie</h3>
      <form #deviceForm="ngForm" class="rounded-lg p-10 bg-base-200">
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
  error$ = this.deviceService.deviceError();
  connect$ = this.deviceService.deviceConnect();

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void { 
    this.deviceService.getDevice((device: ConfigDeviceDto) => {
      if (device) {
        this.device = device
        this.empty = false;
      }
    });
  }

  addDevice() {
    this.modal = false;
    this.deviceService.addDevice(this.device.name, this.device.host, this.device.rack, this.device.slot, this.device.updateRate);
    this.empty = false;
  }

  deleteDevice() {
    this.deviceService.deleteDevice();
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
