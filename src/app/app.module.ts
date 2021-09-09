import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { D3PiechartComponent } from './components/d3-piechart/d3-piechart.component';
import { ChartsModule } from 'ng2-charts';
import { PiechartComponent } from './components/piechart/piechart.component';

@NgModule({
  declarations: [
    AppComponent,
    D3PiechartComponent,
    PiechartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
