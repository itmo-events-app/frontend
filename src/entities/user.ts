import {UserSystemRoleResponse} from "@shared/api/generated/model";

class UserModel {
  private _id: number;
  private _name: string;
  private _surname: string;
  private _login: string
  private _loginType: string;
  private _role: string;

  constructor(id: number, name: string, surname: string, login: string, loginType: string, role: string) {
    this._id = id;
    this._name = name;
    this._surname = surname;
    this._login = login;
    this._loginType = loginType
    this._role = role;
  }

  get id() { return this._id }
  get name() { return this._name; }
  get surname() { return this._surname; }
  get login() { return this._login; }
  get loginType() { return this._loginType; }
  get role() { return this._role; }
}

function toUserModel(user: UserSystemRoleResponse): UserModel {
  return new UserModel(user.id!, user.name!, user.surname!, user.login!, user.type!, user.role!);
}

export { UserModel }
export { toUserModel }
