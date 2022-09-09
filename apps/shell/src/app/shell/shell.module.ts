import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellRoutingModule } from './shell-routing.module';

import { ShellComponent } from './shell.component';
import { DevicesComponent } from './devices/devices.component';
import { NetworkComponent } from './network/network.component';

@NgModule({
  imports: [CommonModule, ShellRoutingModule],
  exports: [],
  declarations: [ShellComponent, DevicesComponent, NetworkComponent],
  providers: [],
})
export class ShellModule {}
