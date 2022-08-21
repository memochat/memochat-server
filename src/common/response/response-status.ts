export enum ResponseStatus {
  OK = 'OK',
  INTERNEL_SERVER_ERROR = 'INTERNEL_SERVER_ERROR',
  BAD_PARAMETERS = 'BAD_PARAMETERS',
  API_NOT_FOUND = 'API_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  VERIFICATION_NOT_FOUND = 'VERIFICATION_NOT_FOUND',
  ALREADY_EXIST_EMAIL = 'ALREADY_EXIST_EMAIL',
  NOT_MATCHED_PASSWORD = 'NOT_MATCHED_PASSWORD',
}
