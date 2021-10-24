import {transformer} from './../transformer';
import {ClassFilter, MethodFilter, ModifierFilter} from '../filters';
import ts from 'typescript';

const testFilter = new ClassFilter().isParentOf(
  new MethodFilter()
    .and(new ModifierFilter(ts.SyntaxKind.PublicKeyword))
    .and(new ModifierFilter(ts.SyntaxKind.AsyncKeyword))
);

export default transformer(testFilter);
