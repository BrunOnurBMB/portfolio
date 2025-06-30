document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  const links = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('main section[id]');

  // Toggle do menu hamburguer
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Atualiza o link ativo com base na rolagem
  function updateActiveLink() {
    const scrollY = window.scrollY;

    if (scrollY < 100) {
      links.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('active-link');
        }
      });
      return; // evita checagem desnecessária nas outras sections
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        links.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  // Aplica a classe também ao clicar nos links
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    });
  });

  // Escuta rolagem para ativar o link certo
  window.addEventListener('scroll', updateActiveLink);
});