// Google Apps Script Web App Endpoint
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyypbA3VFrvs1ARydPStiW3fhLBHf6mcVd2Mk2Rku89TV5YQOSEKOgDOxFaWPaXug-9/exec';

document.addEventListener('DOMContentLoaded', () => {

    // 1. ORIGINAL PRODUCT CATALOG RENDERER
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('product-container');
            if (container) {
                container.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading products:', err));

    // 2. CAREERS FORM GOOGLE SHEETS HANDLER
    const careerForm = document.getElementById('career-form');
    if (careerForm) {
        careerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const formStatus = document.getElementById('form-status');

            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending Application...';
            formStatus.innerText = '';

            const formData = new FormData(careerForm);

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                formStatus.innerText = 'Application submitted successfully! We will get back to you soon.';
                formStatus.style.color = 'green';
                careerForm.reset();
            })
            .catch(error => {
                formStatus.innerText = 'Submission failed. Please try again.';
                formStatus.style.color = 'red';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Application';
            });
        });
    }
});