> English (AI rendering): ./SELF-HOST.en.md

# 自托管持久化 · Self-host persistence

kimi-room 默认把 dashboard（日历 / 睡眠 / 纪念 / 书房 / 记忆世界书 …）存在浏览器
IndexedDB 里：零配置、零后端、换设备会丢。本文给出把这些数据落到**你自己服务器**的两个
参考 adapter——让数据持久化、跨设备同步。它对应 README 里「路 B：我有 VPS，想做完整系统」
的持久化那一层。

这是**参考范例，不是托管服务**。每个部署都是一个人对一个 AI（1v1）、自己的库、自己的
key。

## 先读：单人也要上锁

它会跑在一个公开 URL 上。挡在你私密数据前的只有鉴权这一道门，所以两个 adapter 都默认带锁，
请不要绕过：

- **Supabase**：用项目的 **anon（publishable）key**，不要用 `service_role` key。
  `service_role` 绕过 RLS，等于把整库对全网敞开。RLS 已在 `supabase/schema.sql` 里开好。
- **Prisma**：`/api/store` 每个请求都校验一个 owner 会话 cookie（用 `/api/auth` 凭口令换取）。
  没设 `KIMI_OWNER_PASSWORD` 时它是**锁死**的，不是敞开的。

## 三种存储

|              | idb（默认）  | supabase            | prisma                |
| ------------ | ------------ | ------------------- | --------------------- |
| 数据在哪     | 浏览器本机   | 你的 Supabase       | 你的任意 Postgres     |
| 服务器       | 不需要       | 不需要（浏览器直连）| 需要（Next 服务端）   |
| 鉴权         | —            | Supabase Auth + RLS | owner 口令 cookie     |
| 跨设备同步   | 否           | 是                  | 是                    |
| 依赖         | —            | 默认已带            | 自行装 prisma         |

三者数据形状一致，`/backstage` 的导出 / 导入可在它们之间迁移（在一个里 export 一份，到
另一个 import）。

## A · Supabase（最省事）

1. 建一个 Supabase 项目。
2. SQL editor 跑一遍 `supabase/schema.sql`（建 `store_rows` 表 + RLS 策略）。
3. Authentication 里建一个用户（你自己），按需关掉公开注册。
4. 部署时设这些环境变量：
   ```
   NEXT_PUBLIC_KIMI_ADAPTER=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLISHABLE-KEY
   ```
5. 登录：调 `signInWithPassword(email, password)`（或 `signInWithMagicLink(email)`）。
   helper 在 `src/lib/stores/supabase-auth.ts`，挂一个最小登录表单即可——UI 留给你。
   未登录时 RLS 让你读到空、写被拒（不泄露，但也用不了），所以先登录再用。

`@supabase/supabase-js` 已在依赖里，`npm install` 即得；它按需懒加载，选 idb 的部署在
运行时不会加载它。

## B · Prisma（任意 Postgres / 不绑厂商）

数据走服务端 `/api/store`，key 不进浏览器；适合接自建 Postgres，或你已有的库。

1. 准备一个 Postgres（自建 / Neon / Supabase 的 Postgres 都行）。
2. 装 Prisma（默认不带，按需装）：
   ```
   npm install @prisma/client && npm install -D prisma
   ```
3. 设 `DATABASE_URL`，建表：
   ```
   npx prisma db push      # 按 prisma/schema.prisma 建 store_rows 表
   npx prisma generate
   ```
4. 部署时设这些环境变量：
   ```
   NEXT_PUBLIC_KIMI_ADAPTER=prisma
   DATABASE_URL=<your Postgres connection string>
   KIMI_OWNER_PASSWORD=choose-a-strong-owner-password
   KIMI_SESSION_SECRET=optional-random-salt
   ```
5. 登录：`POST /api/auth { "password": "..." }` 换一个 httpOnly 会话 cookie；之后
   dashboard 的读写会自动带上它。登出用 `DELETE /api/auth`。挂一个最小口令框即可。

说明：Prisma 走服务端原生动态 import，跑在长驻 Node 服务（`next start` / VPS）最稳。上
Vercel / serverless 时，若打包没 trace 到 `@prisma/client`，把它移进 `package.json` 的
dependencies 即可。

## C · core（Tier 2 · 跟记忆同一个后端）

已经为记忆跑了一个 [kimi-core](https://github.com/marikagura/kimi-core) 的部署，可以让 dashboard 也走它——**同一个后端**，不用再单独备一个 DB。

1. 在 kimi-core 上启用 store 扩展：`KIMI_EXTENSIONS=store`，并 `npx prisma migrate deploy`（建 `store_rows` 表）。
2. room 侧设：
   ```
   NEXT_PUBLIC_KIMI_ADAPTER=core
   NEXT_PUBLIC_KIMI_BACKEND=core
   KIMI_CORE_URL=https://your-kimi-core.example.com
   KIMI_API_KEY=...
   ```
3. dashboard 的读写经现成的 `/api/core` 转发到 core 的 `store` 工具（浏览器不持 key）。记忆 RAG 和 dashboard 数据从此走一个 core。

这是「一体托管」那条路——turnkey 一键部署见仓库 README。

## 生成（LLM）要不要也托管

本文只管**数据持久化**。聊天生成默认仍走你在 Settings 填的自带 key（浏览器侧）。想把生成
也收到服务端（key 不进浏览器、可计量），那是另一个 `/api` 代理，超出本文范围——记忆检索那条
可参考 `/api/core` 与 [BACKENDS.md](BACKENDS.md)。

## 自己写第三种后端

三个 adapter 都实现同一个 `AdapterBundle`（`src/lib/stores/types.ts`，11 个 store +
blob）。要接 Notion / 别的库，照着 `supabase-adapter.ts` 写一个，在
`src/lib/stores/index.ts` 的 `selectAdapter()` 加一个分支即可。
