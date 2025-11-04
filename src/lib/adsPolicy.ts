export const AD_ALLOWED_PATHS = ["/", "/builder", "/templates"];



export function isAdAllowedPath(pathname: string) {

  return AD_ALLOWED_PATHS.includes(pathname);

}
