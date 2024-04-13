import { AuthControllerApi, Configuration, EventControllerApi, NotificationControllerApi, ParticipantsControllerApi, PlaceControllerApi, ProfileControllerApi, RoleControllerApi, TaskControllerApi } from "@shared/api/generated"
import { TokenContextData } from "@shared/lib/token"
import type { AxiosResponse } from 'axios';

type setTokenContextFunc = ((context: TokenContextData) => void);

class Api {
  auth: AuthControllerApi
  event: EventControllerApi
  notification: NotificationControllerApi
  participants: ParticipantsControllerApi
  place: PlaceControllerApi
  profile: ProfileControllerApi
  role: RoleControllerApi
  task: TaskControllerApi

  _tokenContext?: TokenContextData
  _setTokenContext: setTokenContextFunc

  constructor(configuration: Configuration, setTokenContextData: setTokenContextFunc, tokenContext?: TokenContextData) {
    this.auth = new AuthControllerApi(configuration);
    this.event = new EventControllerApi(configuration);
    this.notification = new NotificationControllerApi(configuration);
    this.participants = new ParticipantsControllerApi(configuration);
    this.place = new PlaceControllerApi(configuration);
    this.profile = new ProfileControllerApi(configuration);
    this.role = new RoleControllerApi(configuration);
    this.task = new TaskControllerApi(configuration);

    this._tokenContext = tokenContext;
    this._setTokenContext = setTokenContextData;
  }

  isLoggedIn(): boolean {
    return this._tokenContext?.accessToken != null && this._tokenContext?.accessToken != "";
  }

  // NOTE: token invalid => reset token context
  async withReauth<T, U>(func: () => Promise<AxiosResponse<T, U>>): Promise<AxiosResponse<T, U>> {
    return func()
      .catch(async (e) => {
        if (e.response != undefined && e.response.status == 401) {
          this._setTokenContext(new TokenContextData());
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

export { Api }
export type { setTokenContextFunc }
