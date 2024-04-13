import { PrivilegeContextData, PrivilegeData } from "@entities/privilege-context";
import { PrivilegeNames } from "@shared/config/privileges";

const administratorEvent = new Map<number, Set<PrivilegeData>>();
administratorEvent.set(1, new Set([
  new PrivilegeData(PrivilegeNames.EDIT_EVENT_INFO),
  new PrivilegeData(PrivilegeNames.ASSIGN_ORGANIZER_ROLE),
  new PrivilegeData(PrivilegeNames.REVOKE_ORGANIZER_ROLE),
  new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS),
  new PrivilegeData(PrivilegeNames.VIEW_ASSISTANT_USERS),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES),
]))
const administrator = new PrivilegeContextData(new Set([
  new PrivilegeData(PrivilegeNames.APPROVE_REGISTRATION_REQUEST),
  new PrivilegeData(PrivilegeNames.REJECT_REGISTRATION_REQUEST),
  new PrivilegeData(PrivilegeNames.MODIFY_PROFILE_DATA),
  new PrivilegeData(PrivilegeNames.VIEW_OTHER_USERS_PROFILE),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS),
  new PrivilegeData(PrivilegeNames.SEARCH_EVENTS_AND_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.CREATE_EVENT),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
  new PrivilegeData(PrivilegeNames.VIEW_ROUTE_BETWEEN_ROOMS),
  new PrivilegeData(PrivilegeNames.CREATE_EVENT_VENUE),
  new PrivilegeData(PrivilegeNames.DELETE_EVENT_VENUE),
  new PrivilegeData(PrivilegeNames.EDIT_EVENT_VENUE),
  new PrivilegeData(PrivilegeNames.CREATE_ROLE),
  new PrivilegeData(PrivilegeNames.DELETE_ROLE),
  new PrivilegeData(PrivilegeNames.EDIT_ROLE),
  new PrivilegeData(PrivilegeNames.ASSIGN_SYSTEM_ROLE),
  new PrivilegeData(PrivilegeNames.REVOKE_SYSTEM_ROLE),
]), administratorEvent)

const readerEvent = new Map<number, Set<PrivilegeData>>();
readerEvent.set(1, new Set([
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES),
]))
const reader = new PrivilegeContextData(new Set([
  new PrivilegeData(PrivilegeNames.MODIFY_PROFILE_DATA),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS),
  new PrivilegeData(PrivilegeNames.SEARCH_EVENTS_AND_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
  new PrivilegeData(PrivilegeNames.VIEW_ROUTE_BETWEEN_ROOMS),
]), readerEvent)

const organizerEvent = new Map<number, Set<PrivilegeData>>();
organizerEvent.set(1, new Set([
  new PrivilegeData(PrivilegeNames.EDIT_EVENT_INFO),
  new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS),
  new PrivilegeData(PrivilegeNames.VIEW_ASSISTANT_USERS),
  new PrivilegeData(PrivilegeNames.CREATE_EVENT_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.DELETE_EVENT_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.EDIT_EVENT_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.CREATE_TASK),
  new PrivilegeData(PrivilegeNames.DELETE_TASK),
  new PrivilegeData(PrivilegeNames.EDIT_TASK),
  new PrivilegeData(PrivilegeNames.CHANGE_TASK_STATUS),
  new PrivilegeData(PrivilegeNames.ASSIGN_TASK_EXECUTOR),
  new PrivilegeData(PrivilegeNames.REPLACE_TASK_EXECUTOR),
  new PrivilegeData(PrivilegeNames.DELETE_TASK_EXECUTOR),
  new PrivilegeData(PrivilegeNames.ASSIGN_ORGANIZATIONAL_ROLE),
  new PrivilegeData(PrivilegeNames.REVOKE_ORGANIZATIONAL_ROLE),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENT_TASKS),
  new PrivilegeData(PrivilegeNames.CHANGE_ASSIGNED_TASK_STATUS),
  new PrivilegeData(PrivilegeNames.ASSIGN_SELF_AS_TASK_EXECUTOR),
  new PrivilegeData(PrivilegeNames.DECLINE_TASK_EXECUTION),
  new PrivilegeData(PrivilegeNames.IMPORT_PARTICIPANT_LIST_XLSX),
  new PrivilegeData(PrivilegeNames.EXPORT_PARTICIPANT_LIST_XLSX),
  new PrivilegeData(PrivilegeNames.WORK_WITH_PARTICIPANT_LIST),
]))
const organizer = new PrivilegeContextData(new Set([
  new PrivilegeData(PrivilegeNames.MODIFY_PROFILE_DATA),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS),
  new PrivilegeData(PrivilegeNames.SEARCH_EVENTS_AND_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
  new PrivilegeData(PrivilegeNames.VIEW_ROUTE_BETWEEN_ROOMS),
]), organizerEvent)

const helperEvent = new Map<number, Set<PrivilegeData>>();
helperEvent.set(1, new Set([
  new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS),
  new PrivilegeData(PrivilegeNames.VIEW_ASSISTANT_USERS),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENT_TASKS),
  new PrivilegeData(PrivilegeNames.CHANGE_ASSIGNED_TASK_STATUS),
  new PrivilegeData(PrivilegeNames.ASSIGN_SELF_AS_TASK_EXECUTOR),
  new PrivilegeData(PrivilegeNames.DECLINE_TASK_EXECUTION),
  new PrivilegeData(PrivilegeNames.IMPORT_PARTICIPANT_LIST_XLSX),
  new PrivilegeData(PrivilegeNames.EXPORT_PARTICIPANT_LIST_XLSX),
  new PrivilegeData(PrivilegeNames.WORK_WITH_PARTICIPANT_LIST),
]))
const helper = new PrivilegeContextData(new Set([
  new PrivilegeData(PrivilegeNames.MODIFY_PROFILE_DATA),
  new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS),
  new PrivilegeData(PrivilegeNames.SEARCH_EVENTS_AND_ACTIVITIES),
  new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
  new PrivilegeData(PrivilegeNames.VIEW_ROUTE_BETWEEN_ROOMS),
]), helperEvent)

export { administrator as userAdministrator, reader as userReader, organizer as userOrganizer, helper as userHelper }
