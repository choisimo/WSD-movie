import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignInComponent],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-demo';
}
