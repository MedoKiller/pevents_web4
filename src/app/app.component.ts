import { Component, OnInit } from '@angular/core';
import { Event } from './event';
import { EventService } from './event.service';
import { HttpErrorResponse } from '@angular/common/http';

import { MenuItem } from 'primeng/api';
import { FreeEntrancePicker } from './freeEntrancePicker';



interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public events: Event[] = [];

  items: MenuItem[] =[];

  /*Search form components*/
  cityNameSearch: string='';
  dateFromSearch: Date | undefined;
  dateToSearch: Date | undefined;
  freeEntrancePick: FreeEntrancePicker[] |undefined;
  selectedfreeEntrancePick:FreeEntrancePicker|undefined;

  constructor(private eventService: EventService){}

  cities!: City[];

  selectedCities!: City[];

  ngOnInit(): void {
    /*this.getEvents(); */
  this.freeEntrancePick=[
  {name: 'YES', value: 'YES'},
  {name: 'NO', value: 'NO'}];

  this.items = [
    {
        label: 'Add new event',
        icon: 'pi pi-fw pi-plus',
    },
    {
        label: 'Search events',
        icon: 'pi pi-fw pi-search'
    }
  ];
  }

  public getEvents(): void {
    this.eventService.getEvents().subscribe(
      (response: Event[]) => {
        this.events = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


}
