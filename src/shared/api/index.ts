import { getTokenContextData } from "@shared/lib/token";
import type { AxiosResponse } from 'axios';
import { AuthControllerApi, Configuration, ConfigurationParameters, EventControllerApi, NotificationControllerApi, ProfileControllerApi, RoleControllerApi, TaskControllerApi, TestControllerApi } from "./generated";

const configurationParameters: ConfigurationParameters = {
  basePath: (window as any).ENV_BACKEND_API_URL,
  accessToken: () => getTokenContextData().accessToken ?? "",
}

export const configuration = new Configuration(configurationParameters);

class Api {
  auth: AuthControllerApi
  event: EventControllerApi
  notification: NotificationControllerApi
  profile: ProfileControllerApi
  role: RoleControllerApi
  task: TaskControllerApi
  test: TestControllerApi

  constructor(configuration: Configuration) {
    this.auth = new AuthControllerApi(configuration);
    this.event = new EventControllerApi(configuration);
    this.notification = new NotificationControllerApi(configuration);
    this.profile = new ProfileControllerApi(configuration);
    this.role = new RoleControllerApi(configuration);
    this.task = new TaskControllerApi(configuration);
    this.test = new TestControllerApi(configuration);
  }

  // NOTE: does nothing, need refresh token
  async withReauth<T, U>(func: () => Promise<AxiosResponse<T, U>>): Promise<AxiosResponse<T, U>> {
    return func();
  }

  /* example of implementation

  async withReauth<T, U>(func: () => Promise<AxiosResponse<T, U>>): Promise<AxiosResponse<T, U>> {
    return func()
      .catch(async (e) => {
        if (e.response.status == 401) {
          const request: RefreshRequest = {
            refreshToken: getTokenContextData().refreshToken ?? ""
          }
          return this.auth.refresh(request)
            .then(r => {
              setTokenContextData(new TokenContextData(<tokenData>));
              return func();
            })
            .catch((_: any) => {
              throw e; // forward func error
            });
        }
        throw e; // forward error if can't process
      });
  }


  usage:

  api.withReauth(() => api.auth.apiCall(request))
    .then(r => {
      // process request
      const token = r.data;
      setTokenContext(new TokenContextData(token))
      navigate(RoutePaths.eventList);
    })
    .catch(e => {
      // process error
      setErrorText(e.response.data);
      setIsError(true);
    })
   *
   *

  */
}

// export Global API
export const api = new Api(configuration);
