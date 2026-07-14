// @ts-check

/**
 * @namespace Fl32_Web_Back_Dto_RequestContext
 * @description Request context passed through the pipeline lifecycle.
 */
export default class RequestContext {
    constructor() {
        /** @type {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} */
        this.request;

        /** @type {Fl32_Web_Back_Response_Target} */
        this.response;

        /** @type {Record<string, unknown>} */
        this.data = {};

        /** @type {boolean} */
        this.completed = false;
    }
}

export class Factory {
    constructor() {
        /**
         * @returns {Fl32_Web_Back_Dto_RequestContext$}
         */
        this.create = function () {
            return new RequestContext();
        };
    }
}
