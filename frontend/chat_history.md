# Chat History (For Codex)

Purpose: This document captures the front-end chat history UI structure, styling cues, and related script behavior so Codex can quickly reason about the flow in future edits. Source is `frontend/index.html`.

## DOM Structure (Sidebar)
- Sidebar container: `<aside class="w-80 ...">` (chat history lives here)
- New chat button: `onclick="startNewChat()"`
- History list container: `<div id="history-list" ...>`
- History list header: `<p>Chat History</p>` inside `history-list`

### History Item Template (created by JS)
Each item is a `<div>` appended to `#history-list` by `updateHistoryUI()`:
- `id="display-container-${index}"` holds visible summary row and is clickable:
  - Title: `${chat.title}`
  - Time: `${chat.time}`
  - Optional pin icon when `chat.isPinned === true`
  - Action buttons (pin/rename/delete)
- `id="rename-container-${index}"` is hidden by default and toggled for rename UI:
  - Input field `#rename-input-${index}`
  - Confirm/cancel buttons

## Styling Cues
- Sidebar background: `bg-sidebar-light` / `dark:bg-sidebar-dark`
- History item base class:
  - `group relative p-4 rounded-2xl border cursor-pointer transition-all mb-3`
  - Pinned: `bg-white/20 border-white/20`
  - Not pinned: `bg-white/10 border-white/5 hover:bg-white/20`
- Pin icon:
  - Pinned: yellow + `rotate-45` + `animate-pulse`
  - Not pinned: muted (`text-white/20` with hover)
- Action buttons are hidden until hover: `opacity-0 group-hover:opacity-100`

## Data Model (Local Storage)
- `chatHistory` is stored in `localStorage` under key `chatHistory`.
- Each entry: `{ title, time, messages: [...], isPinned }`.
- `currentChatIndex` is the active conversation index (or `-1` for new).
- `currentMessages` holds messages of active conversation.

## Functions Related to History

### `updateHistoryUI()`
- Reads `chatHistory`.
- Keeps the `Chat History` header.
- Sort order:
  - Pinned first.
  - Within same pin state: by original index desc (latest first).
- Creates each item with `display-container-${index}` and `rename-container-${index}`.

### `togglePinChat(index)`
- Toggles `isPinned`.
- Saves to localStorage.
- Calls `updateHistoryUI()`.

### `showRenameUI(index)` / `cancelRename(index)` / `saveRename(index)`
- Switches display container vs rename container.
- `saveRename()` updates title, saves, then `updateHistoryUI()`.

### `deleteChat(index)`
- Confirm dialog.
- Removes from `chatHistory` and saves.
- If empty: `startNewChat()` else `updateHistoryUI()`.

### `startNewChat()`
- If there are existing messages and no current index, saves current messages as a history entry.
- Resets `currentChatIndex = -1`, `currentMessages = []`.
- Sets default welcome message in `#chat-container`.

### `loadChat(index)`
- Loads a conversation from `chatHistory` into `currentMessages`.
- Clears chat container and re-renders each message.

### `appendMessage(role, content)`
- Pushes message to `currentMessages` and renders it.
- If this is the first user message of a new chat:
  - Creates a new history entry.
  - Sets `currentChatIndex` to the new entry.
  - Saves and calls `updateHistoryUI()`.
- Otherwise updates `chatHistory[currentChatIndex].messages`.

## Event Wiring
- `Start New Chat` button -> `startNewChat()`.
- Each history item row -> `loadChat(index)`.
- Action buttons -> `togglePinChat`, `showRenameUI`, `deleteChat`.

Notes:
- All of the above logic currently lives in `frontend/index.html`.
- If refactoring to separate JS, keep DOM IDs and data shape stable.