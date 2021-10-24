import {ClassMembersHelper} from './../helper';
import ts from 'typescript';
import {ClassDeclarationNode, ConstructorDeclarationNode, BlockNode} from '../filters';
import {transformer} from '../transformer';
import {templateRenderer} from '../template-renderer';
import {constructorTemplate} from './templates';

const nodeJSPackagesRegex = /(@utility\/.*)|(@infrastructure\/.*)|(@domain\/.*)/;

const constructorBlockFilter = ClassDeclarationNode().contains(
  ConstructorDeclarationNode().contains(BlockNode())
);

export const constructorTransformer: transformer<ts.Block> = {
  filter: constructorBlockFilter,
  transform: (block, filteredParentNodes: Array<ts.Node>, _1, _2, typeChecker) => {
    if (!ts.isClassDeclaration(filteredParentNodes[0])) {
      return block;
    }
    const classDeclaration = filteredParentNodes[0];

    const contextArgs: string[] = [];

    ClassMembersHelper(classDeclaration, typeChecker)
      .hasModifier(ts.SyntaxKind.ReadonlyKeyword)
      .hasNotModifier(ts.SyntaxKind.StaticKeyword)
      .areClassOrInterface()
      .notMatchesType(/RegEx/)
      .typeDeclarationIsInPackage(nodeJSPackagesRegex)
      .members()
      .forEach(readonlyMemberFromOurPackages => {
        if (ts.isPropertyDeclaration(readonlyMemberFromOurPackages)) {
          contextArgs.push(readonlyMemberFromOurPackages.name.getText());
        }
      });

    ClassMembersHelper(classDeclaration, typeChecker)
      .hasModifier(ts.SyntaxKind.ReadonlyKeyword)
      .hasNotModifier(ts.SyntaxKind.StaticKeyword)
      .areNotClassOrInterface()
      .notMatchesType(/RegEx/)
      .members()
      .forEach(readonlyNotObjectMember => {
        if (ts.isPropertyDeclaration(readonlyNotObjectMember)) {
          contextArgs.push(readonlyNotObjectMember.name.getText());
        }
      });

    const constructorTemplatedRendered = templateRenderer(
      constructorTemplate,
      contextArgs
    );

    const newBlockEntries = Array.from(block.statements).concat(
      Array.from(constructorTemplatedRendered)
    );

    return ts.factory.updateBlock(block, newBlockEntries);
  },
};
