"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const tranverseChildren = (node, filter, context) => {
    if (!filter) {
        return node;
    }
    else if (filter.filter(node) && !filter.child) {
        console.log(node.getText());
        return node;
    }
    if (filter.filter(node)) {
        return typescript_1.default.visitEachChild(node, child => tranverseChildren(child, filter.child, context), context);
    }
    else {
        return typescript_1.default.visitEachChild(node, child => tranverseChildren(child, filter, context), context);
    }
};
const transformer = (filter) => {
    return (program) => {
        const typeChecker = program.getTypeChecker();
        const transformerFactory = context => {
            return sourceFile => {
                const visitor = (node) => {
                    return tranverseChildren(node, filter, context);
                };
                return typescript_1.default.visitNode(sourceFile, visitor);
            };
        };
        return transformerFactory;
    };
};
exports.transformer = transformer;
