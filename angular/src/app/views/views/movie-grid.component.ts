import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import {Movie} from '../../../models/types';
import {WishlistService} from '../../util/movie/wishlist';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-grid.component.html',
  styleUrls: ['./movie-grid.component.css']
})
export class MovieGridComponent implements OnInit, OnDestroy {
  @Input() fetchUrl!: string;
  @ViewChild('gridContainer') gridContainer!: ElementRef<HTMLDivElement>;

  movies: Movie[] = [];
  currentPage = 1;
  rowSize = 4;
  moviesPerPage = 20;
  isMobile = window.innerWidth <= 768;
  currentView = 'grid';
  private wishlistTimer: number | null = null;
  private resizeListener: () => void;

  constructor(private wishlistService: WishlistService) {
    this.resizeListener = this.handleResize.bind(this);
  }

  async ngOnInit() {
    await this.fetchMovies();
    this.calculateLayout();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    if (this.wishlistTimer) {
      clearTimeout(this.wishlistTimer);
    }
  }

  async fetchMovies(): Promise<void> {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies: Movie[] = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(this.fetchUrl, {
          params: {
            page,
            per_page: this.moviesPerPage
          }
        });
        allMovies = [...allMovies, ...response.data.results];
      }

      this.movies = allMovies.slice(0, totalMoviesNeeded);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  get visibleMovieGroups(): Movie[][] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    const paginatedMovies = this.movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce<Movie[][]>((resultArray, item, index) => {
      const groupIndex = Math.floor(index / this.rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  }

  get totalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  private handleResize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.calculateLayout();
  }

  private calculateLayout(): void {
    if (this.gridContainer) {
      const container = this.gridContainer.nativeElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = this.isMobile ? 90 : 200;
      const movieCardHeight = this.isMobile ? 150 : 220;
      const horizontalGap = this.isMobile ? 10 : 15;
      const verticalGap = -10;

      this.rowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      this.moviesPerPage = this.rowSize * maxRows;
    }
  }

  toggleWishlist(movie: Movie): void {
    if (this.wishlistTimer) {
      clearTimeout(this.wishlistTimer);
    }
    this.wishlistTimer = window.setTimeout(() => {
      this.wishlistService.toggleWishlist(movie);
    }, 2000);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }
}
