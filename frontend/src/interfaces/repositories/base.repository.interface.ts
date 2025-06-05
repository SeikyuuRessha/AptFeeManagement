/**
 * Readable interface - follows ISP by providing only read operations
 */
export interface IReadable<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
}

/**
 * Writable interface - follows ISP by providing only write operations
 */
export interface IWritable<T> {
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
}

/**
 * Searchable interface - follows ISP by providing only search operations
 */
export interface ISearchableRepository<T> {
    search(query: string): Promise<T[]>;
}

/**
 * Full CRUD repository interface
 * Follows LSP - any implementation should be substitutable
 */
export interface ICrudRepository<T> extends IReadable<T>, IWritable<T> {}

/**
 * Extended repository with search capabilities
 */
export interface IExtendedRepository<T>
    extends ICrudRepository<T>,
        ISearchableRepository<T> {}
