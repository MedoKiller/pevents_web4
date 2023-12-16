import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { FreeEntrancePicker } from './interfaces/freeEntrancePicker';
import { Event } from './interfaces/event';

import { City } from './interfaces/city';
import { OrganizationUnit } from './interfaces/organizationUnit';

import { EventService } from './event.service';
import { OrganizationUnitService } from './organizationUnit.service';
import { CityService } from './city.service';
import { searchFormService } from './searchForm.service';

import { MenuItem, MessageService,ConfirmationService,ConfirmEventType} from 'primeng/api';

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
              private searchFormService: searchFormService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService){}

  events: Event[] = [];

  items: MenuItem[] =[];

  /* Add form components */

  eventNameAdd: string| null='';
  dateFromAdd!: Date | null;
  dateToAdd!: Date |null;
  formattedDateToAdd!: Date | null ;
  formattedDateFromAdd!: Date |null;
  selectedFreeEntrancePickAdd: FreeEntrancePicker = {} as FreeEntrancePicker;
  citiesAdd: City[]=[];
  selectedCityAdd: City| null = null;
  eventToAdd: Event={} as Event;

  /* Update form components */
  idEventToUpdate!: number| null;
  updateClicked: string='';
  updateEventName: string |null='';
  updateDateFrom!: Date |null;
  updateDateTo!: Date |null;
  formattedDateToUpdate!: Date | null ;
  formattedDateFromUpdate!: Date |null;
  updateSelectedFreeEntrancePick: FreeEntrancePicker = {} as FreeEntrancePicker;
  selectedCityUpdate: City| null = null;
  eventToUpdate: Event={} as Event;


  /*Search form components*/
  eventNameSearch: string='';
  dateFromSearch!: Date |null;
  dateToSearch!: Date |null;
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
    this.updateClicked='';
  }

  public onSearchEventClick(){
    this.menuItemClicked='searchEvent';
    this.updateClicked='';
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
        this.filteredEvents=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      });
  }


  public clearFilterEvents():void{
    this.eventNameSearch='';
    this.dateFromSearch=null;
    this.dateToSearch=null;
    this.selectedFreeEntrancePick={} as FreeEntrancePicker;
    this.selectedCities=[];
    this.selectedMunicipalities = [];
    this.selectedRegions=[];
  }



  public onUpdateEvent(rowEvent: Event){
    this.menuItemClicked='';
    this.updateClicked='updateEvent';

    this.updateEventName=rowEvent.name;
    this.updateDateFrom=(rowEvent.dateFrom==null)?null: new Date(rowEvent.dateFrom);
    this.updateDateTo=(rowEvent.dateTo==null)?null: new Date(rowEvent.dateTo);
    if(rowEvent.freeEntrance=='NE'){
      this.updateSelectedFreeEntrancePick= {name: 'NO', value: 'NE'};
    }else{
      this.updateSelectedFreeEntrancePick= {name: 'YES', value: 'DA'}; 
    }

    this.selectedCityUpdate=rowEvent.cityDTO;

    this.idEventToUpdate=rowEvent.id;

  }

  public onDeleteEvent(rowEvent: Event){

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.deleteEvent(rowEvent.id);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Event deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected deleting the event' });
      }
  });

  }


  public deleteEvent(id: number|null):void{
    this.eventService.deleteEvent(id).subscribe({
      next: (response) => {
        this.filterEvents();
      },
      error: (error) => {

      }
    });
  }


  public addEvent(){
    if(this.dateFromAdd instanceof Date) {
      this.formattedDateFromAdd = new Date(this.dateFromAdd.getTime());
      this.formattedDateFromAdd.setSeconds(0, 0);
    } else {
      this.formattedDateFromAdd = null;
    }

    if(this.dateToAdd instanceof Date) {
      this.formattedDateToAdd = new Date(this.dateToAdd.getTime());
      this.formattedDateToAdd.setSeconds(0, 0);
    } else {
      this.formattedDateToAdd = null;
    }

    this.eventToAdd.name=this.eventNameAdd;
    this.eventToAdd.dateFrom=this.formattedDateFromAdd;
    this.eventToAdd.dateTo=this.formattedDateToAdd;
    this.eventToAdd.freeEntrance=this.selectedFreeEntrancePickAdd? this.selectedFreeEntrancePickAdd.value : null;
    this.eventToAdd.cityDTO=this.selectedCityAdd;


    if (this.selectedCityAdd===null || this.selectedCityAdd===undefined) {
      this.messageService.add({ 
          severity: 'warn', 
          summary: 'Validation Error', 
          detail: 'Please select a city.' 
    });
    }else{
      this.eventService.addEvent(this.eventToAdd).subscribe(
        (response: Event)=>{
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Event created!' 
        });

        this.menuItemClicked='searchEvent';
        this.filterEvents();

        },
        (error: HttpErrorResponse)=>{
          alert(error.message);
        });
      }
  }


  public clearAddEvent(): void{

    this.eventToAdd={} as Event;
    this.eventNameAdd='';
    this.dateFromAdd=null;
    this.dateToAdd=null;
    this.selectedCityAdd=null;
    this.selectedFreeEntrancePickAdd={} as FreeEntrancePicker;

  }

  public updateEvent(): void{

    if(this.updateDateFrom instanceof Date) {
      this.formattedDateFromUpdate = new Date(this.updateDateFrom.getTime());
      this.formattedDateFromUpdate.setSeconds(0, 0);
    } else {
      this.formattedDateFromUpdate = null;
    }

    if(this.updateDateTo instanceof Date) {
      this.formattedDateToUpdate = new Date(this.updateDateTo.getTime());
      this.formattedDateToUpdate.setSeconds(0, 0);
    } else {
      this.formattedDateToUpdate = null;
    }

    this.eventToUpdate.id=this.idEventToUpdate;
    this.eventToUpdate.name=this.updateEventName;
    this.eventToUpdate.dateFrom=this.formattedDateFromUpdate;
    this.eventToUpdate.dateTo=this.formattedDateToUpdate;
    this.eventToUpdate.freeEntrance=this.updateSelectedFreeEntrancePick? this.updateSelectedFreeEntrancePick.value : null;
    this.eventToUpdate.cityDTO=this.selectedCityUpdate;

    if (this.selectedCityUpdate===null || this.selectedCityUpdate===undefined) {
      this.messageService.add({ 
          severity: 'warn', 
          summary: 'Validation Error', 
          detail: 'Please select a city.' 
    });
    }else{
   
      this.eventService.updateEvent(this.eventToUpdate).subscribe(
      (response: Event)=>{
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Update complete', 
          detail: 'Event information have been succesfully updated!' 
      });

      this.updateClicked='';
      this.menuItemClicked='searchEvent';
      this.filterEvents();

      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      });
    }

  }



}
