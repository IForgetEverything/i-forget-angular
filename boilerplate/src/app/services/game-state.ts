import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  balance = signal(500);
  // We use this to tell Pixi to spawn an object
  pendingTableRequest = signal<number>(0); 

  addTable() {
    if (this.balance() >= 100) {
      this.balance.update(b => b - 100);
      this.pendingTableRequest.update(n => n + 1);
    }
  }
}
