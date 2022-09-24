import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgGunService } from '@decentralized-plc/ng-gun';

@Component({
  selector: 'shell-page',
  template: `
    <div class="drawer">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
      <div class="drawer-content flex flex-col">
        <!-- Navbar -->
        <div class="w-full navbar bg-base-300">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-3" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div> 
          <div class="flex-1 px-2 mx-2 text-4xl font-bold trackikng-widest text-white">DIOT</div>
          <div class="flex-none hidden lg:block">
            <ul class="menu menu-horizontal rounded-box p-2">
              <!-- Navbar menu content here -->
              <li><a routerLink="devices" routerLinkActive="active">Urządzenie</a></li>
              <li><a routerLink="ports" routerLinkActive="active">Porty</a></li>
              <li><a routerLink="network" routerLinkActive="active">Sieć</a></li>
            </ul>
            <button class="btn" (click)="logout()">Wyloguj</button>
          </div>
        </div>
        <!-- Page content here -->
        <div class="flex">
          <div class="container m-auto bg-slate-100">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div> 
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label> 
        <ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
          <!-- Sidebar content here -->
          <li><a>Urządzenie</a></li>
          <li><a>Porty</a></li>          
          <li><a>Sieć</a></li>
        </ul>
      </div>
    </div>
  `,
})
export class ShellComponent implements OnInit {
  constructor(private router: Router, private ngGun: NgGunService) {}

  ngOnInit(): void { }

  logout() {
    this.ngGun.user.leave();
    this.router.navigate(['/login']);

  }
}
