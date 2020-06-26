"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to = void 0;
async function to(promise) {
    try {
        const data = await promise;
        return [null, data];
    }
    catch (err) {
        return [err];
    }
}
exports.to = to;
exports.default = to;
