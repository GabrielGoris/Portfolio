function loadHTMLContent(url, elementSelector, callback) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      document.querySelector(elementSelector).innerHTML = data;
      if (callback) {
        callback(); 
      }
    })
    .catch(error => console.error('Erro ao carregar o conteúdo:', error));
}

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
  const isPortuguese = document.documentElement.lang === 'pt-BR';
  const projectsPage = isPortuguese ? 'projetos.html' : 'projects.html';
  loadHTMLContent(projectsPage, '.projects');
});
