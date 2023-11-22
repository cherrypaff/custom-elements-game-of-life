(function initGameControls() {
  class GameControls extends HTMLElement {
    gameStarted = false;
    gameHandlerText = 'Start';

    connectedCallback() {
      this.gameStateHandler = this.gameStateHandler.bind(this);
      this.randomizeMatrix = this.randomizeMatrix.bind(this);
      this.render();
      this.addListeners();
    }

    refresh() {
      this.removeListeners();
      this.render();
      this.addListeners();
    }

    render() {
      this.innerHTML = `
        <button id="controls-start" type="button">${this.gameHandlerText}</button>
        <button id="controls-randomize" type="button">Randomize</button>
        <div class="column">
            <label>Matrix Size</label>
            <input id="controls-size-inp" type="number" min="1" />
            <button id="controls-size" type="button">Apply Size</button>
        </div>
        <span id="controls-generation-counter">0</span>
        <span>milliseconds for creating next generation</span>
      `;
    }

    gameStateHandler() {
      if(this.gameStarted) {
        this.dispatchEvent(new CustomEvent('matrix:stop', {
          bubbles: true,
        }));
        this.gameHandlerText = 'Start';
        this.gameStarted = false;
      } else {
        this.dispatchEvent(new CustomEvent('matrix:start', {
          bubbles: true,
        }));
        this.gameHandlerText = 'Stop';
        this.gameStarted = true;
      }
      this.refresh();
    }

    randomizeMatrix() {
      this.dispatchEvent(new CustomEvent('matrix:randomize', {
        bubbles: true,
      }));
    }

    changeMatrixSize() {
      const inputEl = document.getElementById('controls-size-inp');
      const val = Number(inputEl.value);
      if (val > 0) {
        this.dispatchEvent(new CustomEvent('matrix:change-size', {
          bubbles: true,
          detail: { matrixSize: val }
        }));
      }
    }

    addListeners() {
      const startButton = document.getElementById('controls-start');
      const randomizeButton = document.getElementById('controls-randomize');
      const sizeControls = document.getElementById('controls-size');
      startButton.addEventListener('click', this.gameStateHandler);
      randomizeButton.addEventListener('click', this.randomizeMatrix);
      sizeControls.addEventListener('click', this.changeMatrixSize);
    }

    removeListeners() {
      const startButton = document.getElementById('controls-start');
      const randomizeButton = document.getElementById('controls-randomize');
      const sizeControls = document.getElementById('controls-size');
      startButton.removeEventListener('click', this.gameStateHandler);
      randomizeButton.removeEventListener('click', this.randomizeMatrix);
      sizeControls.removeEventListener('click', this.changeMatrixSize);
    }

    disconnectedCallback() {
      this.removeListeners();
      this.log('disconnected');
    }

    log(...args) {
      console.log('CONTROLS', ...args);
    }
  }
  window.customElements.define('game-controls', GameControls);
}());
