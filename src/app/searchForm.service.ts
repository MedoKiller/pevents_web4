import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchForm } from './interfaces/searchForm';
import { Event } from './interfaces/event';


@Injectable({
  providedIn: 'root'
})
export class searchFormService {

    constructor(private http: HttpClient) { }

    getFilteredEvents(searchForm: SearchForm): Observable<Event[]> {
        return this.http.post<Event[]>('',searchForm);
    }

}