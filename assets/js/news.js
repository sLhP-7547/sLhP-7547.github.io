// news.js — Slider de Diario Mural con flechas para navegar entre noticias

fetch('news.json')
  .then(response => response.json())
  .then(data => {
    // Ordenar noticias por fecha descendente
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Tomar las 3 últimas
    const latest = data.slice(0, 3);
    const newsList = document.getElementById('news-list');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let index = 0;

    function renderNews(i) {
      newsList.innerHTML = '';
      latest.forEach((item, idx) => {
        const li = document.createElement('li');
        if (idx === i) {
          li.classList.add('active');
        }

        // Fecha
        const dateSpan = document.createElement('span');
        dateSpan.className = 'date';
        // Parsear la cadena "YYYY-MM-DD" en fecha local (sin conversión UTC)
        const [strYear, strMonth, strDay] = item.date.split("-");
        const year  = parseInt(strYear, 10);
        const month = parseInt(strMonth, 10) - 1; // los meses van de 0 a 11
        const day   = parseInt(strDay, 10);
        const fechaLocal = new Date(year, month, day);
        dateSpan.textContent = fechaLocal.toLocaleDateString("es-CL");
        li.appendChild(dateSpan);

        // Imagen destacada
        const img = document.createElement('img');
        img.src = item.featured_image;
        img.alt = item.title;
        li.appendChild(img);

        // Título con enlace a detalle
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = `noticia.html?id=${item.id}`;
        a.textContent = item.title;
        h3.appendChild(a);
        li.appendChild(h3);

        // Resumen
        const p = document.createElement('p');
        p.className = 'summary';
        p.textContent = item.summary;
        li.appendChild(p);

        newsList.appendChild(li);
      });
    }

    renderNews(index);

    prevBtn.onclick = () => {
      index = (index - 1 + latest.length) % latest.length;
      renderNews(index);
    };

    nextBtn.onclick = () => {
      index = (index + 1) % latest.length;
      renderNews(index);
    };

    // Auto-play slider: avanza automáticamente cada 5 segundos
    setInterval(() => {
      nextBtn.click();
    }, 3000);
  })
  .catch(err => console.error('Error loading news:', err));