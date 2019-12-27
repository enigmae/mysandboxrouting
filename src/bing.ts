export interface IBingMapsResponse {
  resourceSets: IResourceSet[];
}

export interface IResourceSet {
  resources: IResource[];
}
export interface IResource {
  point: ILocation;
  name: string;
}
export interface ILocation 
{
  coordinates: number[];
}
