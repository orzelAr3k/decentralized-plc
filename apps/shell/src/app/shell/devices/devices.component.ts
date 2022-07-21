import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'shell-devices',
  template: ` <p>devices works!</p> `,
})
export class DevicesComponent implements OnInit {
  constructor(private socket: Socket) {
    this.socket.emit('message', 'test');
  }

  ngOnInit(): void {}
}
