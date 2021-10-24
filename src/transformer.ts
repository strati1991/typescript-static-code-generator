import {INode} from './filters/node';
import ts from 'typescript';

const applyTransformationForFilter = <N extends ts.Node>(
  node: ts.Node,
  filter: INode<N> | undefined,
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  typeChecker: ts.TypeChecker,
  filteredParentNodes: Array<ts.Node>,
  transform: (
    node: N,
    filteredParentNodes: Array<ts.Node>,
    context: ts.TransformationContext,
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker
  ) => ts.Node
): ts.Node => {
  if (!filter) {
    return transform(node as N, filteredParentNodes, context, sourceFile, typeChecker);
  } else if (filter.filter({node, typeChecker}) && filter.child() === undefined) {
    return transform(node as N, filteredParentNodes, context, sourceFile, typeChecker);
  } else if (filter.filter({node, typeChecker})) {
    return ts.visitEachChild(
      node,
      child =>
        applyTransformationForFilter<N>(
          child,
          filter.child(),
          context,
          sourceFile,
          typeChecker,
          filteredParentNodes.concat(node),
          transform
        ),
      context
    );
  } else {
    return ts.visitEachChild(
      node,
      child =>
        applyTransformationForFilter<N>(
          child,
          filter,
          context,
          sourceFile,
          typeChecker,
          filteredParentNodes,
          transform
        ),
      context
    );
  }
};

export const transformerFactory = (transformers: transformer[]) => {
  return (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker();
    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
      return sourceFile => {
        return ts.visitNode(sourceFile, (node: ts.Node): ts.Node => {
          let transformedNode = node;
          transformers.forEach(transformer => {
            transformedNode = applyTransformationForFilter(
              transformedNode,
              transformer.filter,
              context,
              sourceFile,
              typeChecker,
              [],
              transformer.transform
            );
          });
          return transformedNode;
        });
      };
    };

    return transformerFactory;
  };
};

export type transformer<N extends ts.Node = ts.Node> = {
  filter: INode<N> | undefined;
  transform: (
    node: N,
    filteredParentNodes: Array<ts.Node>,
    context: ts.TransformationContext,
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker
  ) => ts.Node;
};
