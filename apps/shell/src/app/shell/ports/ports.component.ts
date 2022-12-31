import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enumerable, foreach  } from 'powerseq/enumerable';
import { PortsService } from './ports.service'; 
import { ShellToastService } from '../toasts/shell-toast.service';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PortsService],
  selector: 'decentralized-plc-ports',
  template: `
    <div class="mb-6">
      <label class="btn modal-button" for="my-modal" (click)="showModal()">Dodaj port</label>
    </div>
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
                  <!-- <div class="text-sm opacity-50">United States</div> -->
                </div>
              </div>
            </td>
            <td>
              {{ portsList[portName].port }}
              <!-- <br>
              <span class="badge badge-ghost badge-sm">Desktop Support Technician</span> -->
            </td>
            <td>{{ portsList[portName].value ?? '-' }}</td>
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

  constructor(private portsService: PortsService, private toastService: ShellToastService) {}

  ngOnInit(): void {
    this.getPorts();
    this.portsService.getPortsValues().subscribe((portsValue: { portName: string, value: any}[]) => {
      Enumerable.from(portsValue).foreach((v) => this.portsList[v.portName].value = v.value);
    })
  }

  getPorts() {
    this.portsService.getPorts((ports => this.portsList = ports));
  }

  getPortsName() {
    return Object.keys(this.portsList);
  }

  addPort() {
    this.portsService.addPort(this.portName, this.port);
    this.getPorts();
    this.portName = undefined;
    this.port = undefined;
    this.modal = false;
  }

  deletePort(portName: string) {
    this.portsService.deletePort(portName);
    this.getPorts();
  }

  forceValue(portName: string, index: number) {
    this.portsService.forceValue(this.portNewValues, portName, index);
    delete this.portNewValues[index];
  }

  showModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }
}
