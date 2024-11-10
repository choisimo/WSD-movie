import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HeaderComponent} from '../../layout/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // 컴포넌트 로직
}
