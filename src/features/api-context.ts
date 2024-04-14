import { Api } from '@entities/api';
import { TokenContextData } from '@shared/lib/token';
import { createContext } from 'react';

type ApiContextValue = {
  api: Api;
  setToken: (token: TokenContextData) => void;
  resetToken: () => void;
};

const ApiContext = createContext({} as ApiContextValue);

export type { ApiContextValue };
export default ApiContext;
