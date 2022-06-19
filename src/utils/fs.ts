import path from "path";

export function isSubPath(root: string, subpath: string): boolean {
  const relative = path.relative(root, subpath);
  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}
