import ts from 'typescript';
import {
  ClassDeclarationNode,
  BlockNode,
  MethodDeclarationNode,
  ReturnType,
} from '../filters';
import {transformer} from '../transformer';
import path from 'path';
import {templateRenderer} from '../template-renderer';
import {
  methodContextTemplate,
  MethodContextTemplateVars,
  nonPromiseMethodTemplate,
  NonPromiseMethodTemplateVars,
  promiseMethodTemplate,
} from './templates';

const contextIdentifier = ts.factory.createIdentifier('context');
const withContextIdentifier = ts.factory.createIdentifier('withContext');

const resultTypes = '(Result<.*>|EmptySuccessResult|EmptyResult|FailureResult)';
const promiseRegexString = `(Promise<${resultTypes}>)`;
const resultRegex = new RegExp(`${promiseRegexString}|${resultTypes}`);

const constructorBlockFilter = ClassDeclarationNode().contains(
  MethodDeclarationNode().withModifier(ReturnType(resultRegex)).contains(BlockNode())
);

export const methodTransformer: transformer<ts.Block> = {
  filter: constructorBlockFilter,
  transform: (block, filteredParentNodes: Array<ts.Node>, context, sourceFile, _) => {
    if (!ts.isClassDeclaration(filteredParentNodes[0])) {
      return block;
    }

    const classDeclaration = filteredParentNodes[0];

    if (!ts.isMethodDeclaration(filteredParentNodes[1])) {
      return block;
    }

    const methodDeclaration = filteredParentNodes[1];

    const packageBaseDir = path.dirname(context.getCompilerOptions().baseUrl!);

    const packageJson = require(packageBaseDir + '/package.json');

    const contextArgs: Array<string> = new Array<string>();

    methodDeclaration.parameters.forEach(parameter => {
      parameter.forEachChild(innerParam => {
        if (ts.isObjectBindingPattern(innerParam)) {
          innerParam.forEachChild(bindingElement => {
            if (ts.isBindingElement(bindingElement)) {
              const parameterName = bindingElement.name.getText();
              contextArgs.push(parameterName);
            }
          });
        } else if (ts.isIdentifier(innerParam)) {
          contextArgs.push(innerParam.getText());
        }
      });
    });

    const isStaticMethod =
      methodDeclaration.modifiers !== undefined &&
      methodDeclaration.modifiers
        .map(node => node.kind)
        .includes(ts.factory.createModifier(ts.SyntaxKind.StaticKeyword).kind);

    const contextTemplateVars: MethodContextTemplateVars = {
      packageName: packageJson.name,
      packageVersion: packageJson.version,
      className: classDeclaration.name!.getText(sourceFile),
      constructorContext: isStaticMethod,
      args: contextArgs,
      methodName: methodDeclaration.name.getText(sourceFile),
    };

    const contextTemplateRendered = templateRenderer(
      methodContextTemplate,
      contextTemplateVars
    );

    const templateMethodVars = {
      methodArgs: contextArgs,
    };

    const returnsPromise = methodDeclaration.type
      ? new RegExp(promiseRegexString).test(methodDeclaration.type.getText())
      : false;

    let newMethodBlock;

    if (returnsPromise) {
      newMethodBlock = templateRenderer(promiseMethodTemplate, templateMethodVars, {
        originalMethod: block,
      });
    } else {
      newMethodBlock = templateRenderer(nonPromiseMethodTemplate, templateMethodVars, {
        originalMethod: block,
      });
    }

    const newBlockEntries = Array.from(contextTemplateRendered).concat(newMethodBlock);

    return ts.factory.updateBlock(block, newBlockEntries);
  },
};
