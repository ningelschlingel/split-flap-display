import { Component, input, computed, signal, effect } from '@angular/core';
import { Flap } from '../flap/flap';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [Flap],
  templateUrl: './board.html'
})
export class Board {
  rows = input<number>(3);
  cols = input<number>(10);
  messages = input<string[]>([]); // Array of messages to cycle
  interval = input<number>(8000); // Default 8s

  private currentMessageIndex = signal(0);

  rowsArray = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
  colsArray = computed(() => Array.from({ length: this.cols() }, (_, i) => i));

  constructor() {
    effect((onCleanup) => {
      if (this.messages().length <= 1) return;

      const timer = setInterval(() => {
        this.currentMessageIndex.update(i => (i + 1) % this.messages().length);
      }, this.interval());

      onCleanup(() => clearInterval(timer));
    });

    // Reset index if messages change
    effect(() => {
      this.messages();
      this.currentMessageIndex.set(0);
    });
  }

  getCharForPosition(row: number, col: number): string {
    const activeMsg = this.messages()[this.currentMessageIndex()] || '';
    const lines = activeMsg.split('\n');
    return lines[row]?.[col] || ' ';
  }

  waveSpeed = input<number>(60); // ms per step
  calculateDelay(row: number, col: number): number {
    // staircase delay pattern
    return (row + col) * this.waveSpeed();
  }
}