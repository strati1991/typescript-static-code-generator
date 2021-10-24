import {IModifier} from './modifier';
import ts from 'typescript';
import {filterArgs} from './node';

export const ReturnType = <T extends ts.Node>(returnTypeRegex: RegExp): IModifier<T> => {
  const filter = ({node, typeChecker}: filterArgs): boolean => {
    if (ts.isMethodDeclaration(node) && node.type) {
      const methodType = typeChecker.typeToString(
        typeChecker.getTypeAtLocation(node.type)
      );
      return returnTypeRegex.test(methodType);
    }
    return false;
  };
  return {filter};
};
