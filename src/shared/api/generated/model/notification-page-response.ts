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
import { NotificationResponse } from './notification-response';

/**
 * 
 * @export
 * @interface NotificationPageResponse
 */
export interface NotificationPageResponse {
    /**
     * 
     * @type {Array<NotificationResponse>}
     * @memberof NotificationPageResponse
     */
    'content'?: Array<NotificationResponse>;
    /**
     * 
     * @type {number}
     * @memberof NotificationPageResponse
     */
    'totalPages'?: number;
    /**
     * 
     * @type {number}
     * @memberof NotificationPageResponse
     */
    'totalElements'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof NotificationPageResponse
     */
    'last'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof NotificationPageResponse
     */
    'first'?: boolean;
    /**
     * 
     * @type {number}
     * @memberof NotificationPageResponse
     */
    'number'?: number;
}
