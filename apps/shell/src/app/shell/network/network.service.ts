import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkService {

  constructor(private socket: Socket) { }
  

  getAllDevice(): Observable<Device[]> {
    this.socket.emit('allDevices:get', (devices) => console.log(devices));
    return this.socket.fromEvent<Device[]>('allDevices');
  }

  getPorts(cb: (res: Ports) => void): void {
    return this.socket.emit('ports:get', (ports: Ports) => { return cb(ports) });
  }

  sendToOtherDevice(deviceId: string, portName: string, port: string): void {
    this.socket.emit('sendToOtherDevice', deviceId, portName, port);
  }

  generateCertificate(deviceId: string): void {
    this.socket.emit('generateCertificate', deviceId, null, (certificate) => console.log(certificate));
  }
}