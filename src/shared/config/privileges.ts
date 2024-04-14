export const PrivilegeRecords = [
  ['APPROVE_REGISTRATION_REQUEST', 'SYSTEM', 'Утверждение заявки на регистрацию в системе'],
  ['REJECT_REGISTRATION_REQUEST', 'SYSTEM', 'Отклонение заявки на регистрацию в системе'],
  ['MODIFY_PROFILE_DATA', 'SYSTEM', 'Изменение данных в личном кабинете'],
  ['VIEW_OTHER_USERS_PROFILE', 'SYSTEM', 'Просмотр личного кабинета других пользователей'],
  ['VIEW_ALL_EVENTS', 'SYSTEM', 'Просмотр списка всех мероприятий'],
  ['SEARCH_EVENTS_AND_ACTIVITIES', 'SYSTEM', 'Поиск мероприятий и активностей'],
  ['CREATE_EVENT', 'SYSTEM', 'Создание мероприятия'],
  ['VIEW_EVENT_PLACE', 'SYSTEM', 'Просмотр списка площадок проведения мероприятия'],
  ['VIEW_ROUTE_BETWEEN_ROOMS', 'SYSTEM', 'Просмотр маршрута между помещениями'],
  ['ASSIGN_ORGANIZER_ROLE', 'EVENT', 'Назначение пользователю роли Организатор'],
  ['REVOKE_ORGANIZER_ROLE', 'SYSTEM', 'Лишение пользователя роли Организатор'],
  ['CREATE_EVENT_VENUE', 'SYSTEM', 'Создание площадки проведения мероприятия'],
  ['DELETE_EVENT_VENUE', 'SYSTEM', 'Удаление площадки проведения мероприятия'],
  ['EDIT_EVENT_VENUE', 'SYSTEM', 'Редактирование площадки проведения мероприятия'],
  ['CREATE_ROLE', 'SYSTEM', 'Создание роли'],
  ['DELETE_ROLE', 'SYSTEM', 'Удаление роли'],
  ['EDIT_ROLE', 'SYSTEM', 'Редактирование роли'],
  ['ASSIGN_SYSTEM_ROLE', 'SYSTEM', 'Назначение пользователю системной роли'],
  ['REVOKE_SYSTEM_ROLE', 'SYSTEM', 'Лишение пользователя системной роли'],
  ['EDIT_EVENT_INFO', 'EVENT', 'Редактирование информации о мероприятии'],
  ['ASSIGN_ASSISTANT_ROLE', 'EVENT', 'Назначение пользователю роли Помощник'],
  ['REVOKE_ASSISTANT_ROLE', 'EVENT', 'Лишение пользователя роли Помощник'],
  ['VIEW_ORGANIZER_USERS', 'EVENT', 'Просмотр списка пользователей с ролью Организатор'],
  ['VIEW_ASSISTANT_USERS', 'EVENT', 'Просмотр списка пользователей с ролью Помощник'],
  ['CREATE_EVENT_ACTIVITIES', 'EVENT', 'Создание активностей мероприятия'],
  ['DELETE_EVENT_ACTIVITIES', 'EVENT', 'Удаление активностей мероприятия'],
  ['EDIT_EVENT_ACTIVITIES', 'EVENT', 'Редактирование активностей мероприятия'],
  ['VIEW_EVENT_ACTIVITIES', 'EVENT', 'Просмотр списка активностей мероприятия'],
  ['CREATE_TASK', 'EVENT', 'Создание задач'],
  ['DELETE_TASK', 'EVENT', 'Удаление задач'],
  ['EDIT_TASK', 'EVENT', 'Редактирование задач'],
  ['CHANGE_TASK_STATUS', 'EVENT', 'Изменение статуса задач'],
  ['ASSIGN_TASK_EXECUTOR', 'EVENT', 'Назначение исполнителя задачи мероприятия'],
  ['REPLACE_TASK_EXECUTOR', 'EVENT', 'Замена исполнителя задачи'],
  ['DELETE_TASK_EXECUTOR', 'EVENT', 'Удаление исполнителя задачи'],
  ['ASSIGN_ORGANIZATIONAL_ROLE', 'EVENT', 'Назначение пользователю организационной роли'],
  ['REVOKE_ORGANIZATIONAL_ROLE', 'EVENT', 'Лишение пользователя организационной роли'],
  ['VIEW_ALL_EVENT_TASKS', 'EVENT', 'Просмотр всех задач мероприятия'],
  ['CHANGE_ASSIGNED_TASK_STATUS', 'EVENT', 'Изменение статуса присвоенных задач'],
  ['ASSIGN_SELF_AS_TASK_EXECUTOR', 'EVENT', 'Назначение себя исполнителем задачи'],
  ['DECLINE_TASK_EXECUTION', 'EVENT', 'Отказ от исполнения задачи'],
  ['IMPORT_PARTICIPANT_LIST_XLSX', 'EVENT', 'Импорт списка участников в формате xlsx'],
  ['EXPORT_PARTICIPANT_LIST_XLSX', 'EVENT', 'Экспорт списка участников в формате xlsx'],
  ['WORK_WITH_PARTICIPANT_LIST', 'EVENT', 'Работа со списком участников'],
];

export enum PrivilegeNames {
  APPROVE_REGISTRATION_REQUEST,
  REJECT_REGISTRATION_REQUEST,
  MODIFY_PROFILE_DATA,
  VIEW_OTHER_USERS_PROFILE,
  VIEW_ALL_EVENTS,
  SEARCH_EVENTS_AND_ACTIVITIES,
  CREATE_EVENT,
  VIEW_EVENT_PLACE,
  VIEW_ROUTE_BETWEEN_ROOMS,
  ASSIGN_ORGANIZER_ROLE,
  REVOKE_ORGANIZER_ROLE,
  CREATE_EVENT_VENUE,
  DELETE_EVENT_VENUE,
  EDIT_EVENT_VENUE,
  CREATE_ROLE,
  DELETE_ROLE,
  EDIT_ROLE,
  ASSIGN_SYSTEM_ROLE,
  REVOKE_SYSTEM_ROLE,
  EDIT_EVENT_INFO,
  ASSIGN_ASSISTANT_ROLE,
  REVOKE_ASSISTANT_ROLE,
  VIEW_ORGANIZER_USERS,
  VIEW_ASSISTANT_USERS,
  CREATE_EVENT_ACTIVITIES,
  DELETE_EVENT_ACTIVITIES,
  EDIT_EVENT_ACTIVITIES,
  VIEW_EVENT_ACTIVITIES,
  CREATE_TASK,
  DELETE_TASK,
  EDIT_TASK,
  CHANGE_TASK_STATUS,
  ASSIGN_TASK_EXECUTOR,
  REPLACE_TASK_EXECUTOR,
  DELETE_TASK_EXECUTOR,
  ASSIGN_ORGANIZATIONAL_ROLE,
  REVOKE_ORGANIZATIONAL_ROLE,
  VIEW_ALL_EVENT_TASKS,
  CHANGE_ASSIGNED_TASK_STATUS,
  ASSIGN_SELF_AS_TASK_EXECUTOR,
  DECLINE_TASK_EXECUTION,
  IMPORT_PARTICIPANT_LIST_XLSX,
  EXPORT_PARTICIPANT_LIST_XLSX,
  WORK_WITH_PARTICIPANT_LIST,
}

export function getPrivilegeName(privilege: PrivilegeNames) {
  return PrivilegeNames[privilege];
}
