(function initMatrix() {
    let timer;
    class Matrix extends HTMLElement {
        matrixSize = 0;
        generatedTime = 0;
        nextGenerationData = [];
        currentGenerationData = [];

        connectedCallback() {
            this.tableOnClick = this.tableOnClick.bind(this);
            this.compareData = this.compareData.bind(this);
            this.createNextGeneration = this.createNextGeneration.bind(this);
            this.changeMatrixSize(10);
            window.addEventListener('matrix:start', () => {
                timer = setInterval(() => this.createNextGeneration());
            });
            window.addEventListener('matrix:stop', () => {
                clearInterval(timer)
            });
            window.addEventListener('matrix:randomize', () => {
                this.randomizeMatrix();
                this.compareData();
            });
            window.addEventListener('matrix:change-size', (e) => {
                this.changeMatrixSize(e.detail.matrixSize);
            });
        }

        changeMatrixSize(n) {
            this.matrixSize = n;
            const className = n > 150 ? 'collapsed' : '';
            this.renderMatrix(className);
            this.firstChild.addEventListener('click', this.tableOnClick);
            this.currentGenerationData = this.createMatrix(n);
        }

        compareData() {
            for (let i = 0; i < this.matrixSize; i++) {
                for (let j = 0; j < this.matrixSize; j++) {
                    if (this.nextGenerationData[i][j] !== this.currentGenerationData[i][j]) {
                        const el = document.getElementById(`${i}-${j}`);
                        const className = this.nextGenerationData[i][j] === 1 ? 'alive' : 'dead';
                        el.setAttribute('class', className);
                    }
                }
            }

            this.currentGenerationData = this.nextGenerationData;
            const time = performance.now() - this.generatedTime;
            const performanceCounter = document.getElementById('controls-generation-counter');
            performanceCounter.innerHTML = time.toFixed(1);
        }


        renderMatrix(tableClass) {
            let rows = '';
            for (let y = 0; y < this.matrixSize; y++) {
                let cells = `<tr>`;
                for (let x = 0; x < this.matrixSize; x++) {
                    cells += `<td id="${y}-${x}" class="dead" xcoord="${x}" ycoord="${y}" />`;
                }
                cells += '</tr>';
                rows += cells;
            }
            this.innerHTML = `<table class="${tableClass}" id="table"><tbody>${rows}</tbody></table>`;
        }

        tableOnClick(e) {
            const x = Number(e.target.getAttribute('xcoord'));
            const y = Number(e.target.getAttribute('ycoord'));
            if(!Number.isNaN(x) && !Number.isNaN(y)) {
                const newValue = e.target.className === 'alive' ? 'dead' : 'alive';
                e.target.setAttribute('class', newValue)
                this.currentGenerationData[y][x] = this.currentGenerationData[y][x] === 1 ? 0 : 1;
            }
        }

        randomizeMatrix() {
            this.nextGenerationData = new Array(this.matrixSize);
            for (let i = 0; i < this.matrixSize; i++) {
                this.nextGenerationData[i] = new Array(this.matrixSize)
                for (let j = 0; j < this.matrixSize; j++) {
                    this.nextGenerationData[i][j] = Math.random() < 0.5 ? 0 : 1
                }
            }
        }

        calculateAliveNeighbors(x, y, matrix, size) {
            let neighbors = 0;
            for (let ni = -1; ni <= 1; ni++) {
                for (let nj = -1; nj <= 1; nj++) {
                    if (ni === 0 && nj === 0) continue;
                    let row = (x + ni + size) % size;
                    let col = (y + nj + size) % size;
                    neighbors = neighbors + matrix[row][col];
                }
            }
            return neighbors;
        }

        createMatrix(size) {
            const matrix = new Array(size);
            for (let i = 0; i < size; i++) {
                matrix[i] = new Array(size).fill(0);
            }
            return matrix;
        }

        createNextGeneration() {
            this.generatedTime = performance.now();
            const nextMatrix = this.createMatrix(this.matrixSize)

            for (let i = 0; i < this.matrixSize; i++) {
                for (let j = 0; j < this.matrixSize; j++) {
                    const aliveNeighborsCount = this.calculateAliveNeighbors(i, j, this.currentGenerationData, this.matrixSize);

                    if (this.currentGenerationData[i][j] === 1 && (aliveNeighborsCount < 2 || aliveNeighborsCount > 3)) {
                        nextMatrix[i][j] = 0;
                    } else if (this.currentGenerationData[i][j] === 0 && aliveNeighborsCount === 3) {
                        nextMatrix[i][j] = 1;
                    } else {
                        nextMatrix[i][j] = this.currentGenerationData[i][j];
                    }

                }
            }
            this.nextGenerationData = nextMatrix;
            this.compareData();
        }


        disconnectedCallback() {
            this.firstChild.removeEventListener('click', this.tableOnClick);
            clearInterval(timer)
            this.logger('disconnected');
        }

        logger(...args) {
            console.log('MATRIX', ...args);
        }
    }
    window.customElements.define('custom-matrix', Matrix);
}());
