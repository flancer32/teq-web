/**
 * Enum for server types used to configure built-in web server.
 * - 'http': HTTP/1.1
 * - 'http2': HTTP/2 without TLS (cleartext)
 * - 'https': HTTP/2 over TLS (via http2.createSecureServer)
 */
const Fl32_Web_Back_Enum_Server_Type = {
    HTTP2: 'http2',
    HTTP: 'http',
    HTTPS: 'https'
};
export default Fl32_Web_Back_Enum_Server_Type;