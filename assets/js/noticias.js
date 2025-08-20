const postsContainer = document.getElementById('posts-list');
const singleContent = document.getElementById('contenido-noticia');
const paginationDiv = document.querySelector('.pagination'); // Asegúrate que exista este div en tu HTML

const NOTICIAS_POR_PAGINA = 6;

// ===============================
// LISTADO DE NOTICIAS (PÁGINA HOME)
// ===============================
if (postsContainer) {
  fetch('news.json')
    .then(res => res.json())
    .then(data => {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const featured = data[0];
      let paginaActual = 1;
      const noticias = data.slice(1);
      const totalPaginas = Math.ceil(noticias.length / NOTICIAS_POR_PAGINA);

      function mostrarNoticiasPagina(pagina) {
        postsContainer.innerHTML = '';
        const inicio = (pagina - 1) * NOTICIAS_POR_PAGINA;
        const fin = inicio + NOTICIAS_POR_PAGINA;
        const noticiasPagina = noticias.slice(inicio, fin);

        noticiasPagina.forEach(item => {
          const article = document.createElement('article');
          article.className = 'post';

          const header = document.createElement('header');
          header.className = 'major';

          const dateSpan = document.createElement('span');
          dateSpan.className = 'date';
          const [strYear, strMonth, strDay] = item.date.split("-");
          const yearNum  = parseInt(strYear, 10);
          const monthNum = parseInt(strMonth, 10) - 1;
          const dayNum   = parseInt(strDay, 10);
          const fechaLocal = new Date(yearNum, monthNum, dayNum);
          dateSpan.textContent = fechaLocal.toLocaleDateString("es-CL");
          header.appendChild(dateSpan);

          const h2 = document.createElement('h2');
          const aTitle = document.createElement('a');
          aTitle.href = `noticia.html?id=${item.id}`;
          aTitle.textContent = item.title;
          h2.appendChild(aTitle);
          header.appendChild(h2);

          const pSummary = document.createElement('p');
          pSummary.textContent = item.summary;
          header.appendChild(pSummary);

          article.appendChild(header);

          const aImg = document.createElement('a');
          aImg.className = 'image fit';
          aImg.href = `noticia.html?id=${item.id}`;
          const img = document.createElement('img');
          img.src = item.featured_image;
          img.alt = item.title;
          aImg.appendChild(img);
          article.appendChild(aImg);

          const actions = document.createElement('ul');
          actions.className = 'actions special';
          const liAction = document.createElement('li');
          const btn = document.createElement('a');
          btn.href = `noticia.html?id=${item.id}`;
          btn.className = 'button';
          btn.textContent = 'Leer más';
          liAction.appendChild(btn);
          actions.appendChild(liAction);
          article.appendChild(actions);

          postsContainer.appendChild(article);
        });
      }

      function renderPaginacion() {
        if (!paginationDiv) return;
        paginationDiv.innerHTML = '';

        const prev = document.createElement('a');
        prev.className = 'page';
        prev.textContent = '«';
        prev.href = '#';
        prev.onclick = (e) => {
          e.preventDefault();
          if (paginaActual > 1) {
            paginaActual--;
            mostrarNoticiasPagina(paginaActual);
            renderPaginacion();
          }
        };
        if (paginaActual === 1) prev.classList.add('disabled');
        paginationDiv.appendChild(prev);

        for (let i = 1; i <= totalPaginas; i++) {
          const page = document.createElement('a');
          page.className = 'page';
          page.textContent = i;
          page.href = '#';
          if (i === paginaActual) page.classList.add('active');
          page.onclick = (e) => {
            e.preventDefault();
            paginaActual = i;
            mostrarNoticiasPagina(paginaActual);
            renderPaginacion();
          };
          paginationDiv.appendChild(page);
        }

        const next = document.createElement('a');
        next.className = 'page';
        next.textContent = '»';
        next.href = '#';
        next.onclick = (e) => {
          e.preventDefault();
          if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarNoticiasPagina(paginaActual);
            renderPaginacion();
          }
        };
        if (paginaActual === totalPaginas) next.classList.add('disabled');
        paginationDiv.appendChild(next);
      }

      mostrarNoticiasPagina(paginaActual);
      renderPaginacion();

      const [fYear, fMonth, fDay] = featured.date.split("-");
      const fYearNum  = parseInt(fYear, 10);
      const fMonthNum = parseInt(fMonth, 10) - 1;
      const fDayNum   = parseInt(fDay, 10);
      const fechaDestacadaLocal = new Date(fYearNum, fMonthNum, fDayNum);
      document.getElementById('featured-date').textContent =
        fechaDestacadaLocal.toLocaleDateString("es-CL");

      const featuredTitleEl = document.getElementById('featured-title');
      featuredTitleEl.textContent = featured.title;
      featuredTitleEl.href = `noticia.html?id=${featured.id}`;

      document.getElementById('featured-content').textContent = featured.summary;
      document.getElementById('featured-link').href = `noticia.html?id=${featured.id}`;
      const featuredImage = document.getElementById('featured-image');
      featuredImage.src = featured.featured_image;
      featuredImage.alt = featured.title;
      document.getElementById('featured-button').href = `noticia.html?id=${featured.id}`;
    })
    .catch(err => console.error('Error cargando noticias:', err));
}

// ========================================
// DETALLE DE NOTICIA INDIVIDUAL (GALERÍA, MODAL, NAVEGACIÓN)
// ========================================
if (singleContent) {
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }
  const noticiaId = getParam('id');

  fetch('news.json')
    .then(res => res.json())
    .then(data => {
      const noticia = data.find(item => item.id === noticiaId);
      const galeria = document.getElementById('galeria');

      // Navegación noticia anterior/siguiente
      const ids = data.map(n => n.id);
      const idx = ids.indexOf(noticiaId);

      const btnAnterior = document.getElementById('btn-anterior');
      const btnSiguiente = document.getElementById('btn-siguiente');
      if (btnAnterior && idx > 0) {
        btnAnterior.disabled = false;
        btnAnterior.onclick = () => {
          window.location.href = `noticia.html?id=${ids[idx - 1]}`;
        };
      } else if (btnAnterior) {
        btnAnterior.disabled = true;
      }
      if (btnSiguiente && idx >= 0 && idx < ids.length - 1) {
        btnSiguiente.disabled = false;
        btnSiguiente.onclick = () => {
          window.location.href = `noticia.html?id=${ids[idx + 1]}`;
        };
      } else if (btnSiguiente) {
        btnSiguiente.disabled = true;
      }

      if (!noticia) {
        singleContent.innerHTML = "<p>No se encontró la noticia.</p>";
        if (galeria) galeria.innerHTML = '';
        return;
      }

      let fechaHtml = '';
      if (noticia.date) {
        const [y, m, d] = noticia.date.split("-");
        const fechaObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
        fechaHtml = `<p style="font-size: 1.1em; color: #666;">${fechaObj.toLocaleDateString("es-CL")}</p>`;
      }

      singleContent.innerHTML = `
        <h2>${noticia.title}</h2>
        ${fechaHtml}
        <p><em>${noticia.summary || ""}</em></p>
        <div>${noticia.content || ""}</div>
      `;

      // GALERÍA GRID
      if (galeria) {
        galeria.innerHTML = '';
        if (noticia.images && noticia.images.length > 0) {
          noticia.images.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'galeria-item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = noticia.title + " foto " + (i+1);
            img.className = 'galeria-img';
            img.style.width = '100%';
            img.style.height = '210px';
            img.style.objectFit = 'cover';
            item.appendChild(img);
            galeria.appendChild(item);
          });

          // Elimina cualquier listener previo y asigna uno nuevo SIEMPRE
          galeria.onclick = null;
          galeria.addEventListener('click', function(e) {
            const img = e.target.closest('.galeria-img');
            if (img) {
              const imgs = Array.from(galeria.querySelectorAll('.galeria-img'));
              const idx = imgs.indexOf(img);
              abrirModal(idx);
            }
          });
        } else {
          galeria.innerHTML = "<p>No hay fotos para esta noticia.</p>";
        }
      }

      // MODAL DE IMAGEN AMPLIADA Y NAVEGABLE
      const modal = document.getElementById('modal-imagen');
      const modalImg = document.getElementById('imagen-ampliada');
      const cerrarModal = modal.querySelector('.cerrar-modal');
      const anterior = document.getElementById('anterior-img');
      const siguiente = document.getElementById('siguiente-img');
      let currentImg = 0;

      function getCurrentImgs() {
        return Array.from(document.querySelectorAll('#galeria .galeria-img'));
      }

      function abrirModal(idx) {
        const imgs = getCurrentImgs();
        currentImg = idx;
        if (imgs[currentImg]) {
          modalImg.src = imgs[currentImg].src;
          modal.classList.add('active');
        }
      }
      function cerrar() {
        modal.classList.remove('active');
        modalImg.src = "";
        currentImg = 0;
      }
      function mostrarAnterior() {
        const imgs = getCurrentImgs();
        if (!imgs.length) return;
        currentImg = (currentImg - 1 + imgs.length) % imgs.length;
        modalImg.src = imgs[currentImg].src;
      }
      function mostrarSiguiente() {
        const imgs = getCurrentImgs();
        if (!imgs.length) return;
        currentImg = (currentImg + 1) % imgs.length;
        modalImg.src = imgs[currentImg].src;
      }
      if (cerrarModal) cerrarModal.onclick = cerrar;
      if (anterior) anterior.onclick = (e) => { e.stopPropagation(); mostrarAnterior(); }
      if (siguiente) siguiente.onclick = (e) => { e.stopPropagation(); mostrarSiguiente(); }
      if (modal) modal.onclick = (e) => { if (e.target === modal) cerrar(); }
      window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === "Escape") cerrar();
        if (e.key === "ArrowLeft") mostrarAnterior();
        if (e.key === "ArrowRight") mostrarSiguiente();
      });
    })
    .catch(err => {
      singleContent.innerHTML = "<p>Error cargando la noticia.</p>";
      const galeria = document.getElementById('galeria');
      if (galeria) galeria.innerHTML = '';
      console.error(err);
    });
}