import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
})
export class NgGunModule {
  static forRoot(): ModuleWithProviders<NgGunModule> {
    return {
      ngModule: NgGunModule,
      providers: []
    }
  }
}
