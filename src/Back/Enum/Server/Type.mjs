/**
 * Enum-like DTO for built-in server transport modes.
 */
// @ts-check
export default class Fl32_Web_Back_Enum_Server_Type {
    constructor() {
        this.HTTP2 = 'http2';
        this.HTTP = 'http';
        this.HTTPS = 'https';
        Object.freeze(this);
    }
}
