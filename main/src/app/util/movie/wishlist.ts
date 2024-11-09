
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Movie} from '../../../models/types';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Movie[]>([]);
  wishlist$: Observable<Movie[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const storedWishlist = localStorage.getItem('movieWishlist');
    if (storedWishlist) {
      this.wishlistSubject.next(JSON.parse(storedWishlist));
    }
  }

  private saveWishlist(): void {
    localStorage.setItem('movieWishlist', JSON.stringify(this.wishlistSubject.value));
  }

  toggleWishlist(movie: Movie): void {
    const currentWishlist = this.wishlistSubject.value;
    const index = currentWishlist.findIndex(item => item.id === movie.id);

    if (index === -1) {
      // 영화가 위시리스트에 없으면 추가
      this.wishlistSubject.next([...currentWishlist, movie]);
    } else {
      // 영화가 이미 위시리스트에 있으면 제거
      this.wishlistSubject.next(
        currentWishlist.filter(item => item.id !== movie.id)
      );
    }

    this.saveWishlist();
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistSubject.value.some(item => item.id === movieId);
  }

  getCurrentWishlist(): Movie[] {
    return this.wishlistSubject.value;
  }
}
