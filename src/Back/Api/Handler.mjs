// @ts-check

/**
 * Interface for web request handlers used by the Pipeline Engine.
 *
 * @interface
 */
export default class Fl32_Web_Back_Api_Handler {
    /* eslint-disable no-unused-vars */
    /**
     * Handles one request context in a pipeline stage.
     * @param {Fl32_Web_Back_PipelineEngine_RequestContext} context
     * @returns {Promise<void>}
     */
    async handle(context) {
        throw new Error('Method not implemented');
    }

    /**
     * Provides metadata for pipeline registration.
     * @returns {Fl32_Web_Back_Dto_Handler_Info$Dto}
     */
    getRegistrationInfo() {
        throw new Error('Method not implemented');
    }
}
