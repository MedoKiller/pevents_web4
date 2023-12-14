export interface SearchForm{
    eventName: string | null,
    dateFrom: Date | null,
    dateTo: Date | null,
    freeEntrance: string | null,
    cityIds: number[] | null
}