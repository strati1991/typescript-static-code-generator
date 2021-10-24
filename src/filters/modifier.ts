import ts from 'typescript';
import {filterArgs} from './node';
export interface IModifier<T extends ts.Node> {
  filter: (args: filterArgs) => boolean;
}
export const Modifier = <T extends ts.Node>(
  logicOperator: 'and' | 'or' | 'not',
  modifiers: ts.ModifierSyntaxKind[]
): IModifier<T> => {
  const filter = ({node}: filterArgs): boolean => {
    if (node.modifiers) {
      let nodeModifiers = node.modifiers.map(modifier => modifier.kind);
      let returnValue = true;

      if (logicOperator === 'or') {
        returnValue = false;
      }

      modifiers.forEach(modifier => {
        const includesModifierPosition = nodeModifiers.indexOf(modifier);

        const includesModifier = includesModifierPosition !== -1;

        if (includesModifier) {
          nodeModifiers = nodeModifiers.splice(includesModifierPosition - 1, 1);
        }

        if (logicOperator === 'and') {
          returnValue = returnValue && includesModifier;
        } else if (logicOperator === 'or') {
          returnValue = returnValue || includesModifier;
        } else if (logicOperator === 'not') {
          returnValue = returnValue && !includesModifier;
        }
      });
      return returnValue;
    }
    return false;
  };
  return {filter};
};
