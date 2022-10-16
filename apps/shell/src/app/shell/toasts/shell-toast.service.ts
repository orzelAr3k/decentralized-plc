import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShellToastService {
    constructor() { }

    data: ToastData;
    public open = new Subject<ToastData>();
  
    initiate(data: ToastData) {
      if (data.type) {
        this.data.type = toastTypes.error;
      }
      this.data = { ...data, show: true };
      this.open.next(this.data);
    }
  
    hide() {
      this.data = { ...this.data, show: false };
      this.open.next(this.data);
    }
    
}