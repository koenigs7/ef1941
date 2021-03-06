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
import { AudioService } from './services/audio.service';
import { HeaderComponent } from './header/header.component';
import { ScoreService } from './services/score.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    UnitComponent,
    KeyHanderComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TurnService,MapService,UnitService,AIService,CombatService,SupplyService,AudioService,ScoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
