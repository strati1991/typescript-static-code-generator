import ts, {SyntaxKind} from 'typescript';
import {Node} from './node';

class ClassDeclarationClass {
  kind = SyntaxKind.ClassDeclaration;
}
export const ClassDeclarationNode = () => {
  return Node(new ClassDeclarationClass() as ts.ClassDeclaration);
};

class ConstructorDeclarationClass {
  kind = SyntaxKind.Constructor;
}
export const ConstructorDeclarationNode = () => {
  return Node(new ConstructorDeclarationClass() as ts.ConstructorDeclaration);
};

class MethodDeclarationClass {
  kind = SyntaxKind.MethodDeclaration;
}
export const MethodDeclarationNode = () => {
  return Node(new MethodDeclarationClass() as ts.MethodDeclaration);
};

class BlockClass {
  kind = SyntaxKind.Block;
}
export const BlockNode = () => {
  return Node(new BlockClass() as ts.Block);
};
