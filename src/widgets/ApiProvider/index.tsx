import { Api } from "@entities/api";
import ApiContext, { ApiContextValue } from "@features/api-context";
import { Configuration, ConfigurationParameters } from "@shared/api/generated";
import { TokenContextData, getTokenContextData, setTokenContextData } from "@shared/lib/token";
import { useState } from "react";

type Props = {
  children: any
}

const ApiContextProvider = (props: Props) => {
  const [tokenContext, setTokenContext] = useState(getTokenContextData())

  function _setToken(context: TokenContextData) {
    setTokenContextData(context);
    setTokenContext(context);
  }

  function _resetToken() {
    _setToken(new TokenContextData());
  }

  const configurationParameters: ConfigurationParameters = {
    basePath: (window as any).ENV_BACKEND_API_URL,
    accessToken: () => tokenContext.accessToken ?? "",
  }

  const configuration = new Configuration(configurationParameters);

  const contextValue: ApiContextValue = {
    api: new Api(configuration, setTokenContext, tokenContext),
    setToken: _setToken,
    resetToken: _resetToken
  }

  return (
    <ApiContext.Provider value={contextValue}>
      {props.children}
    </ApiContext.Provider>
  )

}

export default ApiContextProvider
