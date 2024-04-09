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


// May contain unused imports in some cases
// @ts-ignore
import { PlaceShortDataResponse } from './place-short-data-response';
// May contain unused imports in some cases
// @ts-ignore
import { UserShortDataResponse } from './user-short-data-response';

/**
 * 
 * @export
 * @interface TaskResponse
 */
export interface TaskResponse {
    /**
     * 
     * @type {number}
     * @memberof TaskResponse
     */
    'id'?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskResponse
     */
    'eventId'?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'title'?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'taskStatus'?: TaskResponseTaskStatusEnum;
    /**
     * 
     * @type {UserShortDataResponse}
     * @memberof TaskResponse
     */
    'assignee'?: UserShortDataResponse;
    /**
     * 
     * @type {PlaceShortDataResponse}
     * @memberof TaskResponse
     */
    'place'?: PlaceShortDataResponse;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'creationTime'?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'deadline'?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskResponse
     */
    'notificationDeadline'?: string;
}

export const TaskResponseTaskStatusEnum = {
    New: 'NEW',
    InProgress: 'IN_PROGRESS',
    Expired: 'EXPIRED',
    Done: 'DONE'
} as const;

export type TaskResponseTaskStatusEnum = typeof TaskResponseTaskStatusEnum[keyof typeof TaskResponseTaskStatusEnum];


