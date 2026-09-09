const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7cL_E6ySvsTY801ebkBbuBJ_nUPlJ7BJOB-8HUKqW8FPr1dUJUitbZ0LPDqCwH1Kh/exec';

document.addEventListener('DOMContentLoaded', () => {

    // 1. FETCH PRODUCT CATALOG
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('product-container');
            if (container) {
                container.innerHTML = products.map(product => `
                    <div class="product-card interactive-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading products:', err));

    // 2. FETCH POSITIONS FROM GOOGLE SHEET
    const dropdown = document.getElementById('position-dropdown');
    if (dropdown && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        fetch(GOOGLE_SCRIPT_URL)
            .then(res => res.json())
            .then(positions => {
                if (!positions || positions.length === 0) {
                    dropdown.innerHTML = '<option value="General Application">General Application (No Openings Currently)</option>';
                } else {
                    dropdown.innerHTML = '<option value="">Select Target Position *</option>';
                    positions.forEach(pos => {
                        const opt = document.createElement('option');
                        opt.value = pos;
                        opt.textContent = pos;
                        dropdown.appendChild(opt);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching positions:', err);
                dropdown.innerHTML = '<option value="General Application">General Application</option>';
            });
    }

    // 3. SUBMIT CAREER FORM TO GOOGLE SHEET
    const careerForm = document.getElementById('career-form');
    if (careerForm) {
        careerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('career-submit-btn');
            const msg = document.getElementById('career-status-msg');

            btn.disabled = true;
            btn.innerText = 'Submitting Application...';
            msg.innerText = '';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: new FormData(careerForm)
            })
            .then(res => res.json())
            .then(data => {
                msg.innerText = 'Application submitted successfully!';
                msg.style.color = '#ffc107';
                careerForm.reset();
            })
            .catch(err => {
                msg.innerText = 'Submission failed. Please try again.';
                msg.style.color = '#ff6b6b';
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerText = 'Submit Application →';
            });
        });
    }
});