import { TokenContextData, getTokenContextData, setTokenContextData } from "@shared/lib/token";
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

  // NOTE: token invalid => reset token context
  async withReauth<T, U>(func: () => Promise<AxiosResponse<T, U>>): Promise<AxiosResponse<T, U>> {
    return func()
      .catch(async (e) => {
        if (e.response != undefined && e.response.status == 401) {
          setTokenContextData(new TokenContextData());
        }
        throw e;
      });
  }

  /* token invalid => use refreshToken to refresh context. Then if error during refresh => reset token context

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
              setTokenContextData(new TokenContextData()); // reset tokenContextData
              throw e; // forward func error
            });
        }
        throw e; // forward error if can't process
      });
  }


  usage:

  api.withReauth(() => api.auth.apiCall(request))
    .then(r => {
      // process apiCall request
    })
    .catch(e => {
      // process apiCall error
    })
   *
   *

  */
}

// export Global API
export const api = new Api(configuration);
