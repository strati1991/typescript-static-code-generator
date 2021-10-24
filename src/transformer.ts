import ts from 'typescript';
import {NodeFilter} from './filters';

const applyTransformationForFilter = (
  node: ts.Node,
  filter: NodeFilter,
  context: ts.TransformationContext
): ts.Node => {
  if (!filter) {
    return node;
  } else if (filter.filter(node) && !filter.child) {
    return node;
  }

  if (filter.filter(node)) {
    return ts.visitEachChild(
      node,
      child => applyTransformationForFilter(child, filter.child, context),
      context
    );
  } else {
    return ts.visitEachChild(
      node,
      child => applyTransformationForFilter(child, filter, context),
      context
    );
  }
};
export const transformer = (filter: NodeFilter) => {
  return (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker();
    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
      return sourceFile => {
        return ts.visitNode(sourceFile, (node: ts.Node): ts.Node => {
          return applyTransformationForFilter(node, filter, context);
        });
      };
    };

    return transformerFactory;
  };
};
