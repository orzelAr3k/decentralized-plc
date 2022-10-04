import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'decentralized-plc-network',
  template: `
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
            <th>Adres IP</th>
            <th>Favorite Color</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <ng-container *ngFor="let device of devices">
            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <td>
                <div class="flex items-center space-x-3">
                  <!-- <div class="avatar">
                    <div class="mask mask-squircle w-12 h-12">
                      <img src="/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div> -->
                  <div>
                    <div class="font-bold">{{ device }}</div>
                    <div class="text-sm opacity-50">United States</div>
                  </div>
                </div>
              </td>
              <td>
                Zemlak, Daniel and Leannon
                <br>
                <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
              </td>
              <td>Purple</td>
              <th>
                <button class="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
            <tr *ngIf="">

            </tr>
          </ng-container>
        </tbody>
        <!-- foot -->
        <tfoot>
          <tr>
            <th></th>
            <th>Nazwa</th>
            <th>Adres IP</th>
            <th>Favorite Color</th>
            <th></th>
          </tr>
        </tfoot>
        
      </table>
    </div>
  `,
})
export class NetworkComponent implements OnInit {
  devices = [];
  expand;
  selectedDevice;
  
  constructor(private socket: Socket) {}

  async ngOnInit() {
    // this.socket.emit('generateCertificate', '63374c8bc2cafd8e52e0420e', 1000, (certificate) => console.log(certificate));
    this.socket.emit('allDevices:get', (devices) => this.devices = devices);
    console.log(this.devices);
  }
}
