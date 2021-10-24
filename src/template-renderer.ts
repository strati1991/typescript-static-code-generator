import ts, {Statement} from 'typescript';
const dummyFileName = 'dummy-template-file.ts';

const recreateStringLiterals = (obj: any) => {
  if (typeof obj === 'object') {
    for (var key in obj) {
      if (typeof obj[key] === 'object' && key !== 'parent') {
        if (ts.isStringLiteral(obj[key])) {
          const literal = (obj[key] as ts.StringLiteral).getText().substring(1);
          obj[key] = ts.factory.createStringLiteral(
            literal.substring(0, literal.length - 1),
            true
          );
        } else {
          recreateStringLiterals(obj[key]);
        }
      }
    }
  }
  return obj;
};

const replaceInnerBlock = (obj: any, innerBlocks: Record<string, ts.Node>) => {
  if (typeof obj === 'object') {
    for (var key in obj) {
      if (typeof obj[key] === 'object' && key !== 'parent') {
        if (ts.isCallExpression(obj[key])) {
          const callExpressionName = (obj[key] as ts.CallExpression).expression.getText();
          if (callExpressionName in innerBlocks) {
            obj[key] = innerBlocks[callExpressionName];
          } else {
            replaceInnerBlock(obj[key], innerBlocks);
          }
        } else {
          replaceInnerBlock(obj[key], innerBlocks);
        }
      }
    }
  }
  return obj;
};

export const templateRenderer = <T>(
  template: Template<T>,
  templateVars: T,
  innerBlocks?: Record<string, ts.Node>
): Statement[] => {
  const newDummmyFileName = dummyFileName + Math.random();
  const sourceFile = ts.createSourceFile(
    newDummmyFileName,
    template(templateVars),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const withRecreatedStringLiterals = sourceFile.statements.map(statement => {
    return recreateStringLiterals(Object.assign({}, statement)) as ts.Statement;
  });

  if (innerBlocks) {
    return withRecreatedStringLiterals.map(statement => {
      return replaceInnerBlock(Object.assign({}, statement), innerBlocks) as ts.Statement;
    });
  }

  return withRecreatedStringLiterals;
};

export type Template<T> = (templateVars: T) => string;
