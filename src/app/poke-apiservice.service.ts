import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokeServiceRes } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeAPIServiceService {

  constructor(private http: HttpClient) { 
    
  }
  getPokemons(): Observable<PokeServiceRes[]>{
    return this.http.get<PokeServiceRes[]>("https://pokebuildapi.fr/api/v1/pokemon");
  }
}
