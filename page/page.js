const $app = document.getElementById('app');

function renderPage() {
  $app.innerHTML = `
    <game-controls></game-controls>
    <custom-matrix></custom-matrix>
  `;
}

renderPage();