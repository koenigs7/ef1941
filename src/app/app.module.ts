import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './pages/map/map.component';
import { UnitComponent } from './units/unit/unit.component';
import { KeyHander } from './events/key.handlers';
import { OrderService } from './services/move.service';
import { ArrowComponent } from './units/arrow/arrow.component';
import { TurnService } from './services/turn.service';
import { MapService } from './services/map.service';
import { UnitService } from './services/unit.service';
import { CombatService } from './services/combat.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UnitComponent,
    KeyHander,
    ArrowComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [OrderService,TurnService,MapService,UnitService,CombatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
