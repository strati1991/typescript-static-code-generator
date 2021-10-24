"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifierFilter = void 0;
const typescript_1 = __importDefault(require("typescript"));
const node_filter_1 = require("./node-filter");
class ModifierFilter extends node_filter_1.NodeFilter {
    constructor(modifierSyntaxKind) {
        super();
        this.modifierSyntaxKind = modifierSyntaxKind;
    }
    filter(node) {
        if (node.modifiers) {
            return node.modifiers
                .map(modifier => modifier.kind)
                .includes(typescript_1.default.factory.createModifier(this.modifierSyntaxKind).kind);
        }
        return false;
    }
}
exports.ModifierFilter = ModifierFilter;
