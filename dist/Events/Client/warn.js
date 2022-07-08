"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
exports.default = {
    once: false,
    async execute(bot, event) {
        await (0, logger_1.default)(`Warning! - ${event}`, "warn");
    },
};
//# sourceMappingURL=warn.js.map