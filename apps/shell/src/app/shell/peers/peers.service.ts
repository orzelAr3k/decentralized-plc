import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class PeersService {
  constructor(private socket: Socket) { }

  getPeers(cb: (res: { _id: string, host: string }[]) => void): void {
    this.socket.emit('getPeers', (peers) => cb(peers));
  }

  addPeers(host: string) {
    this.socket.emit('addPeers', host, p => console.log(p));
  }

  deletePeers(host: string) {
    this.socket.emit('deletePeers', host, p => console.log(p));
  }
  
}