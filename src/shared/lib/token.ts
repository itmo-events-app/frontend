import { LocalStorageKeys } from '@shared/config/localstorage';
import { plainToInstance } from 'class-transformer';

class TokenContextData {
  _accessToken?: string;
  _refreshToken?: string;

  constructor(accessToken?: string, refreshToken?: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  get accessToken() {
    return this._accessToken;
  }

  get refreshToken() {
    return this._refreshToken;
  }
}

function getTokenContextData() {
  const data = localStorage.getItem(LocalStorageKeys.TOKEN);
  if (data != null) {
    const obj: object = JSON.parse(data);
    return plainToInstance(TokenContextData, obj);
  }
  return new TokenContextData();
}

function setTokenContextData(token: TokenContextData) {
  const data = JSON.stringify(token);
  localStorage.setItem(LocalStorageKeys.TOKEN, data);
}

export { TokenContextData, getTokenContextData, setTokenContextData };
