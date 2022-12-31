import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceService {

  constructor(private socket: Socket) { }
  
  getDevice(cb: (res: ConfigDeviceDto) => void): void {
    this.socket.emit('device:get', (device: ConfigDeviceDto) => { return cb(device) });
  }

  addDevice(name: string, host: string, rack: number, slot: number, updateRate: number): void {
    this.socket.emit('device:create', name, host, rack, slot, updateRate, (d: string | null) => console.log(d));
  }

  deleteDevice(): void {
    this.socket.emit('device:delete', (d: any) => console.log(d));
  }

  deviceError(): Observable<any> {
    return this.socket.fromEvent('device:error');
  }

  deviceConnect(): Observable<any> {
    return this.socket.fromEvent('device:connect');
  }
}