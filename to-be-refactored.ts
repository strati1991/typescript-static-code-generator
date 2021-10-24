/* eslint @typescript-eslint/no-var-requires: "off" */

import ts from 'typescript';
import path from 'path';

const getParameters = (
  functionNode: ts.Node,
  sourceFile: ts.SourceFile
): {
  parameters: Array<ts.ParameterDeclaration>;
  contextArgs: Array<ts.ShorthandPropertyAssignment>;
  functionCallArgs: Array<ts.Identifier>;
} => {
  const parameters: Array<ts.ParameterDeclaration> = new Array<ts.ParameterDeclaration>();

  const contextArgs: Array<ts.ShorthandPropertyAssignment> =
    new Array<ts.ShorthandPropertyAssignment>();

  const functionCallArgs: Array<ts.Identifier> = new Array<ts.Identifier>();
  functionNode.forEachChild(parameter => {
    if (ts.isParameter(parameter)) {
      parameter.forEachChild(innerParam => {
        if (ts.isObjectBindingPattern(innerParam)) {
          innerParam.forEachChild(bindingElement => {
            if (ts.isBindingElement(bindingElement)) {
              const parameterName = bindingElement.name.getText(sourceFile);

              parameters.push(
                ts.factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  ts.factory.createIdentifier(parameterName),
                  undefined,
                  undefined,
                  undefined
                )
              );
              functionCallArgs.push(ts.factory.createIdentifier(parameterName));
              contextArgs.push(
                ts.factory.createShorthandPropertyAssignment(
                  ts.factory.createIdentifier(parameterName),
                  undefined
                )
              );
            }
          });
        } else if (ts.isIdentifier(innerParam)) {
          parameters.push(
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              innerParam,
              undefined,
              undefined,
              undefined
            )
          );
          functionCallArgs.push(innerParam);
          contextArgs.push(
            ts.factory.createShorthandPropertyAssignment(innerParam, undefined)
          );
        }
      });
    }
  });
  return {parameters, contextArgs, functionCallArgs};
};

const resultContextTransformer = (
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => {
  const typeChecker = program.getTypeChecker();
  const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    const packageBaseDir = path.dirname(context.getCompilerOptions().baseUrl!);
    const packageJson = require(packageBaseDir + '/package.json');

    return sourceFile => {
      const visitor = (node: ts.Node): ts.Node => {
        if (
          ts.isBlock(node) &&
          ts.isConstructorDeclaration(node.parent) &&
          ts.isClassDeclaration(node.parent.parent)
        ) {
          const contextArgs: Array<ts.PropertyAssignment> =
            new Array<ts.PropertyAssignment>();
          node.parent.parent.forEachChild(classChild => {
            if (ts.isPropertyDeclaration(classChild)) {
              if (
                classChild.modifiers &&
                classChild.modifiers
                  .filter(
                    node =>
                      node.kind ===
                      ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword).kind
                  )
                  .filter(
                    node =>
                      node.kind !==
                      ts.factory.createModifier(ts.SyntaxKind.StaticKeyword).kind
                  ).length > 0
              ) {
                let skipRegexProperty = false;
                classChild.forEachChild(propertyChild => {
                  if (ts.isRegularExpressionLiteral(propertyChild)) {
                    skipRegexProperty = true;
                  }
                });
                if (skipRegexProperty) return;
                const type = typeChecker.getTypeAtLocation(classChild.name);
                let innerNodeModulesPath = undefined;
                if (type.symbol) {
                  const sourceFilename =
                    type.symbol.declarations[0].getSourceFile().fileName;
                  innerNodeModulesPath = sourceFilename.substring(
                    sourceFilename.lastIndexOf('node_modules')
                  );
                }

                if (!innerNodeModulesPath && classChild.type) {
                  const aliasSymbol = typeChecker.getTypeFromTypeNode(
                    classChild.type
                  ).aliasSymbol;

                  if (aliasSymbol) {
                    const sourceFilename =
                      aliasSymbol.declarations[0].getSourceFile().fileName;
                    innerNodeModulesPath = sourceFilename.substring(
                      sourceFilename.lastIndexOf('node_modules')
                    );
                  }
                }

                if (
                  innerNodeModulesPath &&
                  (innerNodeModulesPath.indexOf('/utility/') !== -1 ||
                    innerNodeModulesPath.indexOf('/infrastructure/') !== -1 ||
                    innerNodeModulesPath.indexOf('/domain/') !== -1)
                ) {
                  classChild.forEachChild(propertyChild => {
                    if (ts.isIdentifier(propertyChild)) {
                      contextArgs.push(
                        ts.factory.createPropertyAssignment(
                          propertyChild,
                          ts.factory.createPropertyAccessExpression(
                            ts.factory.createPropertyAccessExpression(
                              ts.factory.createThis(),
                              propertyChild
                            ),
                            ts.factory.createIdentifier('constructorContext')
                          )
                        )
                      );
                    }
                  });
                } else if (!type.isClassOrInterface()) {
                  classChild.forEachChild(propertyChild => {
                    if (ts.isIdentifier(propertyChild)) {
                      contextArgs.push(
                        ts.factory.createPropertyAssignment(
                          propertyChild,
                          ts.factory.createPropertyAccessExpression(
                            ts.factory.createThis(),
                            propertyChild
                          )
                        )
                      );
                    }
                  });
                }
              }
            }
          });
          const constructorContextIfAssignment = ts.factory.createIfStatement(
            ts.factory.createPrefixUnaryExpression(
              ts.SyntaxKind.ExclamationToken,
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                ts.factory.createIdentifier('constructorContext')
              )
            ),
            ts.factory.createExpressionStatement(
              ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createThis(),
                  ts.factory.createIdentifier('constructorContext')
                ),
                ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                ts.factory.createObjectLiteralExpression([], false)
              )
            ),
            undefined
          );

          const constructorContextAssignment = ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                ts.factory.createIdentifier('constructorContext')
              ),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier('Object'),
                  ts.factory.createIdentifier('assign')
                ),
                undefined,
                [
                  ts.factory.createPropertyAccessExpression(
                    ts.factory.createThis(),
                    ts.factory.createIdentifier('constructorContext')
                  ),
                  ts.factory.createObjectLiteralExpression(contextArgs, true),
                ]
              )
            )
          );

          const constructorChildren = new Array<ts.Statement>();
          node.forEachChild(blockChild => {
            if (ts.isExpressionStatement(blockChild)) {
              constructorChildren.push(blockChild);
            }
          });
          if (contextArgs.length > 0) {
            constructorChildren.push(constructorContextIfAssignment);
            constructorChildren.push(constructorContextAssignment);
          }

          return ts.factory.updateBlock(node, constructorChildren);
        } else if (
          ts.isBlock(node) &&
          ts.isMethodDeclaration(node.parent) &&
          ts.isClassDeclaration(node.parent.parent)
        ) {
          const functionNode = node.parent;

          const returnType = functionNode.forEachChild(child => {
            if (ts.isTypeReferenceNode(child)) {
              return child;
            }
          });

          if (!returnType) {
            return ts.visitEachChild(node, visitor, context);
          }
          const primaryReturnType = returnType.typeName.getText(sourceFile);
          if (
            primaryReturnType !== 'Result' &&
            primaryReturnType !== 'FailureResult' &&
            primaryReturnType !== 'EmptyResult' &&
            primaryReturnType !== 'SuccessResult' &&
            primaryReturnType !== 'Promise'
          )
            return ts.visitEachChild(node, visitor, context);
          if (primaryReturnType === 'Promise') {
            const innerChild = returnType.getChildAt(2);
            if (innerChild.kind === ts.SyntaxKind.SyntaxList) {
              const innerType = innerChild.getChildAt(0);
              if (ts.isTypeReferenceNode(innerType)) {
                const innerTypeString = innerType.typeName.getText(sourceFile);
                if (
                  innerTypeString !== 'Result' &&
                  innerTypeString !== 'EmptyResult' &&
                  innerTypeString !== 'FailureResult' &&
                  innerTypeString !== 'SuccessResult'
                ) {
                  return ts.visitEachChild(node, visitor, context);
                }
              } else {
                return ts.visitEachChild(node, visitor, context);
              }
            } else {
              return ts.visitEachChild(node, visitor, context);
            }
          }

          const {parameters, contextArgs, functionCallArgs} = getParameters(
            functionNode,
            sourceFile
          );

          const contextNode = ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
              [
                ts.factory.createVariableDeclaration(
                  ts.factory.createIdentifier('context'),
                  undefined,
                  undefined,
                  ts.factory.createObjectLiteralExpression(
                    [
                      ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier('context'),
                        ts.factory.createObjectLiteralExpression(
                          [
                            ts.factory.createPropertyAssignment(
                              ts.factory.createIdentifier('packageInfo'),
                              ts.factory.createObjectLiteralExpression(
                                [
                                  ts.factory.createPropertyAssignment(
                                    ts.factory.createIdentifier('name'),
                                    ts.factory.createStringLiteral(packageJson.name)
                                  ),
                                  ts.factory.createPropertyAssignment(
                                    ts.factory.createIdentifier('version'),
                                    ts.factory.createStringLiteral(packageJson.version)
                                  ),
                                ],
                                true
                              )
                            ),
                            ts.factory.createPropertyAssignment(
                              ts.factory.createIdentifier('method'),
                              ts.factory.createStringLiteral(
                                functionNode.name.getText(sourceFile)
                              )
                            ),
                            ts.factory.createPropertyAssignment(
                              ts.factory.createIdentifier('args'),
                              ts.factory.createObjectLiteralExpression(contextArgs, true)
                            ),
                            !functionNode.modifiers ||
                            functionNode.modifiers
                              .map(node => node.kind)
                              .includes(
                                ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)
                                  .kind
                              )
                              ? ts.factory.createPropertyAssignment(
                                  ts.factory.createIdentifier('constructorContext'),
                                  ts.factory.createIdentifier('undefined')
                                )
                              : ts.factory.createPropertyAssignment(
                                  ts.factory.createIdentifier('constructorContext'),
                                  ts.factory.createPropertyAccessExpression(
                                    ts.factory.createThis(),
                                    ts.factory.createIdentifier('constructorContext')
                                  )
                                ),
                          ],
                          true
                        )
                      ),
                      ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier('className'),
                        ts.factory.createStringLiteral(
                          node.parent.parent.name!.getText(sourceFile)
                        )
                      ),
                    ],
                    true
                  )
                ),
              ],
              ts.NodeFlags.Const
            )
          );

          const isAsync = functionNode.modifiers
            ? functionNode.modifiers
                .map(modifier => {
                  return modifier.getText(sourceFile);
                })
                .join(',')
                .indexOf('async') !== -1
            : false;
          if (isAsync) {
            const arrowReturnStatement = ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createIdentifier('Promise'),
                  ts.factory.createIdentifier('resolve')
                ),
                undefined,
                [
                  ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                      ts.factory.createParenthesizedExpression(
                        ts.factory.createAwaitExpression(
                          ts.factory.createCallExpression(
                            ts.factory.createParenthesizedExpression(
                              ts.factory.createArrowFunction(
                                [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
                                undefined,
                                parameters,
                                returnType,
                                ts.factory.createToken(
                                  ts.SyntaxKind.EqualsGreaterThanToken
                                ),
                                node
                              )
                            ),
                            undefined,
                            functionCallArgs
                          )
                        )
                      ),
                      ts.factory.createIdentifier('withContext')
                    ),
                    undefined,
                    [ts.factory.createIdentifier('context')]
                  ),
                ]
              )
            );

            return ts.factory.updateBlock(node, [contextNode, arrowReturnStatement]);
          } else {
            const arrowReturnStatement = ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  ts.factory.createCallExpression(
                    ts.factory.createArrowFunction(
                      undefined,
                      undefined,
                      parameters,
                      returnType,
                      ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      node
                    ),
                    undefined,
                    functionCallArgs
                  ),
                  ts.factory.createIdentifier('withContext')
                ),
                undefined,
                [ts.factory.createIdentifier('context')]
              )
            );
            return ts.factory.updateBlock(node, [contextNode, arrowReturnStatement]);
          }
        }
        return ts.visitEachChild(node, visitor, context);
      };
      return ts.visitNode(sourceFile, visitor);
    };
  };
  return transformerFactory;
};

export default resultContextTransformer;
