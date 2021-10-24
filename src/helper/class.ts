import ts from 'typescript';

export const ClassMembersHelper = (
  classNode: ts.ClassDeclaration,
  typeChecker: ts.TypeChecker
) => {
  const _classMembersHelper = (() => {
    let _members = classNode.members.map(member => member);
    const hasModifier = (hasModifier: ts.ModifierSyntaxKind) => {
      _members = _members.filter(member =>
        member.modifiers?.map(modifier => modifier.kind).includes(hasModifier)
      );
      return _classMembersHelper;
    };

    const hasNotModifier = (hasModifier: ts.ModifierSyntaxKind) => {
      _members = _members.filter(
        member => !member.modifiers?.map(modifier => modifier.kind).includes(hasModifier)
      );
      return _classMembersHelper;
    };
    const matchesType = (regex: RegExp) => {
      _members = _members.filter(member => {
        const type = typeChecker.typeToString(typeChecker.getTypeAtLocation(member));
        return regex.test(type);
      });
      return _classMembersHelper;
    };
    const notMatchesType = (regex: RegExp) => {
      _members = _members.filter(member => {
        const type = typeChecker.typeToString(typeChecker.getTypeAtLocation(member));
        return !regex.test(type);
      });
      return _classMembersHelper;
    };

    const areClassOrInterface = () => {
      _members = _members.filter(member => {
        return typeChecker.getTypeAtLocation(member).isClassOrInterface();
      });
      return _classMembersHelper;
    };

    const areNotClassOrInterface = () => {
      _members = _members.filter(member => {
        return !typeChecker.getTypeAtLocation(member).isClassOrInterface();
      });
      return _classMembersHelper;
    };

    const typeDeclarationIsInPackage = (packageName: RegExp) => {
      _members = _members.filter(member => {
        const type = typeChecker.getTypeAtLocation(member);
        if (!type.aliasSymbol) {
          return false;
        } else if (
          type.aliasSymbol.declarations &&
          type.aliasSymbol.declarations.length > 0
        ) {
          const sourceFilename =
            type.aliasSymbol.declarations[0].getSourceFile().fileName;
          const lastNodeModulesPart =
            /(node_modules)(?!.*\1)\/(@[\w-]+\/[\w-]+|[\w-]+)\//g.exec(sourceFilename);
          if (lastNodeModulesPart && 2 in lastNodeModulesPart) {
            return packageName.test(lastNodeModulesPart[2]);
          }
          return false;
        }
        return false;
      });
      return _classMembersHelper;
    };

    const members = () => {
      return _members;
    };
    return {
      members,
      hasModifier,
      hasNotModifier,
      matchesType,
      notMatchesType,
      areClassOrInterface,
      areNotClassOrInterface,
      typeDeclarationIsInPackage,
    };
  })();
  return _classMembersHelper;
};
