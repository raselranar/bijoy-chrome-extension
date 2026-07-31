class BijoyIME {
  constructor(layout) {
    this.layout = layout;
    this.active = false;
    this.gPending = false;
  }

  toggle() {
    this.active = !this.active;
    return this.active;
  }

  activate() { this.active = true; }
  deactivate() { this.active = false; }
  reset() { this.gPending = false; }

  handleKeyDown(event) {
    if (!this.active) return false;
    if (event.isComposing || event.keyCode === 229) return false;
    if (event.ctrlKey || event.altKey || event.metaKey) return false;

    const key = event.key;

    if (key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace();
      return true;
    }

    if (key === 'Enter' || key === 'Tab') return false;
    if (key === 'Escape') return true;
    if (key.length !== 1) return false;

    const el = document.activeElement;
    if (!el || !this.isEditable(el)) return false;

    if (this.gPending) {
      this.gPending = false;
      const handled = this.handleGPending(key, el);
      if (handled) event.preventDefault();
      return handled;
    }

    if (key === 'g') {
      event.preventDefault();
      this.gPending = true;
      return true;
    }

    const mapped = this.layout.map[key];
    if (!mapped) return false;

    event.preventDefault();

    if (key === 'x') {
      return this.handleXKey(mapped, el);
    }

    if (this.isVowelSign(key)) {
      const prevChar = this.getCharBeforeCursor(el);
      if (prevChar === '\u0985') {
        const independent = this.layout.independentVowelMap[mapped];
        if (independent) {
          this.replaceLastChar(independent);
          return true;
        }
      }
    }

    this.insertAtCursor(mapped);
    return true;
  }

  handleGPending(key, el) {
    if (this.layout.gPrefixMap[key]) {
      this.insertAtCursor(this.layout.gPrefixMap[key]);
      return true;
    }

    if (key === 'g') {
      this.insertAtCursor('\u09CD\u200C');
      return true;
    }

    if (this.layout.shorbornoKeys.has(key)) {
      if (key === 'G') {
        this.insertAtCursor('\u0965');
        return true;
      }
      if (key === 'x') {
        this.insertAtCursor('\u0993');
        return true;
      }
      const mapped = this.layout.map[key];
      if (mapped) {
        const independent = this.layout.independentVowelMap[mapped];
        if (independent) {
          this.insertAtCursor(independent);
          return true;
        }
        this.insertAtCursor(mapped);
        return true;
      }
    }

    const mapped = this.layout.map[key];
    if (mapped && mapped.length === 1 && this.layout.consonantChars.has(mapped)) {
      this.insertAtCursor('\u09CD' + mapped);
      return true;
    }

    if (mapped) {
      this.insertAtCursor(mapped);
      return true;
    }

    return false;
  }

  handleXKey(mapped, el) {
    const prevChar = this.getCharBeforeCursor(el);
    if (prevChar === '\u0985') {
      this.replaceLastChar('\u0993');
      return true;
    }
    if (prevChar && this.isConsonantChar(prevChar)) {
      this.insertAtCursor('\u09CB');
      return true;
    }
    this.insertAtCursor('\u0993');
    return true;
  }

  isConsonantChar(ch) {
    return this.layout.consonantChars.has(ch);
  }

  isVowelSign(key) {
    return this.layout.vowelSignKeys.has(key);
  }

  handleBackspace() {
    const el = document.activeElement;
    if (!el || !this.isEditable(el)) return;

    if (el.isContentEditable) {
      document.execCommand('delete', false, null);
    } else {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (end > start) {
        el.setRangeText('', start, end, 'end');
      } else if (start > 0) {
        el.setRangeText('', start - 1, start, 'end');
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  getCharBeforeCursor(el) {
    if (el.isContentEditable) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      const offset = range.startOffset;
      if (node.nodeType === 3) {
        return offset > 0 ? node.textContent.substring(offset - 1, offset) : null;
      }
      return null;
    }
    const pos = el.selectionStart;
    if (pos <= 0) return null;
    return (el.value || '').substring(pos - 1, pos);
  }

  isEditable(el) {
    if (!el) return false;
    if (el.tagName === 'INPUT') {
      const type = (el.type || '').toLowerCase();
      return !['password', 'file', 'checkbox', 'radio', 'submit', 'reset', 'button', 'hidden'].includes(type);
    }
    return el.tagName === 'TEXTAREA' || el.isContentEditable;
  }

  insertAtCursor(text) {
    if (!text) return;
    const el = document.activeElement;
    if (!el) return;

    if (el.isContentEditable) {
      document.execCommand('insertText', false, text);
    } else {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.setRangeText(text, start, end, 'end');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  replaceLastChar(replacement) {
    const el = document.activeElement;
    if (!el || !this.isEditable(el)) return;

    if (el.isContentEditable) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      const offset = range.startOffset;
      if (node.nodeType === 3 && offset > 0) {
        const text = node.textContent;
        node.textContent = text.substring(0, offset - 1) + replacement + text.substring(offset);
        const newOffset = offset - 1 + replacement.length;
        range.setStart(node, newOffset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else {
      const pos = el.selectionStart;
      if (pos < 1) return;
      el.setRangeText(replacement, pos - 1, pos, 'end');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
