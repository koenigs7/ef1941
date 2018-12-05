import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './pages/map/map.component';
import { UnitComponent } from './units/unit/unit.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UnitComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
