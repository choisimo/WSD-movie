import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  standalone: true,
  styleUrls: ['./banner.component.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class BannerComponent {
  @Input() movie: any;

  get backdropUrl(): string {
    return this.movie ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}` : '';
  }
}
