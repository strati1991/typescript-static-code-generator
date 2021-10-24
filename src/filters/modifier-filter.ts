import ts from 'typescript';
import {NodeFilter} from './node-filter';

export class ModifierFilter extends NodeFilter {
  protected readonly modifierSyntaxKind: ts.ModifierSyntaxKind;
  constructor(modifierSyntaxKind: ts.ModifierSyntaxKind) {
    super();
    this.modifierSyntaxKind = modifierSyntaxKind;
  }
  filter(node: ts.MethodDeclaration): boolean {
    if (node.modifiers) {
      return node.modifiers
        .map(modifier => modifier.kind)
        .includes(ts.factory.createModifier(this.modifierSyntaxKind).kind);
    }
    return false;
  }
}
