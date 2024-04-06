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
 * @interface EventResponse
 */
export interface EventResponse {
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'id'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'placeId'?: number;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'startDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'endDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'title'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'shortDescription'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'fullDescription'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'format'?: EventResponseFormatEnum;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'status'?: EventResponseStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'registrationStart'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'registrationEnd'?: string;
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'parent'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'participantLimit'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'participantAgeLowest'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventResponse
     */
    'participantAgeHighest'?: number;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'preparingStart'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventResponse
     */
    'preparingEnd'?: string;
}

export const EventResponseFormatEnum = {
    Online: 'ONLINE',
    Offline: 'OFFLINE',
    Hybrid: 'HYBRID'
} as const;

export type EventResponseFormatEnum = typeof EventResponseFormatEnum[keyof typeof EventResponseFormatEnum];
export const EventResponseStatusEnum = {
    Draft: 'DRAFT',
    Published: 'PUBLISHED',
    Completed: 'COMPLETED',
    Canceled: 'CANCELED'
} as const;

export type EventResponseStatusEnum = typeof EventResponseStatusEnum[keyof typeof EventResponseStatusEnum];


