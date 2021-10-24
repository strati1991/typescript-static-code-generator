import ts from 'typescript';

export abstract class NodeFilter {
  protected _childFilter: NodeFilter;
  abstract filter(node: ts.Node): boolean;

  private _instanceCopy(): NodeFilter {
    return Object.setPrototypeOf(Object.assign({}, this), NodeFilter.prototype);
  }

  private _withNewFilter(newFilter: (node: ts.Node) => boolean): NodeFilter {
    const returnNodeFilter = this._instanceCopy();
    returnNodeFilter.filter = newFilter;
    return returnNodeFilter;
  }

  and(filter: NodeFilter): NodeFilter {
    return this._withNewFilter((node: ts.Node): boolean => {
      return this.filter(node) && filter.filter(node);
    });
  }

  or(filter: NodeFilter): NodeFilter {
    return this._withNewFilter((node: ts.Node): boolean => {
      return this.filter(node) || filter.filter(node);
    });
  }

  isParentOf(childFilter: NodeFilter): NodeFilter {
    this._childFilter = childFilter;
    return this;
  }

  get child() {
    return this._childFilter;
  }
}
