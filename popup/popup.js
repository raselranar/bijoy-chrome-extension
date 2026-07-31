document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status-value');
  const toggleBtn = document.getElementById('toggle-btn');

  let active = await getIMEStatus();
  updateUI(active);

  toggleBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'ime-toggle' });
      if (response && typeof response.active === 'boolean') {
        active = response.active;
        updateUI(active);
      }
    } catch (err) {
      statusEl.textContent = 'ERR';
      toggleBtn.disabled = true;
      toggleBtn.textContent = 'Reload page';
    }
  });
});

async function getIMEStatus() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return false;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'ime-status' });
    return response ? response.active : false;
  } catch {
    return false;
  }
}

function updateUI(active) {
  const statusEl = document.getElementById('status-value');
  const toggleBtn = document.getElementById('toggle-btn');

  if (active) {
    statusEl.textContent = 'ON';
    statusEl.style.color = '#0d904f';
    toggleBtn.textContent = 'Turn OFF';
    toggleBtn.classList.add('on');
  } else {
    statusEl.textContent = 'OFF';
    statusEl.style.color = '#888';
    toggleBtn.textContent = 'Turn ON';
    toggleBtn.classList.remove('on');
  }
}
