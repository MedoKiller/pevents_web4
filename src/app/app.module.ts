import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventService } from './event.service';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [EventService,MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
