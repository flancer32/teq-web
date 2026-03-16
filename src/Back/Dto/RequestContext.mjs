// @ts-check

/**
 * Request context passed through the pipeline lifecycle.
 */
export default class Fl32_Web_Back_Dto_RequestContext {
    /** @type {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} */
    request;

    /** @type {Fl32_Web_Back_Response_Target} */
    response;

    /** @type {Record<string, unknown>} */
    data = {};

    /** @type {boolean} */
    completed = false;

    /** @type {() => void} */
    complete;

    /** @type {() => boolean} */
    isCompleted;
}

export class Factory {
    /**
     * @returns {Fl32_Web_Back_Dto_RequestContext}
     */
    create() {
        return new Fl32_Web_Back_Dto_RequestContext();
    }
}
