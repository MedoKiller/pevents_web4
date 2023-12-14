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

  public events: Event[] = [];

  items: MenuItem[] =[];

  /*Search form components*/
  eventNameSearch: string='';
  dateFromSearch: Date = {} as Date;
  dateToSearch: Date ={} as Date;
  freeEntrancePick: FreeEntrancePicker[] = {} as FreeEntrancePicker[];
  selectedfreeEntrancePick:FreeEntrancePicker = {} as FreeEntrancePicker;

  regions: OrganizationUnit[] =[];
  selectedRegions: OrganizationUnit[]=[];

  municipalities: OrganizationUnit[]=[];
  selectedMunicipalities: OrganizationUnit[]=[];

  cities!: City[];
  selectedCities!: City[];

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
    {name: 'YES', value: 'YES'},
    {name: 'NO', value: 'NO'}
  ];

    this.getAllRegions();

    this.filteredEvents=[{
    id: 1000,    
    name: 'Bamboo Watch',
    dateFrom: 'Product Description',
    dateTo: 'bamboo-watch.jpg',
    freeEntrance: '65'
    }
    ]
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
    this.searchForm.cityIds=this.selectedCities.map(city => city.id);




  }

}
