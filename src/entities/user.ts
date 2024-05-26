import { UserResponse } from '@shared/api/generated/model';

class RoleGroup {
  name: string;
  roles: string[];
  constructor(name: string, roles: string[]) {
    this.name = name;
    this.roles = roles;
  }
}

class UserModel {
  private _id: number;
  private _name: string;
  private _surname: string;
  private _login: string;
  private _loginType: string;
  private _roleGroups: RoleGroup[];

  constructor(id: number, name: string, surname: string, login: string, loginType: string, roleGroups: RoleGroup[]) {
    this._id = id;
    this._name = name;
    this._surname = surname;
    this._login = login;
    this._loginType = loginType;
    this._roleGroups = roleGroups;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get surname() {
    return this._surname;
  }
  get login() {
    return this._login;
  }
  get loginType() {
    return this._loginType;
  }
  get roleGroups() {
    return this._roleGroups;
  }
}

function toUserModel(user: UserResponse): UserModel {
  const systemRoles = new RoleGroup('Системные роли', user.systemRoles || []);
  const eventRoles: RoleGroup[] = Object.entries(user.eventRoles!).map(
    ([name, roles]) => new RoleGroup('Роли мероприятия ' + name, roles)
  );
  const roleGroups: RoleGroup[] = [systemRoles].concat(eventRoles);
  return new UserModel(user.id!, user.name!, user.surname!, user.login!, user.type!, roleGroups);
}

export { UserModel, RoleGroup };
export { toUserModel };
