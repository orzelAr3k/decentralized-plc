import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShellToastService } from './shell-toast.service';

@Component({
    selector: 'shell-toast',
    template: `
      <div class="alert alert-success shadow-lg" 
        (mouseenter)="stopTimeout()"
        (mouseleave)="countDown()"
        [@openClose]="toastService.data && toastService.data.show ? 'open' : 'closed'"
      >
        <div class="block" *ngIf="toastService.data">
          <div class="flex align-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="text-xl">{{ toastService.data.title }}</span>
          </div>
          <div class="block px-4">
            <div [innerHtml]="toastService.data.content"></div>
          </div>
        </div>
      </div>
    `,
    animations: [
      trigger('openClose', [
        state(
          'closed',
          style({
            visibility: 'hidden',
            right: '-400px',
          })
        ),
        state(
          'open',
          style({
            right: '40px',
          })
        ),
        transition('open <=> closed', [animate('0.5s ease-in-out')]),
      ]),
    ],
})

export class ShellToastComponent implements OnInit {
  @ViewChild('element', { static: false }) progressBar: ElementRef;
  progressTimeout;

  constructor(public toastService: ShellToastService) {
    this.toastService.open.subscribe((data) => {
      if (data.show) {
        this.countDown();
      }
    });
  }

  ngOnInit() {}

  countDown() {
    this.progressTimeout = setTimeout(() => {
      this.toastService.hide();
      clearTimeout(this.progressTimeout);
      return;
    }, 4000);
  }

  stopTimeout() {
    clearTimeout(this.progressTimeout);
  }
}