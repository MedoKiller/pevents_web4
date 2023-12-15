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

    public getAllCities(): Observable<City[]>{
        return this.http.get<City[]>(`${this.apiServerUrl}/city/all`);
    }

    public getCitiesFromMunicipalities(selectedMunicipalitiesIds: number[]): Observable<City[]> {
        return this.http.post<City[]>(this.apiUrlCitiesFromMunicipalities, selectedMunicipalitiesIds);
    }

}