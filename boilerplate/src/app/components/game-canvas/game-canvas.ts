import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, effect, inject } from '@angular/core';
import { GameState } from '../../services/game-state';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-game-canvas',
  standalone: true,
  template: `<div #gameContainer></div>`,
  styles: [`div { width: 100%; height: 100%; }`]
})
export class GameCanvas implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  private app!: PIXI.Application;
  private gameState = inject(GameState); // Inject the bridge
  private isReady = false; // Add a flag

  constructor(private ngZone: NgZone) {
    // This effect runs every time the signal in the service changes
    effect(() => {
      const requestCount = this.gameState.pendingTableRequest();
      console.log('Effect triggered, pendingTableRequest:', requestCount);
      if (requestCount > 0 && this.app && this.isReady) {
        this.ngZone.runOutsideAngular(() => this.spawnTable());
      }
    });
  }

  async ngOnInit() {
    await this.ngZone.runOutsideAngular(async () => {
      this.app = new PIXI.Application();
      await this.app.init({
        background: '#ADD8E6',
        resizeTo: this.gameContainer.nativeElement
      });
      this.gameContainer.nativeElement.appendChild(this.app.canvas);

      // 1. Register the asset with a simple name 'table'
      PIXI.Assets.add({ alias: 'table', src: 'assets/test.jpg' });

      // 2. Pre-load it so it's in the Cache immediately
      await PIXI.Assets.load('table');

      this.isReady = true;

      if (this.gameState.pendingTableRequest() > 0) {
        this.spawnTable();
      }

    });
  }

  private spawnTable() {
    // Logic to add a new table sprite to the stage
    const table = PIXI.Sprite.from('assets/test.jpg');
    table.x = Math.random() * 100; // Offset so they don't stack perfectly
    table.y = Math.random() * 100;
    table.scale.set(0.5); // Scale down the image
    this.app.stage.addChild(table);
  }

  ngOnDestroy() {
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true });
    }
  }
}