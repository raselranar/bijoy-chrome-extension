chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-ime') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  await toggleIME(tab);
});

async function toggleIME(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'ime-toggle' });
    if (response && typeof response.active === 'boolean') {
      await chrome.storage.session.set({
        ['ime-tab-' + tab.id]: { active: response.active }
      });
      updateBadge(tab.id, response.active);
    }
  } catch (err) {
    console.log('Content script not ready on this page');
  }
}

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await chrome.storage.session.remove('ime-tab-' + tabId);
});

async function updateBadge(tabId, active) {
  try {
    if (active) {
      await chrome.action.setBadgeText({ tabId, text: 'Bn' });
      await chrome.action.setBadgeBackgroundColor({ tabId, color: '#0d904f' });
    } else {
      await chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (e) {
    /* badge update failed silently */
  }
}
