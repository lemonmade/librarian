/* @flow */
/* eslint no-unused-vars: 0 */

type ASTNode = Object;

declare class Scope {
  lookup(name: string): ?Scope;
  lookupType(name: string): ?Scope;
  getBindings(): {[key: string]: Array<NodePath>};
  getBinding(name: string): NodePath;
  hasBinding(name: string): bool;
  getTypes(): {[key: string]: Array<NodePath>};
  node: NodePath;
}

declare class NodePath {
  value: (ASTNode | Array<ASTNode>);
  node: ASTNode;
  parent: NodePath;
  parentPath: NodePath;
  scope: Scope;

  get(...x: Array<string|number>): NodePath;
  each(f: (p: NodePath) => any): any;
  map<T>(f: (p: NodePath) => T): Array<T>;
  filter(f: (p: NodePath) => bool): Array<NodePath>;
}

type Babylon = {
  parse: (src: string) => ASTNode;
};
