/**
 * Pipeline Engine is the single request-lifecycle coordination component.
 * It executes handlers in three deterministic stages:
 * `INIT -> PROCESS -> FINALIZE`.
 */
// @ts-check

const KEY_STAGE = Symbol('stage');

export default class Fl32_Web_Back_PipelineEngine {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {object} params
     * @param {Fl32_Web_Back_Dto_RequestContext__Factory} params.dtoRequestContextFactory
     * @param {Fl32_Web_Back_Logger} params.logger
     * @param {Fl32_Web_Back_Helper_Respond} params.respond
     * @param {Fl32_Web_Back_Helper_Order_Kahn} params.helpOrder
     * @param {Fl32_Web_Back_Enum_Stage} params.STAGE
     */
    constructor({dtoRequestContextFactory, logger, respond, helpOrder, STAGE}) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        /** @type {Map<string, Fl32_Web_Back_Api_Handler>} */
        const handlers = new Map();
        /** @type {Fl32_Web_Back_Api_Handler[]} */
        let initHandlers = [];
        /** @type {Fl32_Web_Back_Api_Handler[]} */
        let processHandlers = [];
        /** @type {Fl32_Web_Back_Api_Handler[]} */
        let finalizeHandlers = [];
        let isLocked = false;

        /**
         * @param {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} request
         * @param {Fl32_Web_Back_Response_Target} response
         * @returns {Fl32_Web_Back_Dto_RequestContext}
         */
        function createRequestContext(request, response) {
            let completed = false;
            /** @type {Fl32_Web_Back_Dto_RequestContext & {[KEY_STAGE]: string|null}} */
            const context = dtoRequestContextFactory.create();
            context.request = request;
            context.response = response;
            context.data = {};
            context.completed = false;
            context.complete = () => {
                context.completed = true;
            };
            context.isCompleted = () => completed;
            context[KEY_STAGE] = null;

            Object.defineProperty(context, 'completed', {
                configurable: false,
                enumerable: true,
                get() {
                    return completed;
                },
                set(value) {
                    if (value !== true && value !== false) {
                        throw new Error('Request completion flag accepts only boolean values');
                    }
                    if (value === false && completed) {
                        throw new Error('Request completion flag cannot be reset');
                    }
                    if (value === true && !completed) {
                        if (context[KEY_STAGE] !== STAGE.PROCESS) {
                            throw new Error('Only PROCESS handlers may complete request processing');
                        }
                        completed = true;
                    }
                },
            });

            return context;
        }

        /**
         * @param {Fl32_Web_Back_Api_Handler} handler
         * @param {string} stage
         * @param {Fl32_Web_Back_Dto_RequestContext & {[KEY_STAGE]: string|null}} context
         * @returns {Promise<void>}
         */
        async function runHandler(handler, stage, context) {
            context[KEY_STAGE] = stage;
            await handler.handle(context);
        }

        /**
         * @returns {void}
         */
        this.orderHandlers = function () {
            const init = [];
            const process = [];
            const finalize = [];

            for (const handler of handlers.values()) {
                const info = handler.getRegistrationInfo();
                if (info.stage === STAGE.INIT) {
                    init.push(handler);
                } else if (info.stage === STAGE.PROCESS) {
                    process.push(handler);
                } else if (info.stage === STAGE.FINALIZE) {
                    finalize.push(handler);
                } else {
                    throw new Error(`Unsupported handler stage '${String(info.stage)}'`);
                }
            }

            initHandlers = helpOrder.sort(init);
            processHandlers = helpOrder.sort(process);
            finalizeHandlers = helpOrder.sort(finalize);
            isLocked = true;
        };

        /**
         * @returns {void}
         */
        this.lockHandlers = () => this.orderHandlers();

        /**
         * @param {Fl32_Web_Back_Api_Handler} handler
         * @returns {void}
         */
        this.addHandler = function (handler) {
            if (isLocked) {
                throw new Error('Handler registration is locked after pipeline ordering');
            }
            const info = handler.getRegistrationInfo();
            if (!info?.name) {
                throw new Error('Handler registration requires a non-empty name');
            }
            handlers.set(info.name, handler);
        };

        /**
         * @param {Fl32_Web_Back_Api_Handler} handler
         * @returns {void}
         */
        this.registerHandler = (handler) => this.addHandler(handler);

        /**
         * @param {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} req
         * @param {Fl32_Web_Back_Response_Target} res
         * @returns {Promise<void>}
         */
        this.onEventRequest = async function (req, res) {
            if (!isLocked) {
                this.orderHandlers();
            }
            /** @type {Fl32_Web_Back_Dto_RequestContext & {[KEY_STAGE]: string|null}} */
            const context = createRequestContext(req, res);

            try {
                for (const handler of initHandlers) {
                    try {
                        await runHandler(handler, STAGE.INIT, context);
                    } catch (error) {
                        logger.exception(error);
                    }
                }

                for (const handler of processHandlers) {
                    if (context.isCompleted()) {
                        break;
                    }
                    try {
                        await runHandler(handler, STAGE.PROCESS, context);
                    } catch (error) {
                        logger.exception(error);
                        if (respond.isWritable(res)) {
                            respond.code500_InternalServerError({res, body: 'Internal Server Error'});
                        }
                        context.completed = true;
                        break;
                    }
                }

                if (!context.isCompleted() && respond.isWritable(res)) {
                    logger.error(`404 Not Found: ${req.url}`);
                    respond.code404_NotFound({res});
                }
            } finally {
                for (const handler of finalizeHandlers) {
                    try {
                        await runHandler(handler, STAGE.FINALIZE, context);
                    } catch (error) {
                        logger.exception(error);
                    }
                }
                context[KEY_STAGE] = null;
            }
        };

        /**
         * @param {Fl32_Web_Node_Http_IncomingMessage|Fl32_Web_Node_Http2_ServerRequest} req
         * @param {Fl32_Web_Back_Response_Target} res
         * @returns {Promise<void>}
         */
        this.handleRequest = async (req, res) => this.onEventRequest(req, res);
    }
}

export const __deps__ = Object.freeze({
    default: {
        dtoRequestContextFactory: 'Fl32_Web_Back_Dto_RequestContext__Factory$',
        logger: 'Fl32_Web_Back_Logger$',
        respond: 'Fl32_Web_Back_Helper_Respond$',
        helpOrder: 'Fl32_Web_Back_Helper_Order_Kahn$',
        STAGE: 'Fl32_Web_Back_Enum_Stage$',
    },
});
