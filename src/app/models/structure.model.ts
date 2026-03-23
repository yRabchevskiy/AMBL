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

  children?: IUnion[]; // Додайте це поле
  x?: number;          // І ці для координат
  y?: number;
  subtreeWidth?: number;
  subtreeHeight?: number;
  level?: number;
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


// ---------------------------------------
export interface ICreateUnion {
  name: string;
  parentId: string | null;
  structureId: string;
  positions: IPosition[];
}