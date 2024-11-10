import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WishlistService} from '../../util/movie/wishlist';
import {Movie} from '../../../models/types';

@Component({
  selector: 'app-movie-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-wishlist.component.html',
  styleUrls: ['./movie-wishlist.component.css']
})
export class MovieWishlistComponent implements OnInit, OnDestroy {
  @ViewChild('gridContainer') gridContainer!: ElementRef;

  rowSize: number = 4;
  moviesPerPage: number = 20;
  currentPage: number = 1;
  isMobile: boolean = window.innerWidth <= 768;
  currentView: string = 'grid';
  wishlistMovies: Movie[] = [];
  visibleWishlistMovies: Movie[][] = [];

  private resizeObserver: ResizeObserver;

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {
    this.resizeObserver = new ResizeObserver(() => this.calculateLayout());
  }

  ngOnInit() {
    this.loadWishlist();
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));

    if (this.gridContainer) {
      this.resizeObserver.observe(this.gridContainer.nativeElement);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.gridContainer) {
      this.resizeObserver.unobserve(this.gridContainer.nativeElement);
    }
    this.resizeObserver.disconnect();
  }

  loadWishlist() {
    this.wishlistService.wishlist$.subscribe(movies => {
      this.wishlistMovies = movies;
      this.updateVisibleMovies();
      this.cdr.detectChanges();
    });
  }

  getImageUrl(path: string): string {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  }

  calculateLayout() {
    if (this.gridContainer) {
      const container = this.gridContainer.nativeElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = this.isMobile ? 90 : 220;
      const movieCardHeight = this.isMobile ? 150 : 330;
      const horizontalGap = this.isMobile ? 10 : 15;
      const verticalGap = -10;

      this.rowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      this.moviesPerPage = this.rowSize * maxRows;

      this.updateVisibleMovies();
      this.cdr.detectChanges();
    }
  }

  updateVisibleMovies() {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    const paginatedMovies = this.wishlistMovies.slice(startIndex, endIndex);

    this.visibleWishlistMovies = paginatedMovies.reduce((resultArray: Movie[][], item, index) => {
      const groupIndex = Math.floor(index / this.rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  }

  get totalPages(): number {
    return Math.ceil(this.wishlistMovies.length / this.moviesPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisibleMovies();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleMovies();
    }
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    this.calculateLayout();
  }

  toggleWishlist(movie: Movie) {
    this.wishlistService.toggleWishlist(movie);
  }
}
