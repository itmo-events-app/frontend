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
 * @interface EventRequest
 */
export interface EventRequest {
    /**
     * 
     * @type {number}
     * @memberof EventRequest
     */
    'placeId': number;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'startDate': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'endDate': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'shortDescription': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'fullDescription': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'format': EventRequestFormatEnum;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'status': EventRequestStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'registrationStart': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'registrationEnd': string;
    /**
     * 
     * @type {number}
     * @memberof EventRequest
     */
    'parent'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventRequest
     */
    'participantLimit': number;
    /**
     * 
     * @type {number}
     * @memberof EventRequest
     */
    'participantAgeLowest': number;
    /**
     * 
     * @type {number}
     * @memberof EventRequest
     */
    'participantAgeHighest': number;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'preparingStart': string;
    /**
     * 
     * @type {string}
     * @memberof EventRequest
     */
    'preparingEnd': string;
    /**
     * 
     * @type {File}
     * @memberof EventRequest
     */
    'image'?: File;
}

export const EventRequestFormatEnum = {
    Online: 'ONLINE',
    Offline: 'OFFLINE',
    Hybrid: 'HYBRID'
} as const;

export type EventRequestFormatEnum = typeof EventRequestFormatEnum[keyof typeof EventRequestFormatEnum];
export const EventRequestStatusEnum = {
    Draft: 'DRAFT',
    Published: 'PUBLISHED',
    Completed: 'COMPLETED',
    Canceled: 'CANCELED'
} as const;

export type EventRequestStatusEnum = typeof EventRequestStatusEnum[keyof typeof EventRequestStatusEnum];


