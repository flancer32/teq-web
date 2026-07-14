// @ts-check

/**
 * @namespace Fl32_Web_Back_Api_Handler
 * @description Interface for web request handlers used by the Pipeline Engine.
 * @interface
 */
export default class Handler {
    /**
     * Handles one request context in a pipeline stage.
     * @param {Fl32_Web_Back_Dto_RequestContext$} _context
     * @returns {Promise<void>}
     */
    async handle(_context) {
        throw new Error('Method not implemented');
    }

    /**
     * Provides metadata for pipeline registration.
     * @returns {Fl32_Web_Back_Dto_Info$}
     */
    getRegistrationInfo() {
        throw new Error('Method not implemented');
    }
}
