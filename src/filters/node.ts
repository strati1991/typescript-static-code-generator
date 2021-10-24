import ts from 'typescript';
import {IModifier} from './modifier';

export type filterArgs = {node: ts.Node; typeChecker: ts.TypeChecker};
export interface INode<T extends ts.Node = ts.Node> {
  filter: (node: filterArgs) => boolean;
  withModifier: (modifier: IModifier<T>) => INode<T>;
  contains: <G extends ts.Node>(node: INode<G>) => INode<G>;
  child: () => INode | undefined;
  kind: () => ts.SyntaxKind;
  modifiers: () => Array<IModifier<T>>;
}

export const Node = <T extends ts.Node>(forNode: T): INode<T> => {
  const _node: INode<T> = (() => {
    let _modifiers = new Array<IModifier<T>>();
    let _child: INode | undefined = undefined;
    const filter = (args: filterArgs): boolean => {
      let returnValue = forNode.kind === args.node.kind;
      if (_modifiers.length == 0) {
        return returnValue;
      }
      _modifiers.forEach(modifier => {
        returnValue = returnValue && modifier.filter(args);
      });
      return returnValue;
    };

    const withModifier = (modifier: IModifier<T>): INode => {
      _modifiers.push(modifier);
      return _node;
    };

    const contains = <G extends ts.Node>(child: INode<G>): INode<G> => {
      _child = child;
      return _node;
    };

    const child = (): INode | undefined => {
      return _child;
    };

    const kind = (): ts.SyntaxKind => {
      return forNode.kind;
    };

    const modifiers = (): Array<IModifier<T>> => {
      return _modifiers;
    };

    return {
      modifiers,
      filter,
      withModifier,
      contains,
      child,
      kind,
    };
  })();

  return _node;
};
