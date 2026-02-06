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

  displayNext = computed(() => this.isFlipping());

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

    const chars = this.chars();
    const targetIdx = chars.indexOf(this.target().toUpperCase());
    const finalTarget = targetIdx === -1 ? 0 : targetIdx;

    // if not at target char
    if (this.currentIndex() !== finalTarget || this.isHovered()) {

      const distance = (finalTarget - this.currentIndex() + chars.length) % chars.length;
      this.updateSpeed(distance);

      // flip
      this.isFlipping.set(true);
      this.pendingRotation.set('rotateX(-180deg)');

      // wait for the animation
      await new Promise(resolve => setTimeout(resolve, this.currentSpeed()));

      // reset rotation and increment index in the same microtask
      this.isFlipping.set(false);
      this.pendingRotation.set('rotateX(0deg)');
      this.currentIndex.set((this.currentIndex() + 1) % chars.length);

      // use requestAnimationFrame to check if we hit the target
      requestAnimationFrame(() => this.checkAndFlip());
    } else {
      // target reached, reset speed
      this.flipCount = 0;
      this.currentSpeed.set(this.START_SPEED);
    }
  }

  private updateSpeed(distance: number) {
    if (distance > 5 || this.isHovered()) {
      // accelerate or keep speed
      this.flipCount++;
      const nextSpeed = Math.max(this.MAX_SPEED, this.START_SPEED - (this.flipCount * 20));
      this.currentSpeed.set(nextSpeed);
    } else {
      // smooth slow down
      const slowDown = (5 - distance) * 35;
      this.currentSpeed.set(this.MAX_SPEED + slowDown);
    }
  }
}