import { Component } from '@angular/core';
import {MovieWishlistComponent} from '../../../views/home-wishlist/movie-wishlist.component';

@Component({
  selector: 'app-home-wishlist',
  standalone: true,
  imports: [MovieWishlistComponent],
  templateUrl: './home-wishlist.component.html',
  styleUrls: ['./home-wishlist.component.css']
})
export class HomeWishlistComponent {}
