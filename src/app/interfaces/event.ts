import { City } from "./city";

export interface Event {
     id: number | null;
     name: string | null;
     dateFrom: Date | null;
     dateTo: Date | null;
     freeEntrance: string | null;
     city: City | null   
}