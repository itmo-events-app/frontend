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
import { PlaceShortDataRequest } from './place-short-data-request';
// May contain unused imports in some cases
// @ts-ignore
import { UserShortDataRequest } from './user-short-data-request';

/**
 * 
 * @export
 * @interface TaskRequest
 */
export interface TaskRequest {
    /**
     * 
     * @type {number}
     * @memberof TaskRequest
     */
    'eventId': number;
    /**
     * 
     * @type {UserShortDataRequest}
     * @memberof TaskRequest
     */
    'assigner': UserShortDataRequest;
    /**
     * 
     * @type {string}
     * @memberof TaskRequest
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof TaskRequest
     */
    'description': string;
    /**
     * 
     * @type {string}
     * @memberof TaskRequest
     */
    'taskStatus'?: TaskRequestTaskStatusEnum;
    /**
     * 
     * @type {PlaceShortDataRequest}
     * @memberof TaskRequest
     */
    'place'?: PlaceShortDataRequest;
    /**
     * 
     * @type {string}
     * @memberof TaskRequest
     */
    'deadline': string;
    /**
     * 
     * @type {string}
     * @memberof TaskRequest
     */
    'notificationDeadline': string;
}

export const TaskRequestTaskStatusEnum = {
    New: 'NEW',
    InProgress: 'IN_PROGRESS',
    Expired: 'EXPIRED',
    Done: 'DONE'
} as const;

export type TaskRequestTaskStatusEnum = typeof TaskRequestTaskStatusEnum[keyof typeof TaskRequestTaskStatusEnum];

