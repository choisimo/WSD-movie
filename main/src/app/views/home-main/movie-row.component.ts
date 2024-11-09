import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import axios from 'axios';
import {WishlistService} from '../../util/movie/wishlist';

@Component({
  selector: 'app-movie-row',
  templateUrl: './movie-row.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf
  ],
  styleUrls: ['./movie-row.component.css']
})
export class MovieRowComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title!: string;
  @Input() fetchUrl!: string;
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderWindow') sliderWindow!: ElementRef;

  movies: any[] = [];
  scrollAmount: number = 0;
  showButtons: boolean = false;
  isScrolling: boolean = false;
  touchStartX: number = 0;
  touchEndX: number = 0;
  maxScroll: number = 0;
  private resizeListener: any;

  constructor(
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.fetchMovies();
    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit() {
    this.calculateMaxScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  get atLeftEdge(): boolean {
    return this.scrollAmount <= 0;
  }

  get atRightEdge(): boolean {
    return this.scrollAmount >= this.maxScroll;
  }

  async fetchMovies() {
    try {
      // const response = await this.http.get<any>(this.fetchUrl).toPromise();
      const response = await axios.get(this.fetchUrl);
      this.movies = response.data.results;
      console.log(this.movies);
      setTimeout(() => this.calculateMaxScroll(), 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  slide(direction: 'left' | 'right', amount: number | null = null) {
    const slideAmount = amount || this.sliderWindow.nativeElement.clientWidth * 0.8;
    if (direction === 'left') {
      this.scrollAmount = Math.max(0, this.scrollAmount - slideAmount);
    } else {
      this.scrollAmount = Math.min(this.maxScroll, this.scrollAmount + slideAmount);
    }
  }

  handleMouseMove() {
    this.showButtons = true;
  }

  handleMouseLeave() {
    this.showButtons = false;
  }

  handleWheel(event: WheelEvent) {
    event.preventDefault();
    if (this.isScrolling) return;

    this.isScrolling = true;
    const direction = event.deltaY > 0 ? 'right' : 'left';
    this.slide(direction);

    setTimeout(() => {
      this.isScrolling = false;
    }, 500);
  }

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchEnd() {
    const touchDiff = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      const direction = touchDiff > 0 ? 'right' : 'left';
      this.slide(direction, Math.abs(touchDiff));
    }
  }

  calculateMaxScroll() {
    if (this.slider && this.sliderWindow) {
      this.maxScroll = Math.max(0,
        this.slider.nativeElement.scrollWidth - this.sliderWindow.nativeElement.clientWidth
      );
    }
  }

  handleResize() {
    this.calculateMaxScroll();
    this.scrollAmount = Math.min(this.scrollAmount, this.maxScroll);
  }

  toggleWishlist(movie: any) {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
    // return true;
  }
}
