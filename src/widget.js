// widget.js

var defaultConfig = {
  locale: 'en-GB',
  target: null,
  autoStart: true,
  doneText: 'Event started!',
  labels: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds'
  },
  showControls: true,
  titleSet: 'Event is set',
  titleUnset: 'Set event date'
};

(function(window, document) {

  function pad(n) { return String(n).padStart(2, '0'); }
  
  function toLocalInputValue(value) {
    if (!value) return '';
    const d = new Date(value);
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function CountdownWidget(element, options) {
    this.element = element;
    this.config = Object.assign({}, defaultConfig, options || {});
    this.timer = null;
    this.init();
  }

  CountdownWidget.prototype.init = function() {
    this.render();
    this.bindEvents();
    if (this.config.autoStart && this.config.target) {
      this.start();
    }
  };

  CountdownWidget.prototype.render = function() {
    const c = this.config;
    
    const controls = c.showControls !== false ? `
      <div class="countdown-header">
        <h1 class="countdown-main-title">🕒 Countdown Timer</h1>
        <div class="countdown-controls">
          <input type="datetime-local" class="countdown-input" placeholder="Select date and time">
          <button class="countdown-button" data-action="set">Set Event</button>
        </div>
      </div>
    ` : '';

    this.element.innerHTML = `
      ${controls}
      <div class="countdown-widget">
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="days">00</div>
          <div class="countdown-label">${c.labels.days}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="hours">00</div>
          <div class="countdown-label">${c.labels.hours}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="minutes">00</div>
          <div class="countdown-label">${c.labels.minutes}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="seconds">00</div>
          <div class="countdown-label">${c.labels.seconds}</div>
        </div>
      </div>
      <div class="countdown-status">
        ${c.target ? c.titleSet : c.titleUnset}
      </div>
    `;

    const input = this.element.querySelector('.countdown-input');
    if (input && c.target) input.value = toLocalInputValue(c.target);
  };

  CountdownWidget.prototype.bindEvents = function() {
    const button = this.element.querySelector('[data-action="set"]');
    const input = this.element.querySelector('.countdown-input');
    const self = this;

    if (button && input) {
      button.addEventListener('click', function() {
        const date = input.value;
        if (date) {
          self.setTarget(date);
          self.start();
        } else {
          alert('Please choose a date and time');
        }
      });
    }
  };

  CountdownWidget.prototype.setTarget = function(target) {
    this.config.target = target;
    const status = this.element.querySelector('.countdown-status');
    if (status) {
      const locale = this.config.locale || 'en-GB';
      const targetDate = new Date(target);
      status.textContent = 'Event: ' + targetDate.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  };

  CountdownWidget.prototype.start = function() {
    if (this.timer) clearInterval(this.timer);
    const targetTime = new Date(this.config.target).getTime();
    const self = this;

    this.timer = setInterval(function() {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance <= 0) {
        self.complete();
        return;
      }

      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);

      self.updateDisplay({ days, hours, minutes, seconds });
    }, 1000);
  };

  CountdownWidget.prototype.updateDisplay = function(t) {
    function pad2(n) { return String(n).padStart(2, '0'); }
    this.element.querySelector('[data-unit="days"]').textContent = pad2(t.days);
    this.element.querySelector('[data-unit="hours"]').textContent = pad2(t.hours);
    this.element.querySelector('[data-unit="minutes"]').textContent = pad2(t.minutes);
    this.element.querySelector('[data-unit="seconds"]').textContent = pad2(t.seconds);
  };

  CountdownWidget.prototype.complete = function() {
    if (this.timer) clearInterval(this.timer);
    const status = this.element.querySelector('.countdown-status');
    if (status) status.textContent = this.config.doneText || 'Event started!';
    this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  CountdownWidget.prototype.destroy = function() {
    if (this.timer) clearInterval(this.timer);
  };

  function init(selector, options) {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    return Array.from(elements).map(function(el) { return new CountdownWidget(el, options); });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-widget="countdown"]').forEach(function(el) {
      const options = el.dataset.options ? JSON.parse(el.dataset.options) : {};
      new CountdownWidget(el, options);
    });
  });

  // старый экспорт
  window.CountdownWidget = {
    CountdownWidget: CountdownWidget,
    init: init
  };

})(window, document);


// --- Глобальный экспорт ---
(function() {
    function TFCountdownWidget(container, config) {
        const element = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!element) {
            console.error('TFCountdownWidget: Container not found');
            return;
        }

        const finalConfig = Object.assign({}, defaultConfig, config);

        // используем твой CountdownWidget
        return new CountdownWidget(element, finalConfig);
    }

    window.TFCountdownWidget = TFCountdownWidget;
    window.initTFCountdown = TFCountdownWidget; // алиас
})();
