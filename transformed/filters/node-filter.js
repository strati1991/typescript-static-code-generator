"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFilter = void 0;
class NodeFilter {
    _instanceCopy() {
        return Object.setPrototypeOf(Object.assign({}, this), NodeFilter.prototype);
    }
    _withNewFilter(newFilter) {
        const returnNodeFilter = this._instanceCopy();
        returnNodeFilter.filter = newFilter;
        return returnNodeFilter;
    }
    and(filter) {
        return this._withNewFilter((node) => {
            return this.filter(node) && filter.filter(node);
        });
    }
    or(filter) {
        return this._withNewFilter((node) => {
            return this.filter(node) || filter.filter(node);
        });
    }
    isParentOf(childFilter) {
        this._childFilter = childFilter;
        return this;
    }
    get child() {
        return this._childFilter;
    }
}
exports.NodeFilter = NodeFilter;
