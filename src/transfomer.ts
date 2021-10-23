import ts from 'typescript';

export const transformer = (
    program: ts.Program
  ): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker();
    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  
      return sourceFile => {
        const visitor = (node: ts.Node): ts.Node => {
            return node;
        }
        return ts.visitNode(sourceFile, visitor);
      }
    }

    return transformerFactory;
}
