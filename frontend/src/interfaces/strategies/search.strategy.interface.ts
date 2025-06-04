/**
 * Generic search strategy interface
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
export interface ISearchStrategy<T> {
    search(items: T[], query: string): T[];
}

/**
 * Generic filter strategy interface
 */
export interface IFilterStrategy<T> {
    filter(items: T[], criteria: any): T[];
}

/**
 * Base searchable interface
 */
export interface ISearchable {
    id: string;
    [key: string]: any;
}
