import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from './network.service';
import { ShellToastService } from '../toasts/shell-toast.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [NetworkService],
  selector: 'decentralized-plc-network',
  template: `
    <div class="overflow-x-auto w-full">
      <div class="flex p-5 rounded-t-lg bg-base-300 uppercase text-xs font-bold">
        <div class="w-1/4">Id</div>  
        <div class="w-1/4">Nazwa</div>  
        <div class="w-1/4">Adres IP</div>  
        <div class="w-1/4">Odświeżanie</div>  
        <div class="w-4"></div>
      </div>
      <ng-container *ngFor="let device of devices | async; let i = index">
        <div (click)="!(selectedDevice === i) ? selectedDevice = i : selectedDevice = undefined" class="flex p-5 border-t border-base-300 bg-base-100 cursor-pointer">
          <div class="w-1/4">{{ device.id }}</div>
          <div class="w-1/4">{{ device.device.name }}</div>
          <div class="w-1/4">{{ device.device.host }}</div>
          <div class="w-1/4">{{ device.device.updateRate || '-' }}</div>
          <div class="w-4 duration-200" [ngClass]="{'rotate-180': selectedDevice === i}">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
              <path id="XMLID_225_" class="fill-neutral-content" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/>
            </svg>
          </div>
          <!-- <div class="w-3/12"><button class="btn btn-ghost btn-sm" (click)="generateCertificate(device)">Generuj certyfikat</button></div> -->
        </div>
        <div *ngIf="selectedDevice === i" class="w-11/12 m-auto p-4 border-t-2 border-base-300">
          <div class="flex justify-between">
            <div>
              <p class="mb-4 uppercase font-bold">Aktywne porty urządzenia:</p>
              <ul class="list-disc">
                <li *ngFor="let port of valuesOfPorts(device.device.ports)" class="flex gap-4 items-center">
                  <span>{{ port }}</span>
                  <label for="my-modal" class="btn btn-ghost btn-sm" (click)="showModal(port, device.id)">Wysyłaj do portu</label>
                </li>
              </ul>
            </div>
            <button class="btn btn-ghost btn-sm" (click)="generateCertificate(device)">Generuj certyfikat</button>
          </div>
        </div>
      </ng-container>
      <div class="flex p-5 rounded-b-lg bg-base-300 uppercase text-xs font-bold">
        <div class="w-1/4">Id</div>   
        <div class="w-1/4">Nazwa</div>  
        <div class="w-1/4">Adres IP</div>  
        <div class="w-1/4">Odświeżanie</div>
        <div class="w-4"></div>
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
            <select class="select select-bordered select-lg w-full" [(ngModel)]="portToSend" name="portToSend" required>
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
  devices: Observable<Device[]> = this.networkService.getAllDevice();
  expand;
  selectedDevice;

  modal;
  selectedPort;
  portsList: Ports;

  portToSend;
  deviceToSend;
  
  constructor(private networkService: NetworkService, private shellToast: ShellToastService) {}

  async ngOnInit() {
    this.networkService.getPorts((ports: Ports) => this.portsList = ports);
  }

  showModal(port: string, devicePub: string): void {
    this.selectedPort = port;
    this.deviceToSend = devicePub;
    this.modal = true;
  }

  closeModal(): void {
    this.modal = false;
  }

  getPortsName(): string[] {
    return Object.keys(this.portsList);
  }

  valuesOfPorts(portsList): string[] {
    return Object.values(portsList);
  }

  generateCertificate(device): void {
    this.networkService.generateCertificate(device.id);
    this.shellToast.initiate({ title: 'Wygenerowano certyfikat', content: `<p>Nazwa urządzenie: ${device.device.name}</p><p>Host: ${device.device.host}</p><p>Id: ${device.id}</p>`, show: true})
  }

  sendToOtherDevice(): void {
    const [portName, port] = this.portToSend.split('|');
    this.networkService.sendToOtherDevice(this.deviceToSend, portName, port);
  }
}
