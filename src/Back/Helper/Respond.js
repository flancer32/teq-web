/* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
export default class Fl32_Web_Back_Helper_Respond {
    /**
     * @param {typeof import('node:http2')} http2
     */
    constructor(
        {
            'node:http2': http2,
        }
    ) {
        // VARS
        const {constants: H2} = http2;
        const {
            HTTP2_HEADER_ALLOW,
            HTTP_STATUS_BAD_GATEWAY,
            HTTP_STATUS_BAD_REQUEST,
            HTTP_STATUS_CONFLICT,
            HTTP_STATUS_CREATED,
            HTTP_STATUS_FORBIDDEN,
            HTTP_STATUS_FOUND,
            HTTP_STATUS_INTERNAL_SERVER_ERROR,
            HTTP_STATUS_METHOD_NOT_ALLOWED,
            HTTP_STATUS_MOVED_PERMANENTLY,
            HTTP_STATUS_NOT_FOUND,
            HTTP_STATUS_NOT_MODIFIED,
            HTTP_STATUS_NO_CONTENT,
            HTTP_STATUS_OK,
            HTTP_STATUS_PAYMENT_REQUIRED,
            HTTP_STATUS_SEE_OTHER,
            HTTP_STATUS_SERVICE_UNAVAILABLE,
            HTTP_STATUS_UNAUTHORIZED,
        } = H2;

        // FUNC
        /**
         * Sends an HTTP response with a given status code.
         *
         * @param {object} params
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} params.res - HTTP response object.
         * @param {{[key: string]: string}} [params.headers={}] - Custom headers.
         * @param {string|object} [params.body=''] - Response body.
         * @param {number} status - HTTP status code.
         * @returns {boolean} - `true` if response was sent, `false` if headers were already sent.
         */
        function send({res, headers = {}, body = ''}, status) {
            if (res.headersSent || res.writableEnded) return false;
            res.writeHead(status, headers);
            res.end(typeof body === 'string' ? body : JSON.stringify(body));
            return true;
        }

        // MAIN

        /** @see send */
        this.code200_Ok = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_OK);
        };

        /** @see send */
        this.code201_Created = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_CREATED);
        };

        /** @see send */
        this.code204_NoContent = function ({res, headers = {}}) {
            return send({res, headers}, HTTP_STATUS_NO_CONTENT);
        };

        /** @see send */
        this.code301_MovedPermanently = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_MOVED_PERMANENTLY);
        };

        /** @see send */
        this.code302_Found = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_FOUND);
        };

        /** @see send */
        this.code303_SeeOther = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_SEE_OTHER);
        };

        /** @see send */
        this.code304_NotModified = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_NOT_MODIFIED);
        };

        /** @see send */
        this.code400_BadRequest = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_BAD_REQUEST);
        };

        /** @see send */
        this.code401_Unauthorized = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_UNAUTHORIZED);
        };

        /** @see send */
        this.code402_PaymentRequired = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_PAYMENT_REQUIRED);
        };

        /** @see send */
        this.code403_Forbidden = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_FORBIDDEN);
        };

        /** @see send */
        this.code404_NotFound = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_NOT_FOUND);
        };

        /** @see send */
        this.code405_MethodNotAllowed = function ({res, headers = {}, body = '', allowed = 'HEAD, GET, POST'}) {
            return send(
                {
                    res,
                    headers: {...headers, [HTTP2_HEADER_ALLOW]: allowed},
                    body,
                },
                HTTP_STATUS_METHOD_NOT_ALLOWED
            );
        };

        /** @see send */
        this.code409_Conflict = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_CONFLICT);
        };

        /** @see send */
        this.code500_InternalServerError = function ({res, headers = {}, body = 'Internal Server Error'}) {
            return send({res, headers, body}, HTTP_STATUS_INTERNAL_SERVER_ERROR);
        };

        /** @see send */
        this.code502_BadGateway = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_BAD_GATEWAY);
        };

        /** @see send */
        this.code503_ServiceUnavailable = function ({res, headers = {}, body = ''}) {
            return send({res, headers, body}, HTTP_STATUS_SERVICE_UNAVAILABLE);
        };

        /**
         * Checks if the response is writable and not yet sent.
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @returns {boolean}
         */
        this.isWritable = function (res) {
            return !res.headersSent && !res.writableEnded;
        };
    }
}