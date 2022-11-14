
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ShellComponent } from './shell.component';
import { DevicesComponent } from './devices/devices.component';
import { NetworkComponent } from './network/network.component';
import { PortsComponent } from './ports/ports.component';
import { PeersComponent } from './peers/peers.component';
import { ChartsComponent } from './charts/charts.component';


const routes: Routes = [
  { path: '', redirectTo: 'devices', pathMatch: 'full'},
  { path: '', component: ShellComponent, children: 
    [
      { path: 'devices', component: DevicesComponent },
      { path: 'ports', component: PortsComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'peers', component: PeersComponent },
      { path: 'charts', component: ChartsComponent }
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }