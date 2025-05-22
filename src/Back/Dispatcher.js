/**
 * Dispatcher for HTTP(S) requests with three-stage handler execution: pre, process, post.
 *
 * Handlers are registered via `addHandler()` and activated by `orderHandlers()`.
 * On each request, pre-handlers run first, then process-handlers (until one returns true),
 * and finally post-handlers are always executed.
 *
 * If no process handler responds, a 404 is sent. If one throws, a 500 is returned.
 */
export default class Fl32_Web_Back_Dispatcher {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Fl32_Web_Back_Logger} logger
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     */
    constructor(
        {
            Fl32_Web_Back_Logger$: logger,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Web_Back_Enum_Stage$: STAGE,
        }
    ) {
        /* eslint-enable jsdoc/check-param-names */
        // VARS
        /** @type {Map<string, Fl32_Web_Back_Api_Handler>} */
        const _handlers = new Map();

        /** @type {Fl32_Web_Back_Api_Handler[]} */
        let _pre = [], _process = [], _post = [];

        // MAIN

        /**
         * Registers a handler. Requires a unique name and stage.
         *
         * @param {Fl32_Web_Back_Api_Handler} handler
         */
        this.addHandler = function (handler) {
            const info = handler.getRegistrationInfo();
            _handlers.set(info.name, handler);
        };

        /**
         * Executes registered handlers for one HTTP request.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @returns {Promise<void>}
         */
        this.onEventRequest = async function (req, res) {
            try {
                // Execute all pre-handlers (errors are isolated)
                for (const h of _pre) {
                    try {
                        await h.handle(req, res);
                    } catch (e) {
                        logger.exception(e);
                    }
                }

                // Execute process-handlers (stop at first successful)
                let handled = false;
                for (const h of _process) {
                    try {
                        handled = await h.handle(req, res);
                        if (handled) break;
                    } catch (e) {
                        logger.exception(e);
                        respond.code500_InternalServerError({res, body: e?.message});
                        break;
                    }
                }

                // If not handled at all and no error occurred
                if (respond.isWritable(res)) {
                    logger.error(`404 Not Found: ${req.url}`);
                    respond.code404_NotFound({res});
                }
            } finally {
                // Always run all post-handlers (errors are isolated)
                for (const h of _post) {
                    try {
                        await h.handle(req, res);
                    } catch (e) {
                        logger.exception(e);
                    }
                }
            }
        };

        /**
         * Sorts registered handlers by stage.
         */
        this.orderHandlers = function () {
            // FUNCS
            const _sortHandlers = (list) => {
                // TODO: Implement before/after sorting logic if needed.
                return list;
            };

            // MAIN
            const pre = [], process = [], post = [];

            for (const handler of _handlers.values()) {
                const dto = handler.getRegistrationInfo();
                if (dto.stage === STAGE.PRE) pre.push(handler);
                else if (dto.stage === STAGE.PROCESS) process.push(handler);
                else if (dto.stage === STAGE.POST) post.push(handler);
            }

            _pre = _sortHandlers(pre);
            _process = _sortHandlers(process);
            _post = _sortHandlers(post);
        };
    }

}
