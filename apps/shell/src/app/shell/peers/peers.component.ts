import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeersService } from './peers.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PeersService],
  selector: 'decentralized-plc-peers',
  template: `
    <div class="mb-6">
      <label class="btn modal-button" for="my-modal" (click)="showModal()">Dodaj peera</label>
    </div>
    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Lp.</th>
            <th>Id</th>
            <th>Nazwa</th>
            <th></th>
          </tr>
        </thead>
        <tbody *ngIf="peers">
          <tr *ngFor="let peer of peers; let i = index">
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center space-x-3">
                <!-- <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                  </div>
                </div> -->
                <div>
                  <div class="font-bold">{{ i }}</div>
                  <!-- <div class="text-sm opacity-50">United States</div> -->
                </div>
              </div>
            </td>
            <td>
              {{ peer._id }}
            </td>
            <td>
              {{ peer.host }}
            </td>
            <th>
              <button class="btn btn-ghost btn-sm" (click)="deletePeer(peer.host)">Usuń</button>
            </th>
          </tr>
        </tbody>
        <!-- foot -->
        <tfoot>
          <tr>
            <th></th>
            <th>Lp.</th>
            <th>Id</th>
            <th>Nazwa</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- modal -->
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal" *ngIf="modal">
      <div class="modal-box relative">
        <label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="closeModal()">✕</label>
        <h3 class="text-lg font-bold">Dodaj peera</h3>
        <form #deviceForm="ngForm" class="rounded-lg p-10">
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">Adres peera *</span>
            </label>
            <input
              type="text"
              placeholder="Adres"
              class="input input-bordered"
              name="deviceName"
              [(ngModel)]="peerHost"
              required
            />
          </div>
          <div class="form-control">
            <button class="btn btn-primary" [disabled]="!deviceForm.valid" (click)="addPeer()">
              <label for="my-modal">Dodaj</label>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class PeersComponent implements OnInit {
  peers: { _id: string, host: string }[];
  peerHost;

  modal = false;

  constructor(private peersService: PeersService) {}

  ngOnInit(): void {
    this.getPeers();
  }

  getPeers() {
    this.peersService.getPeers((peers: { _id: string, host: string }[]) => this.peers = peers);
  }

  addPeer() {
    this.peersService.addPeers(this.peerHost);
    this.getPeers();
    this.peerHost = undefined;
    this.modal = false;
  }

  deletePeer(host: string) {
    this.peersService.deletePeers(host);
  }

  showModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }
}
