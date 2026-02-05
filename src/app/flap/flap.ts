import { Component, input, signal, effect, computed } from '@angular/core';

@Component({
  selector: 'app-flap',
  standalone: true,
  templateUrl: './flap.html'
})
export class Flap {
  target = input<string>(' ');
  chars = input<string[]>(' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''));

  delay = input<number>(0);

  currentIndex = signal(0);
  isFlipping = signal(false);
  isHovered = signal(false);
  pendingRotation = signal('rotateX(0deg)');

  currentChar = computed(() => this.chars()[this.currentIndex()]);
  nextChar = computed(() => this.chars()[(this.currentIndex() + 1) % this.chars().length]);

  // flap engine settings
  private readonly MAX_SPEED = 60;  // ms
  private readonly START_SPEED = 200; // ms
  public currentSpeed = signal(300);
  private flipCount = 0;

  constructor() {

    effect(() => {
      const target = this.target();
      // coordinated delay from the board + a tiny random variance for realism
      const startDelay = this.delay() + (Math.random() * 50);

      setTimeout(() => this.checkAndFlip(), startDelay);
    });

    effect(() => { if (this.isHovered()) this.checkAndFlip(); });
  }

  private async checkAndFlip() {
    if (this.isFlipping()) return;

    const targetIdx = this.chars().indexOf(this.target().toUpperCase());
    const finalTarget = targetIdx === -1 ? 0 : targetIdx;

    if (this.currentIndex() !== finalTarget || this.isHovered()) {
      // idstance to target char
      const distance = (finalTarget - this.currentIndex() + this.chars().length) % this.chars().length;

      // speed calc
      if (distance > 5) {
        // accelerate or stay at MAX_SPEED if distance is high
        this.flipCount++;
        const nextSpeed = Math.max(this.MAX_SPEED, this.START_SPEED - (this.flipCount * 50));
        this.currentSpeed.set(nextSpeed);
      } else {
        // decelerate otherwise
        const slowDown = (5 - distance) * 40;
        this.currentSpeed.set(this.MAX_SPEED + slowDown);
      }

      this.isFlipping.set(true);
      await new Promise(resolve => setTimeout(resolve, 15));
      this.pendingRotation.set('rotateX(-180deg)');

      setTimeout(() => {
        this.isFlipping.set(false);
        this.pendingRotation.set('rotateX(0deg)');
        this.currentIndex.set((this.currentIndex() + 1) % this.chars().length);

        requestAnimationFrame(() => this.checkAndFlip());
      }, this.currentSpeed());
    } else {
      this.flipCount = 0;
      this.currentSpeed.set(this.START_SPEED);
    }
  }
}