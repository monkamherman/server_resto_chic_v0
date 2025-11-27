export type TableLocation = 'terrasse' | 'salle' | 'bar' | 'jardin';

export class Table {
  id?: string;
  number?: number;
  capacity?: number;
  location?: TableLocation;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<Table> = {}) {
    this.isActive = partial.isActive ?? true;
    Object.assign(this, partial);
  }

  canAccommodate(partySize: number): boolean {
    return this.isActive && (this.capacity ?? 0) >= partySize;
  }
}
