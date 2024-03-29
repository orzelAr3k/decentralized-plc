import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NgGunService } from '@decentralized-plc/ng-gun';

@Component({
  selector: 'shell-page',
  template: `
    <shell-toast class="fixed bottom-10 right-10 z-10"></shell-toast>
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
          <div class="flex">
            <label class="swap swap-rotate">
              <!-- this hidden checkbox controls the state -->
              <input type="checkbox" [checked]="!themeDark" (change)="themeToggle()"/>
              <!-- sun icon -->
              <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
              <!-- moon icon -->
              <svg class="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
            </label>
          </div>
          <div class="flex-none hidden lg:block">
            <ul class="menu menu-horizontal rounded-box p-2">
              <!-- Navbar menu content here -->
              <li><a routerLink="devices" routerLinkActive="active">Urządzenie</a></li>
              <li><a routerLink="ports" routerLinkActive="active">Porty</a></li>
              <li><a routerLink="network" routerLinkActive="active">Sieć</a></li>
              <li><a routerLink="peers" routerLinkActive="active">Peers</a></li>
              <li><a routerLink="charts" routerLinkActive="active">Wizualizacja</a></li>
            </ul>
            <button class="btn" (click)="logout()">Wyloguj</button>
          </div>
        </div>
        <!-- Page content here -->
        <div class="flex">
          <div class="container m-auto mt-10">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div> 
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label> 
        <ul class="menu p-4 overflow-y-auto w-80 h-full bg-base-100">
          <!-- Sidebar content here -->
          <li><a routerLink="devices" routerLinkActive="active">Urządzenie</a></li>
          <li><a routerLink="ports" routerLinkActive="active">Porty</a></li>          
          <li><a routerLink="network" routerLinkActive="active">Sieć</a></li>
          <li><a routerLink="peers" routerLinkActive="active">Peers</a></li>
          <li><a routerLink="charts" routerLinkActive="active">Wizualizacja</a></li>
          <li class="justify-self-end mt-auto"><button class="btn" (click)="logout()">Wyloguj</button></li>
        </ul>
      </div>
    </div>
  `,
})
export class ShellComponent implements OnInit {
  themeDark;

  constructor(private router: Router, private ngGun: NgGunService, @Inject(DOCUMENT) public document: Document) {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      this.themeDark = theme === 'night';
    } else {
      document.documentElement.setAttribute("data-theme", 'night');
      this.themeDark = true;
    }
  }

  ngOnInit(): void { }

  logout() {
    this.ngGun.user.leave();
    this.router.navigate(['/login']);
  }

  themeToggle() {
    this.themeDark = !this.themeDark;
    if (document.documentElement.getAttribute("data-theme") === 'night') {
      document.documentElement.setAttribute("data-theme", 'cmyk');
      localStorage.setItem('theme', 'cmyk');
    }
    else if(document.documentElement.getAttribute("data-theme") === 'cmyk') {
      document.documentElement.setAttribute("data-theme", 'night');
      localStorage.setItem('theme', 'night');
    }
  }
}
