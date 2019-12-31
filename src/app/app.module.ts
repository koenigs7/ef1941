import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './pages/map/map.component';
import { UnitComponent } from './units/unit/unit.component';
import { KeyHanderComponent } from './events/key.handlers';
import { TurnService } from './services/turn.service';
import { MapService } from './services/map.service';
import { UnitService } from './services/unit.service';
import { CombatService } from './services/combat.service';
import { SupplyService } from './services/supply.service';
import { AIService } from './services/ai.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UnitComponent,
    KeyHanderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TurnService,MapService,UnitService,AIService,CombatService,SupplyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
