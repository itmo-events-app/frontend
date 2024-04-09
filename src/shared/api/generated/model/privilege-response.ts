/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * 
 * @export
 * @interface PrivilegeResponse
 */
export interface PrivilegeResponse {
    /**
     * 
     * @type {number}
     * @memberof PrivilegeResponse
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof PrivilegeResponse
     */
    'name'?: PrivilegeResponseNameEnum;
    /**
     * 
     * @type {string}
     * @memberof PrivilegeResponse
     */
    'description'?: string;
}

export const PrivilegeResponseNameEnum = {
    ApproveRegistrationRequest: 'APPROVE_REGISTRATION_REQUEST',
    RejectRegistrationRequest: 'REJECT_REGISTRATION_REQUEST',
    ModifyProfileData: 'MODIFY_PROFILE_DATA',
    ViewOtherUsersProfile: 'VIEW_OTHER_USERS_PROFILE',
    ViewAllEvents: 'VIEW_ALL_EVENTS',
    SearchEventsAndActivities: 'SEARCH_EVENTS_AND_ACTIVITIES',
    CreateEvent: 'CREATE_EVENT',
    ViewEventPlace: 'VIEW_EVENT_PLACE',
    ViewRouteBetweenRooms: 'VIEW_ROUTE_BETWEEN_ROOMS',
    AssignOrganizerRole: 'ASSIGN_ORGANIZER_ROLE',
    RevokeOrganizerRole: 'REVOKE_ORGANIZER_ROLE',
    CreateEventVenue: 'CREATE_EVENT_VENUE',
    DeleteEventVenue: 'DELETE_EVENT_VENUE',
    EditEventVenue: 'EDIT_EVENT_VENUE',
    CreateRole: 'CREATE_ROLE',
    DeleteRole: 'DELETE_ROLE',
    EditRole: 'EDIT_ROLE',
    AssignSystemRole: 'ASSIGN_SYSTEM_ROLE',
    RevokeSystemRole: 'REVOKE_SYSTEM_ROLE',
    EditEventInfo: 'EDIT_EVENT_INFO',
    AssignAssistantRole: 'ASSIGN_ASSISTANT_ROLE',
    RevokeAssistantRole: 'REVOKE_ASSISTANT_ROLE',
    ViewOrganizerUsers: 'VIEW_ORGANIZER_USERS',
    ViewAssistantUsers: 'VIEW_ASSISTANT_USERS',
    CreateEventActivities: 'CREATE_EVENT_ACTIVITIES',
    DeleteEventActivities: 'DELETE_EVENT_ACTIVITIES',
    EditEventActivities: 'EDIT_EVENT_ACTIVITIES',
    ViewEventActivities: 'VIEW_EVENT_ACTIVITIES',
    CreateTask: 'CREATE_TASK',
    DeleteTask: 'DELETE_TASK',
    EditTask: 'EDIT_TASK',
    ChangeTaskStatus: 'CHANGE_TASK_STATUS',
    AssignTaskExecutor: 'ASSIGN_TASK_EXECUTOR',
    ReplaceTaskExecutor: 'REPLACE_TASK_EXECUTOR',
    DeleteTaskExecutor: 'DELETE_TASK_EXECUTOR',
    AssignOrganizationalRole: 'ASSIGN_ORGANIZATIONAL_ROLE',
    RevokeOrganizationalRole: 'REVOKE_ORGANIZATIONAL_ROLE',
    ViewAllEventTasks: 'VIEW_ALL_EVENT_TASKS',
    ChangeAssignedTaskStatus: 'CHANGE_ASSIGNED_TASK_STATUS',
    AssignSelfAsTaskExecutor: 'ASSIGN_SELF_AS_TASK_EXECUTOR',
    DeclineTaskExecution: 'DECLINE_TASK_EXECUTION',
    ImportParticipantListXlsx: 'IMPORT_PARTICIPANT_LIST_XLSX',
    ExportParticipantListXlsx: 'EXPORT_PARTICIPANT_LIST_XLSX',
    WorkWithParticipantList: 'WORK_WITH_PARTICIPANT_LIST'
} as const;

export type PrivilegeResponseNameEnum = typeof PrivilegeResponseNameEnum[keyof typeof PrivilegeResponseNameEnum];


