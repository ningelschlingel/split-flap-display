import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Board } from '../board/board';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [Board, FormsModule],
  templateUrl: './controller.html'
})
export class Controller {
  rows = signal(5);
  cols = signal(10);
  interval = signal(8000);
  messageQueue = signal<string[]>(['DIGITAL\nSPLIT\nFLAP', 'BUILD\nYOUR\nOWN', 'HELLO\nWORLD']);

  updateDim(type: 'r' | 'c', change: number) {
    if (type === 'r') this.rows.update(v => Math.max(1, Math.min(10, v + change)));
    else this.cols.update(v => Math.max(1, Math.min(20, v + change)));
    this.messageQueue.set(['']);
  }

  addMessage() {
    this.messageQueue.update(q => [...q, '']);
  }

  removeMessage(index: number) {
    this.messageQueue.update(q => q.filter((_, i) => i !== index));
  }

  validateInput(index: number) {
    const raw = this.messageQueue()[index];
    this.messageQueue()[index] = raw.toUpperCase().replace(/[^A-Z0-9\n ]/g, '');
  }
}