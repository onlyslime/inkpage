/**
 * 服务端认证配置（仅在服务端运行，如 API Routes）
 *
 * 通过环境变量读取密码与访问密钥，不会泄漏到客户端打包产物中。
 */

export const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "";
export const SITE_ACCESS_KEY = process.env.SITE_ACCESS_KEY ?? "";
