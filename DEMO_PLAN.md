# iPhone 桌面风格主界面 — 修改计划

> 基于第一轮审查通过后的三个遗留问题，制定修复方案。

---

## 核心功能

- iPhone 桌面风格主界面：每个插件以首字母图标展示
- 状态栏：左上角实时时间，所有页面可见
- 底部导航栏：← 返回主界面、⌂ 回到主界面

---

## 页面结构

```
layout.tsx
├── StatusBar          (fixed top, 时间显示)
├── .kimi-page-content (全局 padding，避开固定导航栏)
│   └── PageTransition > children
└── BottomNav          (fixed bottom, hidden on /room)
    ├── ← Back   — router.push("/room")
    ├── extras   — 子页面可注入额外按钮
    └── ⌂ Home  — router.push("/room")
```

---

## 数据结构

无数据结构变更。所有修改仅涉及组件行为调整。

---

## 问题清单与修复方案

### 问题 1：返回键无法正常使用

**现象**：从主界面进入子模块后，点击底部"← 返回"按钮无响应。

**根因分析**：

[`BottomNav.tsx`](src/components/BottomNav.tsx:42) 中 `canGoBack` 状态在 `useEffect` 中仅初始化一次：

```tsx
const [canGoBack, setCanGoBack] = useState(false);
useEffect(() => {
  setCanGoBack(window.history.length > 1);
}, []);
```

- `BottomNav` 位于 `layout.tsx`，在 Next.js App Router 客户端导航中**不会重新挂载**
- 用户从 `/room` 导航到 `/room/heartbeat` 时，`BottomNav` 从 `null`（`pathname === "/room"` 时跳过）变为渲染，但 `canGoBack` 仍为初始 `false`
- `useEffect([], ...)` 的依赖数组为空，只在首次挂载时执行一次
- `window.history.length > 1` 在 iOS PWA standalone 模式下不可靠

**修复方案**：

将"返回"按钮行为从 `router.back()` 改为 `router.push("/room")`，始终返回桌面。移除 `canGoBack` 状态判断和 `useEffect`，让返回按钮始终可用（在非 `/room` 页面上）。

```tsx
// 修改后
const goBack = useCallback(() => {
  router.push("/room");
}, [router]);
```

### 问题 2：部分应用自带返回按键，需整合

**现象**：Calendar 模块左上角有独立的 `RoomBackBtn`，与底部 `BottomNav` 返回功能重复。

**根因分析**：

[`RoomBackBtn`](src/components/RoomBackBtn.tsx) 是一个 `position: fixed` 的圆形返回按钮，在引入 `BottomNav` 后功能已被底部导航栏覆盖。当前仅 [`RoomCalendar.tsx`](src/components/calendar/RoomCalendar.tsx:7) 仍在使用 `RoomBackBtn`。

**修复方案**：

1. 从 `RoomCalendar.tsx` 中移除 `RoomBackBtn` 的导入和渲染
2. 保留 `RoomBackBtn.tsx` 文件不删除（公共组件库，未来可能用于非导航场景）

### 问题 3：部分手机机型底部操作按键无法正确显示

**现象**：在部分 Android 机型或 iOS 非全面屏机型上，底部导航栏被系统手势条遮挡，或显示位置不正确。

**根因分析**：

[`globals.css`](src/app/globals.css:237) 中 `BottomNav` 的高度计算依赖 `env(safe-area-inset-bottom)`：

```css
height: calc(56px + env(safe-area-inset-bottom));
padding-bottom: env(safe-area-inset-bottom);
```

- 部分 Android 机型 `env(safe-area-inset-bottom)` 返回 `0`，但系统手势条实际占据空间
- iPhone SE 等带 Home 键的机型 `safe-area-inset-bottom` 为 `0`

**修复方案**：

使用 `max()` 函数确保最小安全距离：

```css
/* BottomNav */
padding-bottom: max(env(safe-area-inset-bottom), 8px);

/* .kimi-page-content */
padding-bottom: calc(56px + max(env(safe-area-inset-bottom), 8px));
```

---

## 开发步骤

### Step 1：修复 BottomNav 返回逻辑（15 min）

1. 修改 [`BottomNav.tsx`](src/components/BottomNav.tsx)：
   - 移除 `canGoBack` 状态和 `useEffect`
   - 将 `goBack` 改为 `router.push("/room")`
   - 移除返回按钮的 `disabled` 属性
   - 移除 `canGoBack` 相关的 `useCallback` 依赖

2. 修改 [`globals.css`](src/app/globals.css)：
   - `BottomNav` 的 `padding-bottom` 改为 `max(env(safe-area-inset-bottom), 8px)`
   - `.kimi-page-content` 的 `padding-bottom` 改为 `calc(56px + max(env(safe-area-inset-bottom), 8px))`

### Step 2：移除子模块自带返回按钮（10 min）

1. 修改 [`RoomCalendar.tsx`](src/components/calendar/RoomCalendar.tsx)：
   - 移除 `import { RoomBackBtn } from "@/components/RoomBackBtn"`
   - 移除 JSX 中的 `<RoomBackBtn />` 渲染

2. 全局搜索确认无其他文件使用 `RoomBackBtn`（已确认仅 Calendar 使用）

### Step 3：验收测试（15 min）

1. 桌面浏览器测试：
   - 从主界面进入各子模块，点击"← 返回"回到主界面
   - 点击"⌂ 主页"回到主界面
   - Calendar 页面左上角无独立返回按钮

2. 移动设备测试：
   - iOS Safari PWA 模式下底部导航栏可见且可点击
   - Android 手势导航模式下底部导航栏不被手势条遮挡
   - iPhone SE 等非全面屏机型底部导航栏显示正常

3. 内容可见性检查：
   - 所有页面内容不被 StatusBar 或 BottomNav 遮挡

---

## 验收标准

| # | 验收项 | 预期结果 |
|---|--------|----------|
| 1 | 从主界面进入子模块后点击"← 返回" | 返回主界面 `/room` |
| 2 | 从主界面进入子模块后点击"⌂ 主页" | 返回主界面 `/room` |
| 3 | Calendar 页面 | 左上角无独立返回按钮 |
| 4 | iOS PWA standalone 模式 | 底部导航栏可见、可点击、不被系统 UI 遮挡 |
| 5 | Android 手势导航模式 | 底部导航栏不被手势条遮挡 |
| 6 | iPhone SE 等非全面屏 | 底部导航栏显示正常 |
| 7 | 主界面 `/room` | 底部导航栏不显示 |
| 8 | 页面内容 | 不被 StatusBar 或 BottomNav 遮挡 |

---

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| [`BottomNav.tsx`](src/components/BottomNav.tsx) | 修改 | 返回逻辑改为 `router.push("/room")`，移除 `canGoBack` 状态 |
| [`globals.css`](src/app/globals.css) | 修改 | `padding-bottom` 使用 `max()` 确保最小安全距离 |
| [`RoomCalendar.tsx`](src/components/calendar/RoomCalendar.tsx) | 修改 | 移除 `RoomBackBtn` 导入和渲染 |

---

## 风险与注意事项

1. **`router.push("/room")` vs `router.back()`**：`push` 会在 history 中新增记录，与 iPhone 主屏幕按钮行为一致
2. **`RoomBackBtn.tsx` 保留**：作为公共组件保留在 `src/components/` 中，未来可能用于非导航场景
3. **`max()` CSS 函数**：Chrome 79+, Safari 11.1+, Firefox 75+，2026 年兼容性无问题

---

**文档版本**：v1.1
**创建日期**：2026-06-29
**状态**：已完成

---
---

# v2 — 导航重构 + backstage 图标化 + chat 入口放大

> 基于 v1 完成后的新一轮产品迭代。核心目标：统一全局导航模型，将 backstage 从底部文字链接提升为桌面图标，放大 chat 入口。

---

## 修改内容总览

| # | 修改项 | 说明 |
|---|--------|------|
| 1 | backstage 作为桌面图标 | 与 8 个 room 模块并列显示在主屏幕网格中 |
| 2 | settings 房间布局设定更新 | 控制 9 个模块（8 room + backstage）的显示/隐藏 |
| 3 | 删除 backstage 子页面底部导航文字 | 移除所有 backstage 子页面中残留的"← back to backstage"等文字链接 |
| 4 | 删除 heartbeat/graph 返回按键 | 已在 v1 完成（`hideBack` 已加） |
| 5 | 返回按键移至左上角 | 位于 StatusBar 时间下方，所有非 /room 页面可见 |
| 6 | 回到主界面按钮移至底部居中 | 替代原 BottomNav 左右分布的 ← / ⌂ |
| 7 | 增大 chat 入口图标 | RoseBloomDial / MoonPhaseSvg 尺寸从 56 → 80 |

---

## 页面结构

### 改后全局布局

```
layout.tsx
├── StatusBar              (fixed top, 时间 HH:MM)
├── TopBackBtn             (fixed top-left, 紧接 StatusBar 下方)
│   └── ← 返回上级路径      仅在非 /room 页面显示
├── .kimi-page-content     (全局 padding，避开固定导航)
│   └── PageTransition > children
└── BottomHomeBtn          (fixed bottom-center)
    └── ⌂ 回到主界面        仅在非 /room 页面显示
```

### 主屏幕 /room

```
/room (page.tsx)
├── StatusBar              (时间)
├── Chat Hero              (RoseBloomDial / MoonPhaseSvg, size=80)
│   └── <Link href="/chat">
├── DesktopGrid            (3×3 网格，9 个模块图标)
│   ├── heartbeat, keepsakes, study
│   ├── calendar, memory-review, disc
│   ├── atlas, graph, backstage
│   └── (由 RoomLayoutEditor 控制显示/隐藏)
└── ThemeToggleLink        (底部额外区域)
```

### 子模块页面

```
/room/heartbeat, /backstage/settings, etc.
├── StatusBar              (时间)
├── TopBackBtn             (左上角 ← 返回)
├── 页面内容               (模块自身 UI)
└── BottomHomeBtn          (底部居中 ⌂ 回主界面)
```

---

## 数据结构

### room-blocks.ts 扩展

当前 `ROOM_BLOCKS` 只包含 8 个 `/room/*` 模块。需要将 backstage 也纳入注册表。

```ts
export const ROOM_BLOCKS: RoomBlock[] = [
  { id: "heartbeat",     href: "/room/heartbeat",     name: "Heartbeat",  sub: "& PULSE",        defaultSlot: "tile" },
  { id: "keepsakes",     href: "/room/keepsakes",     name: "Keepsakes",  sub: "& POSTCARDS",    defaultSlot: "tile" },
  { id: "study",          href: "/room/study",          name: "Study",      sub: "& READING",      defaultSlot: "tile" },
  { id: "calendar",      href: "/room/calendar",      name: "Calendar",   sub: "& WELLBEING",    defaultSlot: "tile" },
  { id: "memory-review", href: "/room/memory-review", name: "Memory",     sub: "& REVIEW",       defaultSlot: "tile" },
  { id: "disc",           href: "/room/disc",           name: "Disc",       sub: "& MUSIC",        defaultSlot: "tile" },
  { id: "atlas",          href: "/room/atlas",          name: "Atlas",      sub: "& PASSAGE",      defaultSlot: "tile" },
  { id: "graph",          href: "/room/graph",          name: "Graph",      sub: "& CONSTELLATION",defaultSlot: "tile" },
  { id: "backstage",     href: "/backstage",          name: "Backstage",  sub: "& SETTINGS",     defaultSlot: "tile" },  // 新增
];
```

- 无需新增 `category` 字段，backstage 的 `href` 指向 `/backstage` 即可区分
- `resolveRoom()` / `resolveLayout()` / `serializeLayout()` 无需修改
- `desktop-icons.ts` 的 `buildDesktopIcons()` 自动从 `ROOM_BLOCKS` 派生，新增 backstage 后自动包含
- `LETTER_OVERRIDES` 需新增 `backstage: "B"`

### Cookie 兼容性

- 旧 cookie 格式 `heartbeat:t,keepsakes:t,...,graph:t` 不含 backstage
- `resolveLayout()` 的 fallback 逻辑会自动将缺失模块以 `defaultSlot`（"tile"）追加
- **向后兼容**：升级后旧 cookie 用户自动看到 backstage 图标，无需重置

---

## 导航组件重构

### TopBackBtn（新增组件）

**文件**：`src/components/TopBackBtn.tsx`

**行为**：
- 固定在左上角，位于 StatusBar 下方（`top: calc(44px + env(safe-area-inset-top))`）
- 使用与 BottomNav 相同的 pathname-based parent path 计算逻辑
- 仅在非 `/room` 页面渲染（`pathname === "/room"` 时 return null）
- 视觉：Mucha 暗金色 `‹` 箭头，圆形半透明 Glass 背景

### BottomHomeBtn（新增组件）

**文件**：`src/components/BottomHomeBtn.tsx`

**行为**：
- 固定在底部居中（`bottom: 0`，`left: 50%`，`transform: translateX(-50%)`）
- 使用 `max(env(safe-area-inset-bottom), 8px)` 保证 safe area 兼容
- 点击 `router.push("/room")`
- 仅在非 `/room` 页面渲染
- 视觉：Mucha 暗金色 ⌂ 图标，圆形半透明 Glass 背景

### BottomNav.tsx 处置

- 整个组件废弃，从 `layout.tsx` 中移除 `<BottomNav />` 引用
- 保留文件不删除（可安全删除，无其他引用）
- `globals.css` 中 `.kimi-bottom-nav` / `.kimi-nav-btn` / `.kimi-nav-extras` 样式保留（不主动清理，避免影响其他可能的内联样式引用）

### layout.tsx 修改

```tsx
// 改前
<StatusBar />
<div className="kimi-page-content">
  <PageTransition>{children}</PageTransition>
</div>
<BottomNav />

// 改后
<StatusBar />
<TopBackBtn />
<div className="kimi-page-content">
  <PageTransition>{children}</PageTransition>
</div>
<BottomHomeBtn />
```

---

## chat 入口放大

### room/page.tsx 修改

```tsx
// 改前
<RoseBloomDial day={dayOfMonth} size={56} ... />
<MoonPhaseSvg phase={moon.fraction} size={56} />

// 改后
<RoseBloomDial day={dayOfMonth} size={80} ... />
<MoonPhaseSvg phase={moon.fraction} size={80} />
```

### globals.css 调整

`.kimi-desktop-hero` 的 padding 微调以适配更大的图标：

```css
.kimi-desktop-hero {
  padding: 32px 0 16px;  /* 改前 24px 0 12px */
}
```

---

## backstage 子页面底部导航清理

backstage 子页面（settings, character, ops, architecture）当前依赖全局 BottomNav 提供导航。BottomNav 移除后，它们自动获得 TopBackBtn + BottomHomeBtn。

需额外清理：
- [`settings/page.tsx`](src/app/backstage/(protected)/settings/page.tsx:426) — 注释 `{/* back navigation via global BottomNav */}` 删除
- [`backstage/(protected)/page.tsx`](src/app/backstage/(protected)/page.tsx) — 无需修改（backstage 首页本身无底部导航残留）

---

## 开发步骤

### Step 1：扩展 room-blocks.ts 注册表（5 min）

1. 在 `ROOM_BLOCKS` 数组末尾添加 backstage 条目
2. 在 `desktop-icons.ts` 的 `LETTER_OVERRIDES` 中添加 `backstage: "B"`

### Step 2：创建 TopBackBtn 组件（15 min）

1. 新建 `src/components/TopBackBtn.tsx`
2. 复用 BottomNav 的 pathname-based parent path 逻辑
3. 使用 `usePathname()` 判断是否 `/room`
4. 固定在 StatusBar 下方左侧

### Step 3：创建 BottomHomeBtn 组件（10 min）

1. 新建 `src/components/BottomHomeBtn.tsx`
2. 固定在底部居中（考虑 safe-area-inset-bottom）
3. 使用 `usePathname()` 判断是否 `/room`

### Step 4：修改 layout.tsx（5 min）

1. 替换 `<BottomNav />` 为 `<TopBackBtn />` + `<BottomHomeBtn />`
2. 更新 import

### Step 5：放大 chat 入口（5 min）

1. 修改 `room/page.tsx` 中 RoseBloomDial / MoonPhaseSvg 的 size 从 56 → 80
2. 调整 `.kimi-desktop-hero` 的 padding

### Step 6：更新 globals.css（10 min）

1. 添加 `.kimi-top-back-btn` 样式（position fixed, top-left）
2. 添加 `.kimi-bottom-home-btn` 样式（position fixed, bottom-center）
3. 调整 `.kimi-desktop-hero` padding
4. 更新 `.kimi-page-content` 的 `padding-top`（为 TopBackBtn 预留空间）

### Step 7：清理残留（5 min）

1. 删除 `settings/page.tsx` 中的 "back navigation" 注释
2. 确认无其他文件引用 BottomNav

### Step 8：验收测试（15 min）

---

## 验收标准

| # | 验收项 | 预期结果 |
|---|--------|----------|
| 1 | 主屏幕 `/room` | 显示 9 个图标（含 backstage），3×3 网格 |
| 2 | 主屏幕无 BottomNav | 底部无 ← / ⌂ 导航栏 |
| 3 | 子模块页面左上角 | 显示 ← 返回按钮，位于 StatusBar 下方 |
| 4 | 子模块页面底部居中 | 显示 ⌂ 回到主界面按钮 |
| 5 | 点击 ← 返回 | 跳转到父路径（如 /backstage/settings → /backstage） |
| 6 | 点击 ⌂ 回到主界面 | 跳转到 `/room` |
| 7 | `/room` 页面 | 无 TopBackBtn，无 BottomHomeBtn |
| 8 | chat 入口图标 | 尺寸明显大于 v1（80px vs 56px） |
| 9 | backstage 图标 | 显示字母 "B"，点击跳转 `/backstage` |
| 10 | settings 房间布局 | 可控制 9 个模块的显示/隐藏 |
| 11 | 隐藏 backstage | 主屏幕不显示 backstage 图标，无其他入口 |
| 12 | 旧 cookie 兼容 | 升级后自动显示所有 9 个图标 |
| 13 | iOS PWA 模式 | TopBackBtn 不被 StatusBar 遮挡 |
| 14 | Android 手势导航 | BottomHomeBtn 不被手势条遮挡 |

---

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/lib/room-blocks.ts` | 修改 | 添加 backstage 到 ROOM_BLOCKS |
| `src/lib/desktop-icons.ts` | 修改 | LETTER_OVERRIDES 添加 `backstage: "B"` |
| `src/components/TopBackBtn.tsx` | **新增** | 左上角返回按钮组件 |
| `src/components/BottomHomeBtn.tsx` | **新增** | 底部居中回主界面按钮组件 |
| `src/app/layout.tsx` | 修改 | 替换 BottomNav 为 TopBackBtn + BottomHomeBtn |
| `src/app/room/page.tsx` | 修改 | chat 入口 size 56→80 |
| `src/app/globals.css` | 修改 | 新增 TopBackBtn / BottomHomeBtn 样式，调整 hero padding，调整 page-content padding-top |
| `src/app/backstage/(protected)/settings/page.tsx` | 修改 | 删除残留的 "back navigation" 注释 |
| `src/components/backstage/RoomLayoutEditor.tsx` | 无需修改 | 已支持任意数量模块显示/隐藏 |
| `src/components/BottomNav.tsx` | 废弃 | 从 layout.tsx 移除引用 |

---

## 风险与注意事项

1. **9 图标网格布局**：3×3 网格在移动端刚好一屏显示，无需滚动。平板 4 列模式下 9 个图标会有空位，视觉可接受
2. **backstage 隐藏后的访问**：若用户在 settings 中隐藏了 backstage，则无法从主屏幕进入 backstage。用户可通过直接输入 URL `/backstage` 访问，或在 settings 中重新显示
3. **TopBackBtn 与 KimiTopNav 的 `hideBack`**：各模块的 `KimiTopNav` / `GothicTopNav` 已设置 `hideBack`，不会与 TopBackBtn 冲突
4. **Cookie 向后兼容**：`resolveLayout()` 的 fallback 逻辑确保旧 cookie 自动追加新模块
5. **BottomNav 废弃**：保留文件但不再引用，避免破坏性变更。未来可安全删除
6. **`.kimi-page-content` padding-top**：当前仅 `calc(44px + env(safe-area-inset-top))`，添加 TopBackBtn 后需增加额外高度（TopBackBtn 预估高度 44px），改为 `calc(88px + env(safe-area-inset-top))`

---

**文档版本**：v2.0
**创建日期**：2026-06-29
**状态**：待开发
