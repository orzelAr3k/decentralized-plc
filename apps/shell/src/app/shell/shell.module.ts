import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellRoutingModule } from './shell-routing.module';
import { FormsModule } from '@angular/forms';

import { ShellComponent } from './shell.component';
import { DevicesComponent } from './devices/devices.component';
import { NetworkComponent } from './network/network.component';
import { CertificateModalComponent } from './network/certificateModal.component';
import { PortsComponent } from './ports/ports.component';

@NgModule({
  imports: [CommonModule, FormsModule, ShellRoutingModule],
  exports: [],
  declarations: [
    ShellComponent,
    DevicesComponent,
    NetworkComponent,
    CertificateModalComponent,
    PortsComponent,
  ],
  providers: [],
})
export class ShellModule {}
