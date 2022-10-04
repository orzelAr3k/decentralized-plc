import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Enumerable, foreach  } from 'powerseq/enumerable';


@Component({
  selector: 'decentralized-plc-ports',
  template: `
    <nav>
      <button class="btn modal-button" (click)="showModal()"><label  for="my-modal">Dodaj port</label></button>
    </nav>
    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Nazwa</th>
            <th>Port</th>
            <th>Wartość</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody *ngIf="portsList">
          <!-- row 1 -->

            <tr *ngFor="let portName of getPortsName(); let i = index">
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <td>
                <div class="flex items-center space-x-3">
                  <!-- <div class="avatar">
                    <div class="mask mask-squircle w-12 h-12">
                    </div>
                  </div> -->
                  <div>
                    <div class="font-bold">{{ portName }}</div>
                    <div class="text-sm opacity-50">United States</div>
                  </div>
                </div>
              </td>
              <td>
                {{ portsList[portName].port }}
                <br>
                <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
              </td>
              <td>{{ portsList[portName].value }}</td>
              <td>
                <div class="flex content-between gap-4">
                  <input type="text" placeholder="Nowa wartość" class="input input-bordered input-sm w-full max-w-xs" [(ngModel)]="portNewValues[i]" (keydown.enter)="forceValue(portName, i)">
                  <button class="btn btn-sm btn-outline" (click)="forceValue(portName, i)">Prześlij</button>
                </div>
              </td>
              <th>
                <button class="btn btn-ghost btn-sm" (click)="deletePort(portName)">Usuń</button>
              </th>
            </tr>

        </tbody>
        <!-- foot -->
        <tfoot>
          <tr>
            <th></th>
            <th>Nazwa</th>
            <th>Port</th>
            <th>Wartość</th>
            <th></th>
            <th></th>
          </tr>
        </tfoot>
        
      </table>
    </div>

    <!-- modal -->
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal" *ngIf="modal">
    <div class="modal-box relative">
      <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
      <h3 class="text-lg font-bold">Dodaj port</h3>
      <form #deviceForm="ngForm" class="rounded-lg p-10">
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Nazwa portu *</span>
          </label>
          <input
            type="text"
            placeholder="Nazwa"
            class="input input-bordered"
            name="deviceName"
            [(ngModel)]="portName"
            required
          />
        </div>
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Adres portu *</span>
          </label>
          <input
            type="text"
            placeholder="Adres urządzenia"
            class="input input-bordered"
            name="host"
            [(ngModel)]="port"
            required
          />
        </div>
        <div class="form-control">
          <button class="btn btn-primary" [disabled]="!deviceForm.valid" (click)="addPort()">
            <label for="my-modal">Dodaj</label>
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
})
export class PortsComponent implements OnInit {
  portsList: { [key: string]: { port: string, value: any } };

  portName: string | undefined;
  port: string | undefined;
  portNewValues: any = {};

  modal = false;

  error;

  constructor(private socket: Socket) {}

  ngOnInit(): void {
    this.getPorts();
    this.socket.fromEvent('device:readValue').subscribe((portsValue: { portName: string, value: any}[]) => {
      Enumerable.from(portsValue).foreach((v) => this.portsList[v.portName].value = v.value);
    })
  }

  getPorts() {
    this.socket.emit('ports:get', (ports: any) => { this.portsList = ports });
  }

  getPortsName() {
    return Object.keys(this.portsList);
  }

  addPort() {
    this.socket.emit('device:addPorts', this.portName, this.port, p => console.log(p));
    this.getPorts();
    this.portName = undefined;
    this.port = undefined;
    this.modal = false;
  }

  deletePort(portName: string) {
    this.socket.emit('device:deletePorts', portName, p => console.log(p));
    this.getPorts();
  }

  forceValue(portName: string, index: number) {
    this.socket.emit('portValue:put', portName, JSON.parse(this.portNewValues[index]), p => console.log(p));
    delete this.portNewValues[index];
  }

  showModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }
}
