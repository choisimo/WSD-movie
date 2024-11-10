import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import {MovieInfiniteScrollComponent} from '../../../views/views/movie-infinite-scroll.component';
import {URLService} from '../../../util/movie/URL';
import {MovieGridComponent} from '../../../views/views/movie-grid.component';

@Component({
  selector: 'app-home-popular',
  standalone: true,
  imports: [
    CommonModule,
    MovieGridComponent,
    MovieInfiniteScrollComponent,
    FontAwesomeModule
  ],
  templateUrl: './home-popular.component.html',
  styleUrls: ['./home-popular.component.css']
})
export class HomePopularComponent implements OnInit {
  faTh = faTh;
  faBars = faBars;

  apiKey = localStorage.getItem('TMDb-Key') || '';
  currentView = 'grid';

  constructor(
    private urlService: URLService

  ) {
  }

  ngOnInit(): void {
    this.disableScroll();
  }

  setView(view: string): void {
    this.currentView = view;
    if (view === 'grid') {
      this.disableScroll();
    } else {
      this.enableScroll();
    }
  }

  private disableScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private enableScroll(): void {
    document.body.style.overflow = 'auto';
  }

  fetFetchURL(): string {
    return this.urlService.getURL4PopularMovies(this.apiKey);
  }
}
