import { Component } from '@angular/core';
import { FilterExploration } from '../components/section-one/filter-exploration/filter-exploration';
import { Recipes } from '../components/section-two/recipes/recipes';

@Component({
  imports: [FilterExploration, Recipes],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {}
