import { LocalStorageKeys } from '@shared/config/localstorage';
import { plainToInstance } from 'class-transformer';
import { createContext, useState } from 'react';

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

type TokenContextValue = {
  tokenContext: TokenContextData,
  setTokenContext: (token: TokenContextData) => void
}

export const TokenContext = createContext({} as TokenContextValue);

export const TokenContextProvider = (props: { children: any }) => {
  const [tokenContext, setToken] = useState(() => {
    const data = localStorage.getItem(LocalStorageKeys.TOKEN);
    if (data != null) {
      const obj: Object = JSON.parse(data);
      return plainToInstance(TokenContextData, obj);
    }
    return new TokenContextData();
  });

  const setTokenContext = (token: TokenContextData) => {
    const data = JSON.stringify(token);
    localStorage.setItem(LocalStorageKeys.TOKEN, data);
    setToken(token);
  };

  const contextValue: TokenContextValue = {
    tokenContext,
    setTokenContext,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {props.children}
    </TokenContext.Provider>
  );
};

export type { TokenContextValue }
export { TokenContextData }
