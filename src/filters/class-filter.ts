import ts, {Node} from 'typescript';
import {NodeFilter} from './node-filter';

export class ClassFilter extends NodeFilter {
  filter(node: Node): boolean {
    return ts.isClassDeclaration(node);
  }
}
