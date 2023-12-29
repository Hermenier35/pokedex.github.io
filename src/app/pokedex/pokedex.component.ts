import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Pokemon } from '../pokemon';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnChanges {

  @Input() pokemons: Pokemon[] | undefined;
  @Input() selectedPokeId: number=1;
  responsiveOptions: any[] | undefined;
  numScroll : number =3;
  page : number = 0;
  name : string = "";

  ngOnInit(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedPokeId']){
      this.handlePageChange();
    }
  }
  getSeverity(status: string) {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
          return '';
    }
}

handlePageChange(): void {
  // event.page contient l'indice de la nouvelle page
  if(this.pokemons != undefined){
    this.page =  (this.selectedPokeId-1)/3
  }
}

countNumberOftranformation(pokemon:Pokemon):number {
  if(pokemon.apiEvolutions.length==0)
    return 1
  else
    if(this.pokemons != undefined)
      return 1 + this.countNumberOftranformation(this.pokemons[pokemon.apiEvolutions[0].pokedexId - 1])
    else
      return 0
}

    
}
