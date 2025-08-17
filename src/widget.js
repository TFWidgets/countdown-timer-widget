import './widget.css';
import { defaultConfig } from './config';

class CountdownWidget {
  constructor(element, options = {}) {
    this.element = element;
    this.config = { ...defaultConfig, ...options };
    this.timer = null;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    if (this.config.autoStart && this.config.target) {
      this.start();
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="countdown-controls">
        <input type="datetime-local" class="countdown-input" id="eventDate-${this.id}">
        <button class="countdown-button" data-action="set">Set Event</button>
      </div>
      <div class="countdown-widget">
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="days">00</div>
          <div class="countdown-label">${this.config.labels.days}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="hours">00</div>
          <div class="countdown-label">${this.config.labels.hours}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="minutes">00</div>
          <div class="countdown-label">${this.config.labels.minutes}</div>
        </div>
        <div class="countdown-digit">
          <div class="countdown-number" data-unit="seconds">00</div>
          <div class="countdown-label">${this.config.labels.seconds}</div>
        </div>
      </div>
      <div class="countdown-title" style="text-align: center; margin-top: 16px; font-weight: 500;">
        ${this.config.target ? 'Event is set' : 'Please set event date'}
      </div>
    `;
  }

  bindEvents() {
    const button = this.element.querySelector('[data-action="set"]');
    const input = this.element.querySelector('.countdown-input');
    
    button.addEventListener('click', () => {
      const date = input.value;
      if (date) {
        this.setTarget(date);
        this.start();
      } else {
        alert('Please choose a date');
      }
    });
  }

  setTarget(target) {
    this.config.target = target;
    const title = this.element.querySelector('.countdown-title');
    title.textContent = `Event: ${new Date(target).toLocaleString('en')}`;
  }

  start() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const targetTime = new Date(this.config.target).getTime();
    
    this.timer = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance < 0) {
        this.complete();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.updateDisplay({ days, hours, minutes, seconds });
    }, 1000);
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    const pad = (num) => String(num).padStart(2, '0');
    
    this.element.querySelector('[data-unit="days"]').textContent = pad(days);
    this.element.querySelector('[data-unit="hours"]').textContent = pad(hours);
    this.element.querySelector('[data-unit="minutes"]').textContent = pad(minutes);
    this.element.querySelector('[data-unit="seconds"]').textContent = pad(seconds);
  }

  complete() {
    clearInterval(this.timer);
    this.element.querySelector('.countdown-title').textContent = this.config.doneText || 'Completed';
    this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

function init(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
  
  return Array.from(elements).map(el => new CountdownWidget(el, options));
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-widget="countdown"]');
  elements.forEach(el => {
    const options = el.dataset.options ? JSON.parse(el.dataset.options) : {};
    new CountdownWidget(el, options);
  });
});

if (typeof window !== 'undefined') {
  window.CountdownWidget = { init, CountdownWidget };
}

export { init, CountdownWidget };
