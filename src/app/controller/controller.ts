import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Board } from '../board/board';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [Board, FormsModule, CommonModule],
  templateUrl: './controller.html'
})
export class Controller {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeSlide = signal(0);
  rows = signal(5);
  cols = signal(10);
  interval = signal(8000);
  messageQueue = signal<string[]>(['HI THERE\n\nTHIS IS A\nDIGITAL\nSPLIT FLAP', 'EDIT USING\nTHE BELOW\nCONTROLS', 'SHARE YOUR\nMESSAGE\nSEQUENCE\nUSING THE\nLINK SHARE']);
  wasCopied = signal(false);
  isMinimized = signal(true);
  activeControl = signal<'none' | 'dim' | 'timing'>('none');

  currentLines = computed(() => {
    const raw = this.messageQueue()[this.activeSlide()] || '';
    const lines = raw.split('\n');
    return Array.from({ length: this.rows() }, (_, i) => lines[i] || '');
  });

  constructor() {
    this.loadFromUrl();
    effect(() => {
      const data = { r: this.rows(), c: this.cols(), t: this.interval(), m: this.messageQueue() };
      const encoded = btoa(JSON.stringify(data));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { p: encoded },
        replaceUrl: true
      });
    });
  }

  updateRow(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value.toUpperCase();

    const lines = [...this.currentLines()];
    lines[index] = val;

    this.messageQueue.update(mq => {
      const newQueue = [...mq];
      newQueue[this.activeSlide()] = lines.join('\n');
      return newQueue;
    });
  }

  onInput(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    // Auto-advance only if typing (not deleting) and we hit the limit
    if (event.inputType !== 'deleteContentBackward' && input.value.length >= this.cols()) {
      const next = document.getElementById(`row-${index + 1}`);
      next?.focus();
    }
  }

  onKeydown(index: number, event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Enter') {
      event.preventDefault();
      const next = document.getElementById(`row-${index + 1}`);
      next?.focus();
    }

    if (event.key === 'Backspace' && target.selectionStart === 0 && index > 0) {
      event.preventDefault();
      const prev = document.getElementById(`row-${index - 1}`) as HTMLInputElement;
      if (prev) {
        prev.focus();
        // Put cursor at the end of the previous line
        const len = prev.value.length;
        prev.setSelectionRange(len, len);
      }
    }
  }

  // ui controls 

  toggleControl(type: 'dim' | 'timing') {
    this.activeControl.update(current => current === type ? 'none' : type);
  }

  toggleMinimize() { this.isMinimized.update(v => !v); }

  copyShareLink() {
    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => this.showSuccess()).catch(() => this.copyFallback(url));
    } else { this.copyFallback(url); }
  }

  // deprecated copy solution for picky phones as a fallback
  private copyFallback(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); this.showSuccess(); } catch (err) { }
    document.body.removeChild(textArea);
  }

  private showSuccess() {
    this.wasCopied.set(true);
    setTimeout(() => this.wasCopied.set(false), 2000);
  }

  private loadFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get('p');
    if (encoded) {
      try {
        const decoded = atob(decodeURIComponent(encoded));
        const data = JSON.parse(decoded);
        if (data.r) this.rows.set(data.r);
        if (data.c) this.cols.set(data.c);
        if (data.t) this.interval.set(data.t);
        if (data.m) this.messageQueue.set(data.m);
      } catch (e) { }
    }
  }

  updateInterval(delta: number) {
    this.interval.update(v => Math.max(2000, v + delta));
  }

  updateDim(type: 'r' | 'c', delta: number) {
    if (type === 'c') {
      const newCols = Math.max(1, this.cols() + delta);
      this.messageQueue.update(messages => messages.map(msg =>
        msg.split('\n').map(line => line.substring(0, newCols)).join('\n')
      ));
      this.cols.set(newCols);
    }
    if (type === 'r') {
      const newRows = Math.max(1, this.rows() + delta);
      this.rows.set(newRows);
    }
  }

  addMessage() {
    this.messageQueue.update(q => [...q, '']);
    this.activeSlide.set(this.messageQueue().length - 1);
  }

  removeMessage(index: number) {
    this.messageQueue.update(q => q.filter((_, i) => i !== index));
    this.activeSlide.set(Math.max(0, this.activeSlide() - 1));
  }
}