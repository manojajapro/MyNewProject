import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InputComponent } from './input/input.component';
import {HttpClientModule} from '@angular/common/http';
import { OutputComponent } from './output/output.component';
import { BackendDataService } from './backend-data.service';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InputComponent, 
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  
  ],
  providers: [BackendDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
