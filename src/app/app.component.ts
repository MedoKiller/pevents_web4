import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { FreeEntrancePicker } from './interfaces/freeEntrancePicker';
import { Event } from './interfaces/event';

import { City } from './interfaces/city';
import { OrganizationUnit } from './interfaces/organizationUnit';

import { EventService } from './event.service';
import { OrganizationUnitService } from './organizationUnit.service';
import { CityService } from './city.service';
import { searchFormService } from './searchForm.service';

import { MenuItem } from 'primeng/api';

import { SearchForm } from './interfaces/searchForm';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private eventService: EventService, 
              private organizationUnitService: OrganizationUnitService,
              private cityService: CityService,
              private searchFormService: searchFormService){}

  events: Event[] = [];

  items: MenuItem[] =[];

  /* Add / update form components */

  eventNameAdd: string='';
  dateFromAdd!: Date;
  dateToAdd!: Date;
  formattedDateToAdd!: Date | null ;
  formattedDateFromAdd!: Date |null;
  selectedFreeEntrancePickAdd: FreeEntrancePicker = {} as FreeEntrancePicker;
  citiesAdd: City[]=[];
  selectedCityAdd: City ={} as City;
  eventToAdd: Event={} as Event;




  /*Search form components*/
  eventNameSearch: string='';
  dateFromSearch!: Date;
  dateToSearch!: Date;
  freeEntrancePick: FreeEntrancePicker[] = {} as FreeEntrancePicker[];
  selectedFreeEntrancePick:FreeEntrancePicker = {} as FreeEntrancePicker;

  regions: OrganizationUnit[] =[];
  selectedRegions: OrganizationUnit[]=[];

  municipalities: OrganizationUnit[]=[];
  selectedMunicipalities: OrganizationUnit[]=[];

  cities: City[]=[];
  selectedCities: City[]=[];

  filteredEvents!: Event[];

  searchForm: SearchForm = {} as SearchForm;

  ngOnInit(): void {
    /*this.getEvents(); */
  this.items = [
    { label: 'Add new event',
      icon: 'pi pi-fw pi-plus',
      command: () => this.onAddEventClick()
    },
    { label: 'Search events',
      icon: 'pi pi-fw pi-search',
      command: () => this.onSearchEventClick()
    }];

  this.freeEntrancePick=[
    {name: 'YES', value: 'DA'},
    {name: 'NO', value: 'NE'}
  ];

    this.getAllRegions();
    this.getAllCities();

  }

  menuItemClicked: string='searchEvent';

  public onAddEventClick(){
    this.menuItemClicked='addEvent';
  }

  public onSearchEventClick(){
    this.menuItemClicked='searchEvent';
  }

  loading: boolean=false; /*iskoristi ovo kad napravis dohvat podataka nakon submita forme, napravi fciju onLoad() koja hendla ovu varijablu*/

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

  public getAllRegions(): void{
    this.organizationUnitService.getAllRegions().subscribe(
      (response: OrganizationUnit[])=>{
        this.regions=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }
  
  public getAllCities(): void{
    this.cityService.getAllCities().subscribe(
      (response: City[])=>{
        this.citiesAdd=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  public onRegionChange(): void{
    const selectedRegionIds = this.selectedRegions.map(region => region.id);
    
    this.organizationUnitService.getMunicipalitiesFromRegions(selectedRegionIds).subscribe(
      (response: OrganizationUnit[])=>{
        this.municipalities=response;
        this.selectedMunicipalities = [];
        this.selectedCities=[];
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );

  }

  public onMunicipalitiesChange():void {
    const selectedMunicipalitiesIds = this.selectedMunicipalities.map(mun => mun.id);

    this.cityService.getCitiesFromMunicipalities(selectedMunicipalitiesIds).subscribe(
      (response: City[])=>{
        this.cities=response;
        this.selectedCities=[];
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  public filterEvents(){
    this.searchForm.eventName=this.eventNameSearch;
    this.searchForm.dateFrom=this.dateFromSearch;
    this.searchForm.dateTo=this.dateToSearch;
    this.searchForm.freeEntrance=this.selectedFreeEntrancePick ? this.selectedFreeEntrancePick.value : null;
    this.searchForm.cityIds=this.selectedCities.map(city => city.id);

    this.searchFormService.getFilteredEvents(this.searchForm).subscribe(
      (response: Event[])=>{
        console.log(response);
        this.filteredEvents=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      });
  }


  public onUpdateEvent(rowEvent: Event){
    console.log(rowEvent);
  }

  public onDeleteEvent(rowEvent: Event){
    console.log(rowEvent);
  }

  public addEvent(){
    if(this.dateFromAdd instanceof Date) {
      this.formattedDateFromAdd = new Date(this.dateFromAdd.getTime()); // Clone the original date
      this.formattedDateFromAdd.setSeconds(0, 0); // Set seconds and milliseconds to zero
    } else {
      this.formattedDateFromAdd = null;
    }
    console.log(this.dateFromAdd);
    console.log(this.formattedDateFromAdd);

    if(this.dateToAdd instanceof Date) {
      this.formattedDateToAdd = new Date(this.dateToAdd.getTime()); // Clone the original date
      this.formattedDateToAdd.setSeconds(0, 0); // Set seconds and milliseconds to zero
    } else {
      this.formattedDateToAdd = null;
    }

    this.eventToAdd.name=this.eventNameAdd;
    this.eventToAdd.dateFrom=this.formattedDateFromAdd;
    this.eventToAdd.dateTo=this.formattedDateToAdd;
    this.eventToAdd.freeEntrance=this.selectedFreeEntrancePickAdd.value;
    this.eventToAdd.cityDTO=this.selectedCityAdd;

    this.eventService.addEvent(this.eventToAdd).subscribe(
      (response: Event)=>{
        console.log(response);
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      });

  }




}
