(function () {
  const ime = new BijoyIME(BIJOY_LAYOUT);
  const indicator = new VisualIndicator();
  let imeActive = false;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ime-toggle') {
      const nowActive = ime.toggle();
      imeActive = nowActive;
      if (nowActive) {
        indicator.show('Bijoy');
        indicator.setActive(true);
      } else {
        indicator.hide();
        ime.reset();
      }
      sendResponse({ active: nowActive });
      return true;
    }

    if (message.type === 'ime-activate') {
      ime.activate();
      imeActive = true;
      indicator.show('Bijoy');
      indicator.setActive(true);
      sendResponse({ active: true });
      return true;
    }

    if (message.type === 'ime-deactivate') {
      ime.deactivate();
      imeActive = false;
      indicator.hide();
      ime.reset();
      sendResponse({ active: false });
      return true;
    }

    if (message.type === 'ime-status') {
      sendResponse({ active: imeActive });
      return true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!imeActive) return;

    const el = document.activeElement;
    if (!el) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
      ime.handleKeyDown(event);
    }
  }, true);

  window.addEventListener('beforeunload', () => {
    indicator.remove();
  });
})();
