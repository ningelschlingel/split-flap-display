import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Board } from '../board/board';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [Board, FormsModule],
  templateUrl: './controller.html'
})
export class Controller {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeSlide = 0;

  rows = signal(5);
  cols = signal(10);
  interval = signal(8000);
  messageQueue = signal<string[]>(['DIGITAL\nSPLIT\nFLAP', 'BUILD\nYOUR\nOWN', 'HELLO\nWORLD']);

  isMinimized = signal(false);

  toggleMinimize() {
    this.isMinimized.update(v => !v);
  }

  constructor() {
    this.loadFromUrl();

    effect(() => {
      const data = {
        r: this.rows(),
        c: this.cols(),
        m: this.messageQueue()
      };

      // encode for shorter and not-revealing url param
      const encoded = btoa(JSON.stringify(data));

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { p: encoded },
        replaceUrl: true
      });
    });
  }

  private loadFromUrl() {
    // find param
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get('p');

    if (encoded) {
      console.log("FOUND ENCODED:", encoded);
      try {
        // decode config
        const decoded = atob(decodeURIComponent(encoded));
        const data = JSON.parse(decoded);

        if (data.r) this.rows.set(data.r);
        if (data.c) this.cols.set(data.c);
        if (data.m) this.messageQueue.set(data.m);

        console.log("Loaded Messages:", data.m);
      } catch (e) {
        console.error("Failed to parse URL configuration", e);
      }
    } else {
      console.log("NO 'p' PARAMETER FOUND IN URL");
    }
  }

  updateDim(type: 'r' | 'c', change: number) {
    if (type === 'r') this.rows.update(v => Math.max(1, Math.min(10, v + change)));
    else this.cols.update(v => Math.max(1, Math.min(20, v + change)));
  }

  addMessage() {
    this.messageQueue.update(q => [...q, '']);
    this.activeSlide = this.messageQueue().length - 1; // focus the new slide
  }

  removeMessage(index: number) {
    this.messageQueue.update(q => q.filter((_, i) => i !== index));
    this.activeSlide = Math.max(0, this.activeSlide - 1);
  }

  validateInput(index: number) {
    // santize
    const raw = this.messageQueue()[index];
    const sanitized = raw.toUpperCase().replace(/[^A-Z0-9\n ]/g, '');

    // build new array to trigger effect on signal
    this.messageQueue.update(currentArray => {
      const newArray = [...currentArray];
      newArray[index] = sanitized;
      return newArray;
    });
  }

  getFormattedLines() {
    const text = this.messageQueue()[this.activeSlide];
    const lines = text.split('\n');
    const maxRows = this.rows();
    const maxCols = this.cols();

    return lines.map((line, index) => {
      return {
        content: line,
        isRowOverflow: index >= maxRows,
        safe: line.slice(0, maxCols),
        overflow: line.slice(maxCols)
      };
    });
  }
}