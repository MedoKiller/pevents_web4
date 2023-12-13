import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { City } from "./interfaces/city";


@Injectable({
    providedIn: 'root'
})
export class CityService{
    private apiServerUrl='http://localhost:8080';

    private apiUrlCitiesFromMunicipalities='http://localhost:8080/city/munCities';

    constructor(private http: HttpClient){}

    public getEvents(): Observable<Event[]>{
        return this.http.get<Event[]>(`${this.apiServerUrl}/event/all`);
    }

    public addEvent(event: Event): Observable<Event>{
        return this.http.post<Event>(`${this.apiServerUrl}/event/add`, event);
    }

    public updateEvent(event: Event): Observable<Event>{
        return this.http.put<Event>(`${this.apiServerUrl}/event/update`, event);
    }

    public deleteEvent(eventId: number): Observable<void>{
        return this.http.delete<void>(`${this.apiServerUrl}/event/delete/${eventId}`);
    }

    public getCitiesFromMunicipalities(selectedMunicipalitiesIds: number[]): Observable<City[]> {
        return this.http.post<City[]>(this.apiUrlCitiesFromMunicipalities, selectedMunicipalitiesIds);
    }

}