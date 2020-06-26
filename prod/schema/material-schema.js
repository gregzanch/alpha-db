"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MaterialSchema = new mongoose_1.default.Schema({
    /**
     * @name tags
     * @type String[]
     * @default undefined
     *
     * Optional
     *
     * This are tags that help identify the material.
     *
     * example: ['walls', 'drywall', 'panel'] for '5/8" Gypsum Board'
     *
     */
    tags: { type: [String], default: undefined },
    /**
     * @name manufacturer
     * @type String
     * @default ""
     *
     * Optional
     *
     * This is the manufacturer of the material.
     *
     * length is restricted between **2** and **140** characters
     *
     * the following characters are forbidden:
     * - newline (\n),
     * - tab (\t),
     * - backslash (\),
     * - dollar-sign ($)
     */
    manufacturer: {
        type: String,
        match: /^([^\n\t\\$]{2,140}|.{0})$/i,
        default: "",
    },
    /**
     * @name name
     * @type String
     *
     * Required
     *
     * This is the manufacturer of the material.
     *
     * length is restricted between **2** and **140** characters
     *
     * the following characters are forbidden:
     * - newline (\n),
     * - tab (\t),
     * - backslash (\),
     * - dollar-sign ($)
     */
    name: { type: String, match: /^[^\n\t\\$]{2,140}$/i },
    /**
     * @name material
     * @type String
     *
     * Optional
     *
     * This is actual material of the object
     *
     * example 'Steel' for 'Perforated Steel Sheet'
     *
     * length is restricted between **0** and **140** characters
     *
     * the following characters are forbidden:
     * - newline (\n),
     * - tab (\t),
     * - backslash (\),
     * - dollar-sign ($)
     */
    material: { type: String, match: /^([^\n\t\\$]{0,140})$/i, default: "" },
    /**
     * @name absorption
     * @type Map
     * @description
     *
     * Required
     *
     * This is the materials absorption coefficients
     * (How much of the incident sound is absorbed)
     *
     * argument is an object:
     * ```
     * { '250': 0.35, '500': 0.64 }
     * ```
     *
     * represented as a map:
     * ```
     * Map { '250' => 0.35, '500' => 0.64 }
     * ```
     */
    absorption: { type: Map, of: Number },
    /**
     * @name scattering
     * @type Map
     * @description
     *
     * Optional
     *
     * This is the materials scattering coefficients
     * (How much of the incident sound is scattered)
     *
     * argument is an object:
     * ```
     * { '250': 0.35, '500': 0.64 }
     * ```
     *
     * represented as a map:
     * ```
     * Map { '250' => 0.35, '500' => 0.64 }
     * ```
     */
    scattering: {
        type: Map,
        of: Number,
        default: function () {
            const scattering = {};
            this.absorption.forEach((alpha, freq) => {
                scattering[freq] = 0;
            });
            return scattering;
        },
    },
    /**
     * @name diffusion
     * @type Map
     * @description
     *
     * Optional
     *
     * This is the materials diffusion coefficients
     * (How uniformly is the incident sound scattered)
     *
     * argument is an object:
     * ```
     * { '250': 0.35, '500': 0.64 }
     * ```
     *
     * represented as a map:
     * ```
     * Map { '250' => 0.35, '500' => 0.64 }
     * ```
     */
    diffusion: {
        type: Map,
        of: Number,
        default: function () {
            const diffusion = {};
            this.absorption.forEach((alpha, freq) => {
                diffusion[freq] = 1;
            });
            return diffusion;
        },
    },
    /**
     * @name nrc
     * @type Number
     * @description
     *
     * Optional/Calculated
     *
     * The materials Noise Reduction Coefficient, which is the average
     * absorption coefficient between 250Hz and 2000Hz
     *
     */
    nrc: {
        type: Number,
        default: function () {
            let sum = 0;
            let count = 0;
            let nrc = 0;
            this.absorption.forEach((alpha, freq) => {
                const freqAsNumber = Number(freq);
                if (freqAsNumber >= 250 && freqAsNumber <= 2000) {
                    sum += alpha;
                    count += 1;
                }
            });
            if (!Number.isNaN(nrc) || (Number.isFinite(nrc) && count > 0)) {
                nrc = sum / count;
            }
            return nrc;
        },
    },
    /**
     * @name source
     * @type String
     * @description
     *
     * Optional
     *
     * A short description of where the material data came from.
     *
     * length is restricted between **0** and **300** characters
     *
     */
    source: {
        type: String,
        match: /^([^\n\t\\$]{0,300})$/i,
        default: "",
    },
    /**
     * @name sourceLink
     * @type String
     * @description
     *
     * Optional
     *
     * A link to the source. Must be a valid URL
     *
     */
    sourceLink: {
        type: String,
        match: /^((?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?|.{0})$/i,
        default: "",
    },
    /**
     * @name description
     * @type String
     * @description
     *
     * Optional
     *
     * A description of the material.
     *
     * length is restricted between **0** and **4000** characters
     *
     */
    description: {
        type: String,
        match: /^([^\n\t\\$]{0,4000})$/i,
        default: "",
    },
});
exports.default = MaterialSchema;
