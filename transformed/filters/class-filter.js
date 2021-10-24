"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassFilter = void 0;
const typescript_1 = __importDefault(require("typescript"));
const node_filter_1 = require("./node-filter");
class ClassFilter extends node_filter_1.NodeFilter {
    filter(node) {
        return typescript_1.default.isClassDeclaration(node);
    }
}
exports.ClassFilter = ClassFilter;
