document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];
  let selectedCategory = 'All';

  // Header Shrink / Background Glow Effect on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // IntersectionObserver for Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Fetch & Render Product Catalog
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      filterAndRender();
    })
    .catch(err => console.error('Error fetching products:', err));

  function filterAndRender() {
    const query = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    const filtered = allProducts.filter(p => {
      const matchesCategory = (selectedCategory === 'All') || (p.category === selectedCategory);
      const matchesQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    renderProducts(filtered);
  }

  function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (items.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 2rem 0;">No items found matching your search or selected filter.</p>';
      return;
    }

    items.forEach((product, idx) => {
      const card = document.createElement('div');
      card.className = `product-card interactive-card reveal reveal-delay-${(idx % 4) + 1}`;

      card.innerHTML = `
        <div class="card-visual-layer">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="image-overlay-title">${product.name}</div>
        </div>
        <div class="card-hover-layer">
          <div>
            <div class="card-tags">
              <span class="tag-pill category">${product.category}</span>
              <span class="tag-pill bestseller">${product.tag || 'Popular'}</span>
            </div>
            <h3 class="hover-title">${product.name}</h3>
          </div>
          <p class="hover-desc">${product.description}</p>
        </div>
      `;
      grid.appendChild(card);
      revealObserver.observe(card);
    });
  }

  // Bind Category Filter Button Events
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedCategory = e.target.getAttribute('data-category');
      filterAndRender();
    });
  });

  // Search Filter Handler
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterAndRender();
    });
  }

  // Dynamic Scroll Spy for Navigation Active State
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn-inquire)');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // Contact Form AJAX Handler
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(response => {
        formResponse.style.color = '#fbbf24';
        formResponse.style.marginTop = '10px';
        formResponse.style.fontSize = '0.85rem';
        formResponse.textContent = response.message;
        contactForm.reset();
      })
      .catch(() => {
        formResponse.style.color = '#fca5a5';
        formResponse.style.marginTop = '10px';
        formResponse.style.fontSize = '0.85rem';
        formResponse.textContent = 'Failed to submit inquiry. Please try again.';
      });
    });
  }
});