/**
 * Enum for web request processing stages in this plugin.
 * Used to define processing phases in the web dispatcher specific to this plugin.
 */
const Fl32_Web_Back_Enum_Stage = {
    PRE: 'PRE',       // Pre-processing stage: initial request handling (e.g., logging, authentication)
    PROCESS: 'PROCESS', // Main processing stage: routing and core logic
    POST: 'POST'      // Post-processing stage: final actions (e.g., logging response, cleanup)
};
export default Fl32_Web_Back_Enum_Stage;
