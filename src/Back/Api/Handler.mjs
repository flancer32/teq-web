/**
 * Interface for web request handlers used by the Pipeline Engine.
 *
 * @interface
 */
// @ts-check
export default class Fl32_Web_Back_Api_Handler {
    constructor() {
        /**
         * Handles one request context in a pipeline stage.
         * @param {Fl32_Web_Back_Dto_RequestContext} context
         * @returns {Promise<void>}
         */
        this.handle = async function (_context) {
            throw new Error('Method not implemented');
        };

        /**
         * Provides metadata for pipeline registration.
         * @returns {Fl32_Web_Back_Dto_Info}
         */
        this.getRegistrationInfo = function () {
            throw new Error('Method not implemented');
        };
    }
}
