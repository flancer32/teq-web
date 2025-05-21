/* eslint-disable no-unused-vars */
/**
 * Interface for web request handlers used by the dispatcher in this plugin.
 * Defines the structure and behavior of a handler.
 *
 * @interface
 */
export default class Fl32_Web_Back_Api_Handler {
    /**
     * Handles the incoming web request.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - The incoming HTTP request object.
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - The HTTP response object.
     * @returns {Promise<boolean>} - Returns true if the request was handled, false otherwise.
     */
    async handle(req, res) {
        throw new Error('Method not implemented');
    }

    /**
     * Provides metadata for dispatcher registration.
     * @returns {Fl32_Web_Back_Dto_Handler_Info.Dto}
     */
    getRegistrationInfo() {
        throw new Error('Method not implemented');
    }
}
