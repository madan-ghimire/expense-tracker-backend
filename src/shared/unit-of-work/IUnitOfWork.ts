export interface IUnitOfWork {
  complete(): Promise<void>;
  rollback(): Promise<void>;
}
