/**
 * 访问控制常量（客户端/共享）
 *
 * 注意：真实密码与密钥不再硬编码在此，而是放在服务端环境变量中，
 * 通过 /api/auth/verify 进行验证。
 */

/** localStorage 键名 */
export const INTRO_ACCESS_STORAGE_KEY = "intro_access_granted";

/** 下载授权 cookie 名 */
export const DOWNLOAD_AUTH_COOKIE = "site_auth";

/** 需要密码保护的项目页 slug 列表（示例） */
export const PROTECTED_PROJECT_SLUGS = [
  "example-project-1",
  "example-project-2",
] as const;
