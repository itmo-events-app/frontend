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
     * @type {number}
     * @memberof TaskRequest
     */
    'assigneeId'?: number;
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
     * @type {number}
     * @memberof TaskRequest
     */
    'placeId'?: number;
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
    'reminder': string;
}

export const TaskRequestTaskStatusEnum = {
    New: 'NEW',
    InProgress: 'IN_PROGRESS',
    Expired: 'EXPIRED',
    Done: 'DONE'
} as const;

export type TaskRequestTaskStatusEnum = typeof TaskRequestTaskStatusEnum[keyof typeof TaskRequestTaskStatusEnum];


