import ts, {Node} from 'typescript';
import {NodeFilter} from './node-filter';

export class MethodFilter extends NodeFilter {
  filter(node: Node): boolean {
    return ts.isMethodDeclaration(node);
  }
}
