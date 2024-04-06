import { getTokenContextData } from "@shared/lib/token";
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
}

// export Global API
export const api = new Api(configuration);
