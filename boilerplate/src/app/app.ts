import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameCanvas } from './components/game-canvas/game-canvas';
import { GameState } from './services/game-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GameCanvas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('boilerplate');
  public gameState = inject(GameState);

  // Create helper getters so your HTML stays clean
  get balance() { return this.gameState.balance; }

  addTable() {
    this.gameState.addTable(); // Mapping your UI button to your service logic
  }
}
