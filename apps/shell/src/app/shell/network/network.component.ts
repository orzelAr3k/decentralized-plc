import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'decentralized-plc-network',
  template: `
    <div class="overflow-x-auto w-full">
      <div class="flex p-5 rounded-t-lg bg-base-300 uppercase text-xs font-bold">
        <div class="w-3/12">Nazwa</div>  
        <div class="w-3/12">Adres IP</div>  
        <div class="w-3/12">Odświeżanie</div>  
        <div class="w-3/12"></div>  
      </div>
      <ng-container *ngFor="let device of devices | async; let i = index">
        <div (click)="!(selectedDevice === i) ? selectedDevice = i : selectedDevice = undefined" class="flex p-5 border-t border-base-300 bg-base-100">
          <div class="w-3/12">{{ device.device.name }}</div>
          <div class="w-3/12">{{ device.device.host }}</div>
          <div class="w-3/12">{{ device.device.updateRate || '-' }}</div>
          <div class="w-3/12"><button class="btn btn-ghost btn-sm">Generuj certyfikat</button></div>
        </div>
        <div *ngIf="selectedDevice === i" class="w-11/12 m-auto p-4 border-t-2 border-base-300">
          <div>
            <p class="mb-4 uppercase font-bold">Aktywne porty urządzenia:</p>
            <ul>
              <li *ngFor="let port of valuesOfPorts(device.device.ports)" class="flex gap-4 items-center">
                <span>{{ port }}</span>
                <label for="my-modal" class="btn btn-ghost btn-sm" (click)="showModal(port, device.id)">Wysyłaj do portu</label>
              </li>
            </ul>
          </div>
        </div>
      </ng-container>
      <div class="flex p-5 rounded-b-lg bg-base-300 uppercase text-xs font-bold">
        <div class="w-3/12">Nazwa</div>  
        <div class="w-3/12">Adres IP</div>  
        <div class="w-3/12">Odświeżanie</div>
        <div class="w-3/12"></div>   
      </div>
    </div>


      <!-- modal -->
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal" *ngIf="modal">
      <div class="modal-box relative">
        <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
        <h3 class="text-lg font-bold">Wysyłaj do portu {{ selectedPort }}</h3>
        <form #deviceForm="ngForm" class="rounded-lg p-10">
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">Nazwa portu *</span>
            </label>
            <select class="select select-bordered select-lg w-full" [(ngModel)]="portToSend" name="portToSend">
              <option disabled selected>Wybierz port</option>
              <option *ngFor="let portName of getPortsName()">{{ portName + '|' + portsList[portName].port }}</option>
            </select>
          </div>
          <div class="form-control">
            <button class="btn btn-primary" [disabled]="!deviceForm.valid" (click)="sendToOtherDevice()">
              <label for="my-modal">Wysyłaj</label>
            </button>
          </div>
        </form>
      </div>
    </div>


  `,
})
export class NetworkComponent implements OnInit {
  devices = this.socket.fromEvent<any[]>('allDevices');
  expand;
  selectedDevice;


  modal;
  selectedPort;
  // portName;
  portsList;


  portToSend;
  deviceToSend;
  
  constructor(private socket: Socket) {}

  async ngOnInit() {
    // this.socket.emit('generateCertificate', '633de1a416b6065074d59d7e', 60*60*24*1000, (certificate) => console.log(certificate));
    this.socket.emit('allDevices:get', (devices) => console.log(devices));
  }

  valuesOfPorts(portsList): string[] {
    return Object.values(portsList);
  }

  showModal(port: string, devicePub: string) {
    this.selectedPort = port;
    this.deviceToSend = devicePub;
    this.getPorts();
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }

  getPorts() {
    this.socket.emit('ports:get', (ports: any) => { this.portsList = ports });
  }

  getPortsName() {
    return Object.keys(this.portsList);
  }

  sendToOtherDevice() {
    const [portName, port] = this.portToSend.split('|');
    this.socket.emit('sendToOtherDevice', this.deviceToSend, portName, port);
  }
}
