import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class PortsService {

  constructor(private socket: Socket) { }
    
  getPorts(cb: (res: Ports) => void): void {
    this.socket.emit('ports:get', (ports: any) => { return cb(ports) });
  }

  getPortsValues(): Observable<{ portName: string, value: any}[]> {
    return this.socket.fromEvent('device:readValue');
  }

  addPort(portName: string, port: string): void {
    this.socket.emit('device:addPorts', portName, port, ports => console.log(ports));
  }

  deletePort(portName: string): void {
    this.socket.emit('device:deletePorts', portName, ports => console.log(ports));
  }

  forceValue(portNewValues: { [key: number]: any }, portName: string, index: number): void {
    this.socket.emit('portValue:put', portName, JSON.parse(portNewValues[index]), ports => console.log(ports));
  }
}