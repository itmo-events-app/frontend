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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { NotificationResponse } from '../model';
/**
 * NotificationControllerApi - axios parameter creator
 * @export
 */
export const NotificationControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllNotifications: async (page: number, size: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'page' is not null or undefined
            assertParamExists('getAllNotifications', 'page', page)
            // verify required parameter 'size' is not null or undefined
            assertParamExists('getAllNotifications', 'size', size)
            const localVarPath = `/api/notifications`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (size !== undefined) {
                localVarQueryParameter['size'] = size;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setAllAsSeenNotifications: async (page: number, size: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'page' is not null or undefined
            assertParamExists('setAllAsSeenNotifications', 'page', page)
            // verify required parameter 'size' is not null or undefined
            assertParamExists('setAllAsSeenNotifications', 'size', size)
            const localVarPath = `/api/notifications`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (size !== undefined) {
                localVarQueryParameter['size'] = size;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} notificationId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setOneAsSeenNotification: async (notificationId: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'notificationId' is not null or undefined
            assertParamExists('setOneAsSeenNotification', 'notificationId', notificationId)
            const localVarPath = `/api/notifications/{notificationId}`
                .replace(`{${"notificationId"}}`, encodeURIComponent(String(notificationId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * NotificationControllerApi - functional programming interface
 * @export
 */
export const NotificationControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = NotificationControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAllNotifications(page: number, size: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NotificationResponse>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAllNotifications(page, size, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['NotificationControllerApi.getAllNotifications']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setAllAsSeenNotifications(page: number, size: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NotificationResponse>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.setAllAsSeenNotifications(page, size, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['NotificationControllerApi.setAllAsSeenNotifications']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @param {number} notificationId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setOneAsSeenNotification(notificationId: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NotificationResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.setOneAsSeenNotification(notificationId, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['NotificationControllerApi.setOneAsSeenNotification']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * NotificationControllerApi - factory interface
 * @export
 */
export const NotificationControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = NotificationControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllNotifications(page: number, size: number, options?: any): AxiosPromise<Array<NotificationResponse>> {
            return localVarFp.getAllNotifications(page, size, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} page 
         * @param {number} size 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setAllAsSeenNotifications(page: number, size: number, options?: any): AxiosPromise<Array<NotificationResponse>> {
            return localVarFp.setAllAsSeenNotifications(page, size, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} notificationId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setOneAsSeenNotification(notificationId: number, options?: any): AxiosPromise<NotificationResponse> {
            return localVarFp.setOneAsSeenNotification(notificationId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * NotificationControllerApi - object-oriented interface
 * @export
 * @class NotificationControllerApi
 * @extends {BaseAPI}
 */
export class NotificationControllerApi extends BaseAPI {
    /**
     * 
     * @param {number} page 
     * @param {number} size 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationControllerApi
     */
    public getAllNotifications(page: number, size: number, options?: AxiosRequestConfig) {
        return NotificationControllerApiFp(this.configuration).getAllNotifications(page, size, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} page 
     * @param {number} size 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationControllerApi
     */
    public setAllAsSeenNotifications(page: number, size: number, options?: AxiosRequestConfig) {
        return NotificationControllerApiFp(this.configuration).setAllAsSeenNotifications(page, size, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} notificationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationControllerApi
     */
    public setOneAsSeenNotification(notificationId: number, options?: AxiosRequestConfig) {
        return NotificationControllerApiFp(this.configuration).setOneAsSeenNotification(notificationId, options).then((request) => request(this.axios, this.basePath));
    }
}

