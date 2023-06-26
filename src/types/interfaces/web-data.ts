export enum WebDataActionTypes {
  REGISTER_DRIVER = 'registerDriver',
  UPDATE_DRIVER = 'updateDriver',
}

export interface WebDataAction {
  action: WebDataActionTypes;
  data: Record<string, any>;
}
