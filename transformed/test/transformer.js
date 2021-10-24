"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transformer_1 = require("./../transformer");
const filters_1 = require("../filters");
const typescript_1 = __importDefault(require("typescript"));
const testFilter = new filters_1.ClassFilter().isParentOf(new filters_1.MethodFilter()
    .and(new filters_1.ModifierFilter(typescript_1.default.SyntaxKind.PublicKeyword))
    .and(new filters_1.ModifierFilter(typescript_1.default.SyntaxKind.AsyncKeyword)));
exports.default = (0, transformer_1.transformer)(testFilter);
