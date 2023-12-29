import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RechercheComponentComponent } from './recherche-component/recherche-component.component';
import { FilterPokemonPipePipe } from './filter-pokemon--pipe.pipe';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { PokedexComponent } from './pokedex/pokedex.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
@NgModule({
  declarations: [
    AppComponent,
    RechercheComponentComponent,
    PokedexComponent,
    FilterPokemonPipePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    ProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
