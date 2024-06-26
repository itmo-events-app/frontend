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
import { PrivilegeResponse } from './privilege-response';

/**
 * 
 * @export
 * @interface RoleResponse
 */
export interface RoleResponse {
    /**
     * 
     * @type {number}
     * @memberof RoleResponse
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof RoleResponse
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof RoleResponse
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof RoleResponse
     */
    'type'?: RoleResponseTypeEnum;
    /**
     * 
     * @type {Array<PrivilegeResponse>}
     * @memberof RoleResponse
     */
    'privileges'?: Array<PrivilegeResponse>;
    /**
     * 
     * @type {boolean}
     * @memberof RoleResponse
     */
    'isEditable'?: boolean;
}

export const RoleResponseTypeEnum = {
    System: 'SYSTEM',
    Event: 'EVENT'
} as const;

export type RoleResponseTypeEnum = typeof RoleResponseTypeEnum[keyof typeof RoleResponseTypeEnum];


