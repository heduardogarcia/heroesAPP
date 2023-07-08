import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {
  public searchInput= new FormControl('');
  public heroes: Hero[]=[];
  public selectedHero?:Hero;
  constructor(private heroesService: HeroesService){}
  onSelectedOption(event: MatAutocompleteSelectedEvent){
    console.log(event.option.value);
    if(!event.option.value){
      this.selectedHero=undefined;
      return;

    }
    const hero:Hero=event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero=hero;
  }
  searchHero(){
    const value:string= this.searchInput.value || '';
    // console.log({value});
    this.heroesService.getSuggestions(value)
      .subscribe(heroes =>this.heroes =heroes);

  }
}
