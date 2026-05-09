/**
 * 下载内容统一授权检查
 *
 * 通过 cookie 判断用户是否已在前端（如介绍页 PasswordGuard）完成密码验证。
 * 所有文件下载 API 共用同一套检查逻辑。
 */

export const DOWNLOAD_AUTH_COOKIE = "site_auth";

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name) result[name] = rest.join("=") || "";
  }
  return result;
}

export function isDownloadAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  return cookies[DOWNLOAD_AUTH_COOKIE] === "1";
}
