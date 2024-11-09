import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchOptions} from '../../../models/types';

type DropdownKey = 'originalLanguage' | 'translationLanguage' | 'sorting';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent {
  @Output() changeOptions = new EventEmitter<SearchOptions>();

  readonly dropdowns: Record<DropdownKey, string[]> = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어']
  };

  readonly DEFAULT_OPTIONS: SearchOptions = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)'
  };

  selectedOptions: SearchOptions = {...this.DEFAULT_OPTIONS};
  activeDropdown: DropdownKey | null = null;

  get dropdownEntries() {
    return Object.entries(this.dropdowns).map(([key, options]) => ({
      key: key as DropdownKey,
      options
    }));
  }

  toggleDropdown(key: DropdownKey): void {
    this.activeDropdown = this.activeDropdown === key ? null : key;
  }

  selectOption(key: DropdownKey, option: string): void {
    this.selectedOptions = {
      ...this.selectedOptions,
      [key]: option
    };
    this.activeDropdown = null;
    this.changeOptions.emit(this.selectedOptions);
  }

  clearOptions(): void {
    this.selectedOptions = {...this.DEFAULT_OPTIONS};
    this.changeOptions.emit(this.selectedOptions);
  }
}
