import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgGunService } from '@decentralized-plc/ng-gun';

@Component({
  selector: 'signin-page',
  template: `
    <div class="relative bg-fixed bg-cover">
      <video
        autoplay
        muted
        loop
        id="myVideo"
        class="fixed w-screen h-screen object-cover"
      >
        <source
          src="http://videos.ctfassets.net/xit7f234flxz/vWgyEvbf4sULsQJPaIKqf/a32fcfbefb146832045cb338f9b210b0/earth.webm"
          type="video/mp4"
        />
        Your browser does not support HTML5 video.
      </video>
    </div>
    <div class="relative hero min-h-screen">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="flex-shrink-0 w-full text-center lg:text-left ml-16">
          <h1 class="text-5xl font-bold text-white">Załóż konto!</h1>
          <p class="py-6 text-white">
            Zdecentralizowana brama dla urządzeń IOT
          </p>
        </div>
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Login</span>
              </label>
              <input
                type="text"
                placeholder="Login"
                class="input input-bordered"
                [(ngModel)]="name"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Hasło</span>
              </label>
              <input
                type="password"
                placeholder="Hasło"
                class="input input-bordered"
                [(ngModel)]="password"
                (keydown.enter)="signin()"
              />
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary" (click)="signin()">
                Załóż konto
              </button>
            </div>
            <label class="label">
              <span class="label-text-alt">Masz już konto?</span>
              <a routerLink="/login" class="link link-hover">Zaloguj się</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SigninComponent implements OnInit {
  name = '';
  password = '';

  constructor(private ngGun: NgGunService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.ngGun.user.is);
  }

  signin() {
    console.log(this.name);
    console.log(this.password);

    try {
      this.ngGun.user.create(this.name, this.password, () =>
        this.router.navigate(['/login'])
      );
    } catch (err) {
      console.log(err);
    }
  }
}
