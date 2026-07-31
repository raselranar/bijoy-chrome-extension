# Bijoy Bayanno Input Tool

A Chrome extension (Manifest V3) that lets you type in Bengali on any webpage using the **Bijoy Bayanno** 52-key keyboard layout. Output is **Unicode** Bengali, following the standard `bn-bijoyUnicode.mim` key mapping.

## Features

- Type Bengali in any text field, textarea, or contenteditable area across all websites.
- Full **Bijoy Bayanno** layout with conjuncts (যুক্তাক্ষর), independent vowels (শবর্ণ), and special characters via the `g` prefix key.
- **Kar-first typing** — press the vowel sign (kar) key first, then the consonant: `d` + `m` → `মি`.
- Toggle on/off with a keyboard shortcut, popup button, or per-tab state.
- Visual "Bn" indicator and toolbar badge show when the IME is active.

## Installation (developer mode)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select this folder.
5. The extension is now installed and ready to use.

## Usage

Press **`Ctrl+Shift+B`** (or `Cmd+Shift+B` on macOS) to toggle the IME, or click the toolbar icon and use the **Turn ON / Turn OFF** button.

When active, type using the Bijoy Bayanno layout:

| Input | Output |
| ----- | ------ |
| `d` `m` | `মি` (kar first, then consonant) |
| `F` `d` | `ই` (independent vowel) |
| `f` `F` | `আ` (kar first + `F`) |
| `j` `g` `j` | `ক্ক` (conjunct via `g` prefix) |
| `g` `f` | `আ` (shorborno via `g` prefix) |
| `j` `x` | `কো` |
| `x` | `ও` |
| `g` `g` | `্‌` (hasanta) |
| `G` | `।` |
| `g` `G` | `॥` |
| `^` | `÷` |
| `*` | `×` |

The complete key map lives in `bijoy-layout.js` and mirrors the `bn-bijoyUnicode.mim` reference.

## Typing rules

- **Kar-first**: vowel signs are typed before the consonant they attach to. `d` + `m` → `মি`, `f` + `k` → `তা`. A kar typed with no following consonant is flushed on the next key (space, punctuation, etc.) or cancelled with `Backspace`.
- **`g` prefix**: `g` is a dead key. Follow it with a consonant to form a conjunct (`j g j` → `ক্ক`), with a vowel to form an independent vowel (`g f` → `আ`), or with `g` for a hasanta (`g g` → `্‌`).
- **Independent vowels** can be typed either as `F` + kar (`F d` → `ই`) or kar + `F` (`d F` → `ই`).

## Project structure

```
├── manifest.json              # MV3 manifest
├── bijoy-layout.js            # Bijoy Bayanno key layout (source of truth for mapping)
├── service-worker.js          # Shortcut + toolbar badge handling
├── content/
│   ├── content.js             # Injects the IME and wires keydown events
│   ├── ime-engine.js          # Core IME engine (composition, g-prefix, kar-first logic)
│   ├── visual-indicator.js    # Floating "Bn" indicator
│   └── content.css            # Indicator styles
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js               # Toolbar popup toggle
└── icons/                     # Extension icons
```

## Limitations

- The IME inserts plain Unicode text directly; it does not use the Chrome Composition API, so it may not play perfectly with spell-check or sites that hook composition events.
- No preedit (the pending kar is only committed once a consonant or flush key is pressed).

## Disclaimer

This is an unofficial, community-made input tool. Bijoy Bayanno is a keyboard layout developed by Mustafa Jabbar; all trademarks belong to their respective owners.
