export const AD_ALLOWED_PATHS = ["/", "/builder", "/templates", "/guides", "/examples"];

const AD_ALLOWED_PREFIXES = ["/guides/"];

export function isAdAllowedPath(pathname: string) {
  if (AD_ALLOWED_PATHS.includes(pathname)) return true;
  return AD_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
}
