export interface IProfile {
  userId: number;
  type: ProfileTypes;
  updatedAt: Date;
  createdAt: Date;
}

export enum ProfileTypes {
  DRIVER = 'driver',
  CLIENT = 'client',
}
