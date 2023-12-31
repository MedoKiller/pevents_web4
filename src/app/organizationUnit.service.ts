import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationUnit } from './interfaces/organizationUnit';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUnitService {

    private apiUrlAllRegions = 'http://localhost:8080/org_unit/allRegions';
    private apiUrlRegionMunicipalities = 'http://localhost:8080/org_unit/regionMunicipalities';

    constructor(private http: HttpClient) { }

    getAllRegions(): Observable<OrganizationUnit[]> {
        return this.http.get<OrganizationUnit[]>(this.apiUrlAllRegions);
    }

    getMunicipalitiesFromRegions(selectedRegionIds: number[]): Observable<OrganizationUnit[]> {
        return this.http.post<OrganizationUnit[]>(this.apiUrlRegionMunicipalities, selectedRegionIds);
    }
}
