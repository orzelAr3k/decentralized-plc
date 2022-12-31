import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartDataset, ChartOptions } from 'chart.js';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import { ChartsService } from './charts.service';
import { Enumerable, foreach  } from 'powerseq/enumerable';


Chart.register(StreamingPlugin);

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  providers: [ChartsService],
  selector: 'decentralized-plc-charts',
  template: ` 
    <div class="mb-6">
      <label class="btn modal-button" for="my-modal" (click)="showModal()">Dodaj zmienną</label>
    </div>
    <div class="flex gap-4 items-center placeholder:mb-6">
      <p *ngIf="datasets.length > 0">Dodane zmienne:</p>
      <div *ngFor="let value of datasets" class="badge badge-lg badge-info gap-2">
        <svg (click)="deleteVariable(value)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current cursor-pointer"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        {{ value.label }}
      </div>
    </div>
    <div>
      <canvas *ngIf="datasets.length > 0"
        baseChart
        [type]="'line'"
        [datasets]="datasets"
        [options]="options">
      </canvas>
    </div>

    <!-- modal -->
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal" *ngIf="modal">
      <div class="modal-box relative">
        <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
        <h3 class="text-lg font-bold">Dodaj zmienną</h3>
        <form #chartForm="ngForm" class="rounded-lg p-10">
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">Nazwa portu *</span>
            </label>
            <select class="select select-bordered select-lg w-full" [(ngModel)]="label" name="portToSend" required>
              <option disabled selected>Wybierz port</option>
              <option *ngFor="let portName of getPortsName()">{{ portName + '|' + devicePorts[portName].port }}</option>
            </select>
          </div>
          <div class="form-control mb-6">
            <label class="label cursor-pointer">
              <span class="label-text">Wypełnienie *</span> 
              <input 
                type="checkbox" 
                checked="checked" 
                class="checkbox" 
                name="fill" 
                [(ngModel)]="fill" 
              />
            </label>
          </div>
          <div class="form-control">
            <button class="btn btn-primary" [disabled]="!chartForm.valid" (click)="addVariable()">
              <label for="my-modal">Dodaj</label>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ChartsComponent implements OnInit {
  modal = false;
  fill: boolean;
  label: string;
  devicePorts: Ports;
  device: ConfigDeviceDto = {
      _id: '',
      host: '',
      rack: null,
      slot: null,
      name: '',
      ports: [],
      updateRate: null
  };

  chart;
  public datasets: ChartDataset[] = [];
  public options: ChartOptions;
  
  constructor(private chartsService: ChartsService) {
    this.chartsService.getDevice((device: ConfigDeviceDto) => this.device = device);
    this.chartsService.getPorts((ports: Ports) => this.devicePorts = ports);
  }

  ngOnInit(): void {
    this.chartsService.getPortsValues().subscribe((portsValue: { portName: string, value: any}[]) => {
      Enumerable.from(portsValue).foreach((v) => this.devicePorts[v.portName].value = v.value);
    })
    this.options = {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            delay: 1,
            onRefresh: (chart: Chart) => {
              chart.data.datasets.forEach((dataset: ChartDataset) => {
                dataset.data.push({
                  x: Date.now(),
                  y: this.devicePorts[dataset.label]?.value
                });
              });
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Wartość'
          }
        }
      }
    };
  }

  getPortsName(): string[] {
    return Object.keys(this.devicePorts);
  }

  valuesOfPorts(devicePorts): string[] {
    return Object.values(devicePorts);
  }

  clearForm() {
    this.label = undefined;
    this.fill = undefined;
  }

  addVariable() {
    const [portName, port] = this.label.split('|');
    const R = Math.random() * 255;
    const G = Math.random() * 255;
    const B = Math.random() * 255;
    this.datasets.push(<ChartDataset>{
      label: portName,
      fill: this.fill,
      backgroundColor: `rgba(${R}, ${G}, ${B}, 0.5)`,
      borderColor: `rgb(${R}, ${G}, ${B})`,
      // cubicInterpolationMode: 'monotone',
      data: []
    });
    this.ngOnInit();
    this.clearForm();
    this.closeModal();
  }


  deleteVariable(value) {
    this.datasets = this.datasets.filter(v => v.label !== value.label)
  }

  showModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }

}
