import { TokenContextData, getTokenContextData, setTokenContextData } from '@shared/lib/token';
import { createContext, useState } from 'react';

type TokenContextValue = {
  tokenContext: TokenContextData,
  setTokenContext: (token: TokenContextData) => void
}

export const TokenContext = createContext({} as TokenContextValue);

export const TokenContextProvider = (props: { children: any }) => {
  const [tokenContext, setToken] = useState(getTokenContextData);
  const setTokenContext = (token: TokenContextData) => {
    setTokenContextData(token);
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
