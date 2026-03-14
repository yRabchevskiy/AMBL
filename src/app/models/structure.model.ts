export interface IPosition {
  _id: string;
  positionName: string;
  userId: string | null;
}

export interface IUnion {
  _id: string;
  name: string;
  parentId: string | null;
  structureId: string;
  positions: IPosition[];
}

export interface IStructure {
  _id: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IFullStructureResponse {
  _id: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  unions: IUnion[];
}