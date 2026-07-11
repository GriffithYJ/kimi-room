# DEMO_PLAN_v2 — 全局导航重构

> 需求范围：删除 heartbeat 模块返回键、全局左上角返回上一级、底部返回主界面按钮居中。
> 当前状态：**三个需求已全部实现**，本文档记录实现细节与验证标准。

---

## 1. 核心功能

### 1.1 删除 heartbeat 模块返回键

**目标**：heartbeat 页面不显示模块自带的返回按钮，统一由全局 [`TopBackBtn`](src/components/TopBackBtn.tsx) 提供返回功能。

**现状分析**：

| 项目 | 详情 |
|------|------|
| 组件 | [`HeartbeatClient`](src/components/heartbeat/HeartbeatClient.tsx) |
| 实现方式 | 第47行 `<KimiTopNav ... hideBack />` — `hideBack` 属性已传递 |
| 效果 | [`KimiTopNav`](src/components/mucha/KimiPage.tsx) 第87-103行：当 `hideBack=true` 时，`!hideBack` 条件为 `false`，内嵌的 `<Link>` 返回按钮不被渲染 |
| 状态 | ✅ 已完成 |

**原理说明**：

[`KimiTopNav`](src/components/mucha/KimiPage.tsx) 是一个灵动岛风格的三段式顶部导航栏，左侧默认渲染一个 Glass 圆形返回按钮（第92-103行）。当调用方传入 `hideBack` 属性时，该内嵌按钮被跳过（第92行 `{!hideBack && (...)}`）。heartbeat 页面利用此机制隐藏模块级返回按钮，将返回职责交给全局 [`TopBackBtn`](src/components/TopBackBtn.tsx)。

### 1.2 全局左上角返回上一级按钮

**目标**：在所有非 `/room` 页面的左上角（StatusBar 时间显示下方）渲染一个返回上级路径的按钮。

**现状分析**：

| 项目 | 详情 |
|------|------|
| 组件 | [`TopBackBtn`](src/components/TopBackBtn.tsx) |
| 注册位置 | [`layout.tsx`](src/app/layout.tsx) 第188行 `<TopBackBtn />` |
| 显示条件 | 第39行：`!mounted \|\| !pathname \|\| pathname === "/room"` 时不渲染 |
| 定位 | 第48行 `top: calc(44px + env(safe-area-inset-top, 0px))` — StatusBar 下方 |
| 导航逻辑 | 第26-31行：通过 `pathname.split("/")` 计算父路径，`router.push(parentPath)` |
| 视觉风格 | 圆形暗金色 Glass 按钮，`‹` 箭头图标，44×44px |
| 状态 | ✅ 已完成 |

**路径计算逻辑**（[`TopBackBtn.tsx`](src/components/TopBackBtn.tsx:26-31)）：

```
当前路径           →  父路径（返回目标）
/room/heartbeat    →  /room
/backstage/settings → /backstage
/room/study/foo    →  /room/study
```

**显示/隐藏规则**：

| 页面路径 | 是否显示 TopBackBtn | 原因 |
|----------|---------------------|------|
| `/room` | ❌ 不显示 | `pathname === "/room"`，第39行 return null |
| `/room/heartbeat` | ✅ 显示 | 非 `/room`，位于 StatusBar 下方 |
| `/room/keepsakes` | ✅ 显示 | 同上 |
| `/backstage` | ✅ 显示 | 同上 |
| `/settings` | ✅ 显示 | 同上 |
| `/chat` | ✅ 显示 | 同上 |

### 1.3 底部返回主界面按钮居中显示

**目标**：在所有非 `/room` 页面的底部中央显示一个返回主界面 `/room` 的按钮。

**现状分析**：

| 项目 | 详情 |
|------|------|
| 组件 | [`BottomHomeBtn`](src/components/BottomHomeBtn.tsx) |
| 注册位置 | [`layout.tsx`](src/app/layout.tsx) 第192行 `<BottomHomeBtn />` |
| 显示条件 | 第30行：`!mounted \|\| pathname === "/room"` 时不渲染 |
| 居中实现 | 第40-41行 `left: "50%"` + `transform: "translateX(-50%)"` |
| 安全区域 | 第39行 `bottom: max(env(safe-area-inset-bottom, 0px), 8px)` |
| 导航行为 | 第26-28行 `router.push("/room")` |
| 视觉风格 | 圆形暗金色 Glass 按钮，`⌂` 图标，44×44px |
| 状态 | ✅ 已完成 |

**Safe Area 兼容性**：

- iOS PWA 全面屏：`env(safe-area-inset-bottom)` 约 34px，按钮在安全区域上方
- iOS 带 Home 键机型：`safe-area-inset-bottom` 为 0，`max(0, 8px)` = 8px 最小间距
- Android 手势导航：`safe-area-inset-bottom` 可能为 0，8px 最小间距防止被手势条遮挡

---

## 2. 页面结构

### 2.1 全局布局架构

当前 [`layout.tsx`](src/app/layout.tsx) 的 body 渲染结构（第181-193行）：

```
<body className="min-h-full flex flex-col">
  ├── <EntryMotion />           (开屏动画)
  ├── <GrainOverlay />          (噪点纹理)
  ├── <RegisterSW />            (Service Worker)
  ├── <PullToRefresh />         (下拉刷新)
  ├── <SwipeBack />             (滑动返回)
  │
  ├── <StatusBar />             ← fixed top, 时间 HH:MM
  ├── <TopBackBtn />            ← fixed top-left, statusBar 下方 44px, ‹ 返回
  │
  ├── .kimi-page-content        ← flex-1 内容区
  │   └── <PageTransition>
  │       └── {children}        ← 各页面内容
  │
  └── <BottomHomeBtn />         ← fixed bottom-center, ⌂ 回主界面
</body>
```

### 2.2 各层级定位关系

```
┌──────────────────────────────────┐
│  safe-area-inset-top             │  ← iOS 灵动岛 / 状态栏安全区
│  ┌────────────────────────────┐  │
│  │ StatusBar (44px)  HH:MM    │  │  ← z-index 隐式, 固定顶部
│  └────────────────────────────┘  │
│  ┌──┐                            │
│  │‹ │  TopBackBtn (44×44)       │  ← z-index: 101, fixed
│  └──┘  top: 44px + inset-top    │     左上角, StatusBar 下方
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │  .kimi-page-content        │  │  ← flex-1, 可滚动内容区
│  │  (PageTransition > child)  │  │
│  │                            │  │
│  └────────────────────────────┘  │
│         ┌──┐                     │
│         │⌂ │  BottomHomeBtn     │  ← z-index: 101, fixed
│         └──┘  left:50%, 居中     │     bottom-center
│                                  │
│  safe-area-inset-bottom          │  ← iOS Home Indicator / Android 手势条
└──────────────────────────────────┘
```

### 2.3 各页面按钮显示矩阵

| 页面路径 | StatusBar | TopBackBtn | BottomHomeBtn | 模块自带返回键 |
|----------|:---------:|:----------:|:-------------:|:-------------:|
| `/room` | ✅ | ❌ | ❌ | N/A |
| `/room/heartbeat` | ✅ | ✅ | ✅ | ❌ (hideBack) |
| `/room/keepsakes` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/study` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/calendar` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/memory-review` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/disc` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/atlas` | ✅ | ✅ | ✅ | 取决于模块 |
| `/room/graph` | ✅ | ✅ | ✅ | 取决于模块 |
| `/backstage` | ✅ | ✅ | ✅ | 取决于模块 |
| `/backstage/settings` | ✅ | ✅ | ✅ | 取决于模块 |
| `/chat` | ✅ | ✅ | ✅ | N/A |
| `/settings` | ✅ | ✅ | ✅ | N/A |

---

## 3. 数据结构

### 3.1 TopBackBtn 组件接口

**文件**：[`src/components/TopBackBtn.tsx`](src/components/TopBackBtn.tsx)

| 属性/状态 | 类型 | 来源 | 说明 |
|-----------|------|------|------|
| `mounted` | `boolean` (state) | `useState(false)` → `useEffect` | 延迟到客户端挂载后渲染，避免 SSR 时 `usePathname()` 返回 null |
| `pathname` | `string \| null` | `usePathname()` | 当前路由路径，如 `/room/heartbeat` |
| `parentPath` | `string` (memo) | `useMemo` 从 pathname 派生 | 父路径：去掉最后一段。如 `/room/heartbeat` → `/room` |
| 显示条件 | — | `!mounted \|\| !pathname \|\| pathname === "/room"` | 任一为 true 时 return null |
| 定位 (top) | `string` | 硬编码 | `calc(44px + env(safe-area-inset-top, 0px))` |
| 定位 (left) | `string` | 硬编码 | `calc(env(safe-area-inset-left, 0px) + 12px)` |
| z-index | `number` | 硬编码 | `101` |

**Props**：无外部 props，完全自包含。

**导航行为**：
```typescript
// 点击 → router.push(parentPath)
// 示例：
//   /room/heartbeat    → /room
//   /backstage/settings → /backstage
//   /room/study/ch1    → /room/study
```

### 3.2 BottomHomeBtn 组件接口

**文件**：[`src/components/BottomHomeBtn.tsx`](src/components/BottomHomeBtn.tsx)

| 属性/状态 | 类型 | 来源 | 说明 |
|-----------|------|------|------|
| `mounted` | `boolean` (state) | `useState(false)` → `useEffect` | 延迟渲染，同 TopBackBtn |
| `pathname` | `string \| null` | `usePathname()` | 当前路由路径 |
| 显示条件 | — | `!mounted \|\| pathname === "/room"` | /room 页面不显示 |
| 定位 (bottom) | `string` | 硬编码 | `max(env(safe-area-inset-bottom, 0px), 8px)` |
| 定位 (left) | `string` | 硬编码 | `50%` |
| 居中 transform | `string` | 硬编码 | `translateX(-50%)` |
| z-index | `number` | 硬编码 | `101` |

**Props**：无外部 props，完全自包含。

**导航行为**：
```typescript
// 点击 → router.push("/room")
// 所有页面统一跳转到主界面
```

### 3.3 KimiTopNav 的 hideBack 属性

**文件**：[`src/components/mucha/KimiPage.tsx`](src/components/mucha/KimiPage.tsx)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | 必填 | 导航栏标题（ALL CAPS） |
| `sub` | `string?` | — | 副标题（lowercase italic） |
| `icon` | `ReactNode` | `"♡"` | 右侧图标 |
| `iconColor` | `string?` | — | 图标颜色 |
| `P` | `NavPalette` | 必填 | 颜色调色板 |
| `backHref` | `string` | `"/room"` | 返回链接目标 |
| `hideBack` | `boolean` | `false` | 隐藏内嵌返回按钮 |

**Heartbeat 调用**（[`HeartbeatClient.tsx`](src/components/heartbeat/HeartbeatClient.tsx:47)）：
```tsx
<KimiTopNav title="HEARTBEAT" sub={view === "sky" ? "sky" : "score"} P={G} hideBack />
```

### 3.4 路由导航逻辑总结

```
用户操作                    组件           导航方式           目标路径
──────────────────────────────────────────────────────────────────────
点击 TopBackBtn ‹         TopBackBtn     router.push(parent)  父路径（去掉最后一段）
点击 BottomHomeBtn ⌂      BottomHomeBtn  router.push("/room") /room
（模块内嵌返回键已隐藏）    KimiTopNav     hideBack=true       不渲染
```

---

## 4. 开发步骤

> 注意：三个需求在现有代码中已全部实现。以下步骤为验证与确认流程，非新开发任务。

### Step 1：确认 heartbeat 模块返回键已删除

**涉及文件**：[`src/components/heartbeat/HeartbeatClient.tsx`](src/components/heartbeat/HeartbeatClient.tsx)

**检查项**：
1. 第47行确认 `<KimiTopNav ... hideBack />` — `hideBack` 属性存在
2. 确认 [`KimiTopNav`](src/components/mucha/KimiPage.tsx) 第92行 `{!hideBack && (` — 条件正确
3. 导航至 `/room/heartbeat` 页面，确认无模块自带返回键

### Step 2：确认全局左上角返回按钮

**涉及文件**：
- [`src/components/TopBackBtn.tsx`](src/components/TopBackBtn.tsx) — 组件实现
- [`src/app/layout.tsx`](src/app/layout.tsx) — 第188行注册

**检查项**：
1. layout.tsx 第10行 `import { TopBackBtn } from "@/components/TopBackBtn"`
2. layout.tsx 第188行 `<TopBackBtn />` 位于 `<StatusBar />`（第187行）之后
3. TopBackBtn.tsx 第48行定位 `top: calc(44px + env(safe-area-inset-top, 0px))` — StatusBar 下方
4. TopBackBtn.tsx 第39行显示条件 — `/room` 不显示
5. 导航至 `/room/heartbeat`，确认左上角显示 `‹` 按钮
6. 点击 `‹` 按钮，确认导航至 `/room`

### Step 3：确认底部返回主界面按钮居中

**涉及文件**：
- [`src/components/BottomHomeBtn.tsx`](src/components/BottomHomeBtn.tsx) — 组件实现
- [`src/app/layout.tsx`](src/app/layout.tsx) — 第192行注册

**检查项**：
1. layout.tsx 第11行 `import { BottomHomeBtn } from "@/components/BottomHomeBtn"`
2. layout.tsx 第192行 `<BottomHomeBtn />`
3. BottomHomeBtn.tsx 第40行 `left: "50%"`
4. BottomHomeBtn.tsx 第41行 `transform: "translateX(-50%)"` — 水平居中
5. BottomHomeBtn.tsx 第39行 `bottom: max(env(safe-area-inset-bottom, 0px), 8px)` — safe area 兼容
6. BottomHomeBtn.tsx 第30行显示条件 — `/room` 不显示
7. 导航至 `/room/heartbeat`，确认底部中央显示 `⌂` 按钮
8. 点击 `⌂` 按钮，确认导航至 `/room`

### Step 4：确认布局渲染顺序正确

**涉及文件**：[`src/app/layout.tsx`](src/app/layout.tsx)

**检查项**（第181-193行）：
```
<body> 内直接子元素顺序：
  1. <EntryMotion />      (L182)
  2. <GrainOverlay />     (L183)
  3. <RegisterSW />       (L184)
  4. <PullToRefresh />    (L185)
  5. <SwipeBack />        (L186)
  6. <StatusBar />        (L187) ← 最顶层固定元素
  7. <TopBackBtn />       (L188) ← StatusBar 下方
  8. .kimi-page-content   (L189-191) ← 内容区
  9. <BottomHomeBtn />    (L192) ← 底部居中
```

### Step 5：移动端兼容性验证

**检查项**：
1. iOS Safari PWA — TopBackBtn 不被灵动岛遮挡
2. iOS Safari PWA — BottomHomeBtn 不被 Home Indicator 遮挡
3. Android Chrome PWA — BottomHomeBtn 不被手势导航条遮挡
4. iPhone SE（非全面屏）— 两按钮均正常显示

---

## 5. 验收标准

### 5.1 删除 heartbeat 返回键

| # | 验收项 | 预期结果 | 测试方法 |
|---|--------|----------|----------|
| 1.1 | `/room/heartbeat` 页面无模块内嵌返回键 | KimiTopNav 左侧无 `‹` Glass 按钮 | 视觉检查 |
| 1.2 | 其他使用 KimiTopNav 的模块不受影响 | 未传 `hideBack` 的模块仍然显示内嵌返回键 | 检查其他模块页面 |
| 1.3 | `hideBack` 不影响 KimiTopNav 的标题/图标渲染 | 标题 "HEARTBEAT" 和右侧 `♡` 图标正常显示 | 视觉检查 |

### 5.2 全局左上角返回按钮

| # | 验收项 | 预期结果 | 测试方法 |
|---|--------|----------|----------|
| 2.1 | 非 `/room` 页面左上角显示 `‹` 按钮 | StatusBar 时间下方 44px 处可见圆形 `‹` 按钮 | 视觉检查 |
| 2.2 | `/room` 页面不显示 `‹` 按钮 | 主界面无 TopBackBtn | 视觉检查 |
| 2.3 | 从 `/room/heartbeat` 点击 `‹` | 导航至 `/room` | 功能测试 |
| 2.4 | 从 `/backstage/settings` 点击 `‹` | 导航至 `/backstage` | 功能测试 |
| 2.5 | TopBackBtn 不被 StatusBar 遮挡 | 按钮完整可见在时间下方 | 视觉检查 |
| 2.6 | iOS 灵动岛机型 TopBackBtn 不被遮挡 | `safe-area-inset-top` 正确偏移 | 真机测试 |

### 5.3 底部返回主界面按钮居中

| # | 验收项 | 预期结果 | 测试方法 |
|---|--------|----------|----------|
| 3.1 | 非 `/room` 页面底部中央显示 `⌂` 按钮 | 底部水平居中可见圆形 `⌂` 按钮 | 视觉检查 |
| 3.2 | `/room` 页面不显示 `⌂` 按钮 | 主界面无 BottomHomeBtn | 视觉检查 |
| 3.3 | 从任意子页面点击 `⌂` | 导航至 `/room` | 功能测试 |
| 3.4 | BottomHomeBtn 水平居中 | 按钮中心与视口中心对齐 | `left: 50%` + `translateX(-50%)` |
| 3.5 | 底部 safe area 兼容 | iOS PWA 和 Android 手势导航下不被遮挡 | 真机测试 |
| 3.6 | 页面内容不被 BottomHomeBtn 遮挡 | 内容区底部留有足够空间 | 滚动页面到底部检查 |

### 5.4 综合测试场景

| # | 场景 | 操作 | 预期结果 |
|---|------|------|----------|
| 4.1 | 主界面 → heartbeat → 返回 | `/room` → 点击 heartbeat → 点击 `‹` | 回到 `/room` |
| 4.2 | 主界面 → heartbeat → 回主界面 | `/room` → 点击 heartbeat → 点击 `⌂` | 回到 `/room` |
| 4.3 | 主界面 → heartbeat → 切换 sky/score | 在 heartbeat 内切换视图 | TopBackBtn 和 BottomHomeBtn 保持显示 |
| 4.4 | 深度导航返回 | `/room/study/ch1` → 点击 `‹` | 回到 `/room/study` |
| 4.5 | `/room` 页面 | 直接访问 `/room` | TopBackBtn 和 BottomHomeBtn 均不显示 |
| 4.6 | iOS PWA 后台恢复 | bfcache restore | TopBackBtn 和 BottomHomeBtn 正确重新渲染 |

---

## 附录 A：涉及文件清单

| 文件 | 角色 | 说明 |
|------|------|------|
| [`src/app/layout.tsx`](src/app/layout.tsx) | 全局布局 | 第187-192行注册 StatusBar / TopBackBtn / BottomHomeBtn |
| [`src/components/TopBackBtn.tsx`](src/components/TopBackBtn.tsx) | 左上角返回按钮 | 全局固定，位于 StatusBar 下方 |
| [`src/components/BottomHomeBtn.tsx`](src/components/BottomHomeBtn.tsx) | 底部居中回主界面按钮 | 全局固定，底部水平居中 |
| [`src/components/heartbeat/HeartbeatClient.tsx`](src/components/heartbeat/HeartbeatClient.tsx) | heartbeat 模块 | 第47行 `hideBack` 隐藏模块内嵌返回键 |
| [`src/components/mucha/KimiPage.tsx`](src/components/mucha/KimiPage.tsx) | KimiTopNav 组件 | 第63-146行，`hideBack` 属性控制内嵌返回键 |
| [`src/components/StatusBar.tsx`](src/components/StatusBar.tsx) | 顶部时间栏 | 44px 高度，TopBackBtn 定位参考线 |

## 附录 B：关键设计决策

1. **全局导航 vs 模块内嵌导航**：采用全局 TopBackBtn + BottomHomeBtn 替代各模块自行实现的返回按钮，确保导航行为一致，减少重复代码。

2. **TopBackBtn 使用父路径而非固定 `/room`**：允许深度导航场景（如 `/room/study/ch1` → `/room/study`）的渐进式返回，而非一刀切退回主界面。BottomHomeBtn 则固定跳转 `/room` 作为"一键回家"。

3. **useEffect + mounted 延迟渲染**：解决 Next.js App Router 中 `usePathname()` 在 SSR 阶段返回 `null` 的问题。组件在 SSR 时返回 `null`，客户端 hydration 后 `useEffect` 触发 `setMounted(true)` 重新渲染并正确计算路径。

4. **`left: 50%` + `translateX(-50%)` 居中**：标准 CSS 水平居中方案，兼容所有现代浏览器，无需 flexbox 或 grid 父容器。

5. **`max(env(safe-area-inset-bottom), 8px)` 最小安全距离**：在 safe-area-inset-bottom 为 0 的设备上（Android 部分机型、iPhone SE 等）仍保持 8px 最小间距，确保按钮不被系统 UI 遮挡。

---

**文档版本**：v2.0
**创建日期**：2026-06-29
**状态**：已完成（三个需求均已实现）
