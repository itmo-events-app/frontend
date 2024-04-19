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
 * @interface UserResponse
 */
export interface UserResponse {
    /**
     * 
     * @type {number}
     * @memberof UserResponse
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    'surname'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    'login'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    'type'?: UserResponseTypeEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserResponse
     */
    'systemRoles'?: Array<string>;
    /**
     * 
     * @type {{ [key: string]: Array<string>; }}
     * @memberof UserResponse
     */
    'eventRoles'?: { [key: string]: Array<string>; };
}

export const UserResponseTypeEnum = {
    Email: 'EMAIL'
} as const;

export type UserResponseTypeEnum = typeof UserResponseTypeEnum[keyof typeof UserResponseTypeEnum];

