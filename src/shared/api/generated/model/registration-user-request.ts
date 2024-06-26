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
 * @interface RegistrationUserRequest
 */
export interface RegistrationUserRequest {
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'surname': string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'login': string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'type': RegistrationUserRequestTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'password': string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationUserRequest
     */
    'confirmPassword': string;
}

export const RegistrationUserRequestTypeEnum = {
    Email: 'EMAIL'
} as const;

export type RegistrationUserRequestTypeEnum = typeof RegistrationUserRequestTypeEnum[keyof typeof RegistrationUserRequestTypeEnum];


