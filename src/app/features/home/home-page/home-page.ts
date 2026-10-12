import { Component } from '@angular/core';
import { Recipes } from '../components/section-two/recipes/recipes';

@Component({
  imports: [Recipes],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {}
