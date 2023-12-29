import { Component, OnInit, numberAttribute } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokeAPIServiceService } from '../poke-apiservice.service';

@Component({
  selector: 'app-recherche-component',
  templateUrl: './recherche-component.component.html',
  styleUrls: ['./recherche-component.component.css'],
  providers: [PokeAPIServiceService]
})
export class RechercheComponentComponent implements OnInit {
  id: number = 0;
  selectedPokeId: number = 1;
  searchPokeName: string = '';
  pokemons: Pokemon[] = [];

  constructor(private pokeService: PokeAPIServiceService){
  }

  ngOnInit(): void {
    this.pokeService.getPokemons().subscribe((data) =>{
      data.forEach((element) => {
        this.pokemons.push(new Pokemon(element.id, element.pokedexId, element.name, element.image, element.sprite, element.slug,
          element.stats, element.apiTypes, element.apiGeneration, element.apiResistances, element.resistanceModifyingAbilitiesForApi, 
          element.apiEvolutions, element.apiPreEvolution, element.apiResistancesWithAbilities))
      });
      });
  }

  go(){
    console.log(this.selectedPokeId);
  }
}
