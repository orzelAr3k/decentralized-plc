import { Injectable } from '@angular/core';
import Gun from 'gun';
import Sea from 'gun/sea';

@Injectable({
  providedIn: 'root'
})
export class NgGunService {
  gun = Gun();
  sea = Sea;
  user = this.gun.user();

  constructor() { }
}
