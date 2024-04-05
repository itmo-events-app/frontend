import { PrivilegeNames } from '@shared/config/privileges';
import { intersection, union } from '@shared/util'

function hasAnyPrivilege(mine: Set<PrivilegeNames>, others: Set<PrivilegeNames>) {
  return intersection(mine, others).size > 0;
}

function hasAllPrivileges(mine: Set<PrivilegeNames>, others: Set<PrivilegeNames>) {
  return union(mine, others).size == others.size;
}


function anyPrivilege(others: Set<PrivilegeNames>) {
  return function(mine: Set<PrivilegeNames>) {
    return hasAnyPrivilege(mine, others);
  }
}

function allPrivileges(others: Set<PrivilegeNames>) {
  return function(mine: Set<PrivilegeNames>) {
    return hasAllPrivileges(mine, others);
  }
}

export { hasAnyPrivilege, hasAllPrivileges, anyPrivilege, allPrivileges }
