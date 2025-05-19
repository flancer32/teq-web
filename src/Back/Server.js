/**
 * Display the messages about the processing of an API request.
 * @implements {TeqFw_Web_Api_Front_Api_Request_Alert}
 */
export default class Fl32_Web_Back_Server {
    /**
     * @param {Lp_Base_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Lp_Base_Front_Mod_Notify} modNotify
     */
    constructor(
        {
            Lp_Base_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$: logger,
            Lp_Base_Front_Mod_Notify$: modNotify,
        }
    ) {
        // INSTANCE METHODS
        this.error = function (msg, req, res) {
            modNotify.negative(msg);
        };
    }
}
