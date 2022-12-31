import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class ChartsService {
  constructor(private socket: Socket) { }

  getDevice(cb: (res: ConfigDeviceDto) => void): void {
    this.socket.emit('device:get', (device: ConfigDeviceDto) => { return cb(device) });
  }

  getPorts(cb: (res: Ports) => void): void {
    return this.socket.emit('ports:get', (ports: Ports) => { return cb(ports) });
  }

  getPortsValues(): Observable<{ portName: string, value: any}[]> {
    return this.socket.fromEvent('device:readValue');
  }
}