export default interface RepositoryInterface<T> {
    create(entity: T): Promise<T | void>;
    update(entity: T): Promise<T | void>;
    find(id: string): Promise<T>
    findAll(): Promise<T[]>
}