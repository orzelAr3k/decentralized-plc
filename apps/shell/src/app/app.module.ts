import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Socket.io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// GunDB
import { NgGunModule } from '@decentralized-plc/ng-gun';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

import { ShellToastService } from './shell/toasts/shell-toast.service';

// const config: SocketIoConfig = { url: 'https://' + document.location.host, options: { transports: ['websocket'], upgrade: true} };
const config: SocketIoConfig = { url: 'http://localhost:3000', options: { } };
@NgModule({
  declarations: [AppComponent, LoginComponent, SigninComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NgGunModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [ShellToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
