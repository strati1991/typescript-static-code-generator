import {Template} from '../template-renderer';

export type ConstructorTemplateVars = Array<string>;

export const constructorTemplate: Template<ConstructorTemplateVars> = (
  templateVars: ConstructorTemplateVars
): string => {
  if (templateVars.length > 0) {
    return `
    if (!this.constructorContext) 
      this.constructorContext = {};
    this.constructorContext = Object.assign(this.constructorContext, {
      ${templateVars.map(key => `${key}: this.${key}`).join(',')}
    });
    `;
  }
  return '';
};

export type MethodContextTemplateVars = {
  packageName: string;
  packageVersion: string;
  methodName: string;
  args: Array<string>;
  constructorContext: boolean;
  className: string;
};
export const methodContextTemplate: Template<MethodContextTemplateVars> = (
  templateVars: MethodContextTemplateVars
): string => {
  return `
  const context = {
    context: {
      packageInfo: {
        name: '${templateVars.packageName}',
        version: '${templateVars.packageVersion}',
      },
      method: '${templateVars.methodName}',
      args: {
        ${templateVars.args.join(',')}
      },
      constructorContext: ${
        templateVars.constructorContext ? 'this.constructorContext' : 'undefined'
      },
    },
    className: '${templateVars.className}',
  };
  `;
};

export type NonPromiseMethodTemplateVars = {
  methodArgs: Array<string>;
};
export const nonPromiseMethodTemplate: Template<NonPromiseMethodTemplateVars> = (
  templateVars: NonPromiseMethodTemplateVars
): string => {
  const params = templateVars.methodArgs.join(',');
  return `
  return ((${params}) => originalMethod())(${params}).withContext(context);
  `;
};

export type PromiseMethodTemplateVars = {
  methodArgs: Array<string>;
};
export const promiseMethodTemplate: Template<PromiseMethodTemplateVars> = (
  templateVars: PromiseMethodTemplateVars
): string => {
  const params = templateVars.methodArgs.join(',');
  return `
  return Promise.resolve((await (async (${params}) => originalMethod())(${params})).withContext(context));
  `;
};
