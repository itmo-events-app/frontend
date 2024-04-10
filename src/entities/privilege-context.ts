import { PrivilegeNames } from "@shared/config/privileges";

class PrivilegeData {
  _name: PrivilegeNames

  constructor(name: PrivilegeNames) {
    this._name = name;
  }

  get name() { return this._name };
}

// NOTE: undefined - hasn't been loaded, empty - no privileges
class PrivilegeContextData {
  _systemPrivileges?: Set<PrivilegeData>;
  _eventPrivileges: Map<number, Set<PrivilegeData>>;

  constructor(
    systemPrivileges: Set<PrivilegeData> | undefined = undefined,
    eventPrivileges: Map<number, Set<PrivilegeData>> = new Map()
  ) {
    this._systemPrivileges = systemPrivileges;
    this._eventPrivileges = eventPrivileges;
  }

  isSystemPrivilegesLoaded() {
    return this._systemPrivileges !== undefined;
  }

  get systemPrivileges() {
    return this._systemPrivileges;
  }

  isPrivilegesForEventLoaded(id: number) {
    return this._eventPrivileges.get(id) !== undefined;
  }

  getPrivilegesForEvent(id: number) {
    return this._eventPrivileges.get(id);
  }
}

export { PrivilegeData, PrivilegeContextData }
