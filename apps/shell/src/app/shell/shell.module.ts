import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellRoutingModule } from './shell-routing.module';
import { FormsModule } from '@angular/forms';

import { ShellComponent } from './shell.component';

import { ShellToastComponent } from './toasts/shell-toast.component';
import { ShellToastService } from './toasts/shell-toast.service';

@NgModule({
  imports: [CommonModule, FormsModule, ShellRoutingModule],
  exports: [],
  declarations: [
    ShellComponent,
    ShellToastComponent,
  ],
  providers: [ShellToastService],
})
export class ShellModule {}
