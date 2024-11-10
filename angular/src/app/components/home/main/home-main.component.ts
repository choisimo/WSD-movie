import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import {URLService} from '../../../util/movie/URL';
import {BannerComponent} from '../../../views/home-main/banner.component';
import {MovieRowComponent} from '../../../views/home-main/movie-row.component';

@Component({
  selector: 'app-home',
  templateUrl: './home-main.component.html',
  standalone: true,
  styleUrls: ['./home-main.component.css'],
  imports: [
    BannerComponent,
    MovieRowComponent
  ]
})

export class HomeMainComponent implements OnInit, OnDestroy {
  faSearch = faSearch;
  faUser = faUser;

  apiKey: string = localStorage.getItem('TMDb-Key') || '';
  featuredMovie: any = null;
  popularMoviesUrl: string = '';
  newReleasesUrl: string = '';
  actionMoviesUrl: string = '';

  private scrollListener: any;

  constructor(
    private urlService: URLService
  ) {
    this.popularMoviesUrl = urlService.getURL4PopularMovies(this.apiKey);
    this.newReleasesUrl = urlService.getURL4ReleaseMovies(this.apiKey);
    this.actionMoviesUrl = urlService.getURL4GenreMovies(this.apiKey, '28');
  }

  ngOnInit() {
    this.loadFeaturedMovie();
    this.initializeScrollListener();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private async loadFeaturedMovie() {
    this.featuredMovie = await this.urlService.fetchFeaturedMovie(this.apiKey);
  }

  private initializeScrollListener() {
    this.scrollListener = () => {
      const header = document.querySelector('.app-header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', this.scrollListener);
  }
}
