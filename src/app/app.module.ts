import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InputComponent } from './input/input.component';
import {HttpClientModule} from '@angular/common/http';
import { BackendDataComponent } from './backend-data/backend-data.component';
import { OutputComponent } from './output/output.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InputComponent,
    BackendDataComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
