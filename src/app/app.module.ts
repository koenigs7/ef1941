import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './pages/map/map.component';
import { UnitComponent } from './units/unit/unit.component';
import { KeyHander } from './events/key.handlers';
import { MoveService } from './services/move.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UnitComponent,
    KeyHander
  ],
  imports: [
    BrowserModule
  ],
  providers: [MoveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
