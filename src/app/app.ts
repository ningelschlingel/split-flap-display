import { Component, signal } from '@angular/core';
import { Controller } from './controller/controller';

@Component({
  selector: 'app-root',
  imports: [Controller],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('split-flap-display');
}
