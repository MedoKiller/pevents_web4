import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { FreeEntrancePicker } from './interfaces/freeEntrancePicker';
import { Event } from './interfaces/event';

import { City } from './interfaces/city';
import { OrganizationUnit } from './interfaces/organizationUnit';

import { EventService } from './event.service';
import { OrganizationUnitService } from './organizationUnit.service';
import { CityService } from './city.service';

import { MenuItem } from 'primeng/api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private eventService: EventService, 
              private OrganizationUnitService: OrganizationUnitService,
              private CityService: CityService){}

  public events: Event[] = [];

  items: MenuItem[] =[];

  /*Search form components*/
  eventNameSearch: string='';
  dateFromSearch: Date | undefined;
  dateToSearch: Date | undefined;
  freeEntrancePick: FreeEntrancePicker[] |undefined;
  selectedfreeEntrancePick:FreeEntrancePicker|undefined;

  regions: OrganizationUnit[] =[];
  selectedRegions: OrganizationUnit[]=[];

  municipalities: OrganizationUnit[]=[];
  selectedMunicipalities: OrganizationUnit[]=[];

  cities!: City[];
  selectedCities!: City[];

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
    {
      name: 'YES', value: 'YES'
    },
    {
      name: 'NO', value: 'NO'
    }];

    this.getAllRegions();

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
    this.OrganizationUnitService.getAllRegions().subscribe(
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

    this.OrganizationUnitService.getMunicipalitiesFromRegions(selectedRegionIds).subscribe(
      (response: OrganizationUnit[])=>{
        this.municipalities=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  
  public onMunicipalitiesChange():void {
    const selectedMunicipalitiesIds = this.selectedMunicipalities.map(mun => mun.id);

    console.log(selectedMunicipalitiesIds);
    this.CityService.getCitiesFromMunicipalities(selectedMunicipalitiesIds).subscribe(
      (response: City[])=>{
        this.cities=response;
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }



}
