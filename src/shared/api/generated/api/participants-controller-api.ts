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
import { ParticipantPresenceRequest } from '../model';
// @ts-ignore
import { ParticipantResponse } from '../model';
// @ts-ignore
import { ParticipantsListRequest } from '../model';
/**
 * ParticipantsControllerApi - axios parameter creator
 * @export
 */
export const ParticipantsControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Изменения поля visited у участника мероприятия
         * @param {number} id 
         * @param {ParticipantPresenceRequest} participantPresenceRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        changePresence: async (id: number, participantPresenceRequest: ParticipantPresenceRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('changePresence', 'id', id)
            // verify required parameter 'participantPresenceRequest' is not null or undefined
            assertParamExists('changePresence', 'participantPresenceRequest', participantPresenceRequest)
            const localVarPath = `/api/events/{id}/participants`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer Authentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(participantPresenceRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Получение списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getParticipants: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getParticipants', 'id', id)
            const localVarPath = `/api/events/{id}/participants`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer Authentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
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
         * @summary Экспорт списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getParticipantsXlsxFile: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getParticipantsXlsxFile', 'id', id)
            const localVarPath = `/api/events/{id}/participants/file`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer Authentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
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
         * @summary Импорт списка участников мероприятия
         * @param {number} id 
         * @param {ParticipantsListRequest} participantsListRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setPartisipantsList: async (id: number, participantsListRequest: ParticipantsListRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('setPartisipantsList', 'id', id)
            // verify required parameter 'participantsListRequest' is not null or undefined
            assertParamExists('setPartisipantsList', 'participantsListRequest', participantsListRequest)
            const localVarPath = `/api/events/{id}/participants`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer Authentication required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(participantsListRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ParticipantsControllerApi - functional programming interface
 * @export
 */
export const ParticipantsControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ParticipantsControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Изменения поля visited у участника мероприятия
         * @param {number} id 
         * @param {ParticipantPresenceRequest} participantPresenceRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async changePresence(id: number, participantPresenceRequest: ParticipantPresenceRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ParticipantResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.changePresence(id, participantPresenceRequest, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ParticipantsControllerApi.changePresence']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @summary Получение списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getParticipants(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ParticipantResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getParticipants(id, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ParticipantsControllerApi.getParticipants']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @summary Экспорт списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getParticipantsXlsxFile(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<File>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getParticipantsXlsxFile(id, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ParticipantsControllerApi.getParticipantsXlsxFile']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @summary Импорт списка участников мероприятия
         * @param {number} id 
         * @param {ParticipantsListRequest} participantsListRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setPartisipantsList(id: number, participantsListRequest: ParticipantsListRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ParticipantResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.setPartisipantsList(id, participantsListRequest, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ParticipantsControllerApi.setPartisipantsList']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * ParticipantsControllerApi - factory interface
 * @export
 */
export const ParticipantsControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ParticipantsControllerApiFp(configuration)
    return {
        /**
         * 
         * @summary Изменения поля visited у участника мероприятия
         * @param {number} id 
         * @param {ParticipantPresenceRequest} participantPresenceRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        changePresence(id: number, participantPresenceRequest: ParticipantPresenceRequest, options?: any): AxiosPromise<ParticipantResponse> {
            return localVarFp.changePresence(id, participantPresenceRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Получение списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getParticipants(id: number, options?: any): AxiosPromise<ParticipantResponse> {
            return localVarFp.getParticipants(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Экспорт списка участников мероприятия
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getParticipantsXlsxFile(id: number, options?: any): AxiosPromise<File> {
            return localVarFp.getParticipantsXlsxFile(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Импорт списка участников мероприятия
         * @param {number} id 
         * @param {ParticipantsListRequest} participantsListRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setPartisipantsList(id: number, participantsListRequest: ParticipantsListRequest, options?: any): AxiosPromise<ParticipantResponse> {
            return localVarFp.setPartisipantsList(id, participantsListRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ParticipantsControllerApi - object-oriented interface
 * @export
 * @class ParticipantsControllerApi
 * @extends {BaseAPI}
 */
export class ParticipantsControllerApi extends BaseAPI {
    /**
     * 
     * @summary Изменения поля visited у участника мероприятия
     * @param {number} id 
     * @param {ParticipantPresenceRequest} participantPresenceRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ParticipantsControllerApi
     */
    public changePresence(id: number, participantPresenceRequest: ParticipantPresenceRequest, options?: AxiosRequestConfig) {
        return ParticipantsControllerApiFp(this.configuration).changePresence(id, participantPresenceRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Получение списка участников мероприятия
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ParticipantsControllerApi
     */
    public getParticipants(id: number, options?: AxiosRequestConfig) {
        return ParticipantsControllerApiFp(this.configuration).getParticipants(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Экспорт списка участников мероприятия
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ParticipantsControllerApi
     */
    public getParticipantsXlsxFile(id: number, options?: AxiosRequestConfig) {
        return ParticipantsControllerApiFp(this.configuration).getParticipantsXlsxFile(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Импорт списка участников мероприятия
     * @param {number} id 
     * @param {ParticipantsListRequest} participantsListRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ParticipantsControllerApi
     */
    public setPartisipantsList(id: number, participantsListRequest: ParticipantsListRequest, options?: AxiosRequestConfig) {
        return ParticipantsControllerApiFp(this.configuration).setPartisipantsList(id, participantsListRequest, options).then((request) => request(this.axios, this.basePath));
    }
}

