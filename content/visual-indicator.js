class VisualIndicator {
  constructor() {
    this.el = null;
  }

  show(layoutName) {
    if (!this.el) this.create();
    const label = 'Bn';
    this.el.textContent = label + (this.active ? '' : '');
    this.el.classList.add('bijoy-ime-indicator--visible');
  }

  hide() {
    if (this.el) {
      this.el.classList.remove('bijoy-ime-indicator--visible');
    }
  }

  setActive(active) {
    this.active = active;
    if (active) {
      this.el.classList.add('bijoy-ime-indicator--active');
    } else {
      this.el.classList.remove('bijoy-ime-indicator--active');
    }
  }

  create() {
    this.el = document.createElement('div');
    this.el.className = 'bijoy-ime-indicator';
    this.el.textContent = 'Bn';
    document.body.appendChild(this.el);
  }

  remove() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
    }
  }
}
