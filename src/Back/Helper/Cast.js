export default class Fl32_Web_Back_Helper_Cast {

    /**
     * Cast input data into an array. Ensures the result is always an array.
     * Optionally casts each item using the provided itemCast function.
     *
     * @param {*} data - Input data to be cast to array.
     * @param {function(*): *} [itemCast] - Optional function to cast each item.
     * @returns {Array}
     */
    array(data, itemCast) {
        let arr = [];

        if (Array.isArray(data)) {
            arr = data;
        } else if (data !== null) {
            arr = [data];
        }

        return (typeof itemCast === 'function')
            ? arr.map(itemCast).filter(v => v !== undefined)
            : arr;
    }


    /**
     * Cast input data into decimal 'number' data type.
     * @param {*} data
     * @returns {number|undefined}
     */
    decimal(data) {
        const res = Number.parseFloat(data);
        return ((typeof res === 'number') && (!isNaN(res))) ? res : undefined;
    }

    /**
     * Cast input data into a valid enumeration value.
     * Supports case normalization (upper/lower).
     * If both `upper` and `lower` are true, `upper` takes precedence.
     *
     * @param {*} data - The input to cast.
     * @param {Object} enu - Object whose values represent valid enum values.
     * @param {Object} [opts]
     * @param {boolean} [opts.lower] - Normalize input to lower case before comparison.
     * @param {boolean} [opts.upper] - Normalize input to upper case before comparison.
     * @returns {string|undefined}
     */
    enum(data, enu, {lower, upper} = {}) {
        let norm = data;

        if (typeof data === 'string') {
            if (upper) norm = data.toUpperCase();
            else if (lower) norm = data.toLowerCase();
        }

        const values = Object.values(enu);
        return values.includes(norm) ? norm : undefined;
    }

    /**
     * Cast input data into integer 'number' data type.
     * @param {*} data
     * @returns {number|undefined}
     */
    int(data) {
        const norm = (typeof data === 'string') ? data.trim() : data;
        const res = Number.parseInt(norm);
        return ((typeof res === 'number') && (!isNaN(res))) ? res : undefined;
    }

    /**
     * Cast input data into 'string' data type.
     * @param {*} data
     * @returns {string|undefined}
     */
    string(data) {
        if (typeof data === 'string') {
            return data;
        } else if (typeof data === 'number') {
            return String(data);
        } else if (typeof data === 'boolean') {
            return (data) ? 'true' : 'false';
        }
        return undefined;
    }
}