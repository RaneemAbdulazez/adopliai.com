document.addEventListener('DOMContentLoaded', async () => {
    const appId = 'sandbox-sq0idb-R4PIC5QuCh-GUKAsHwM-1w'; // Replace with your Square App ID
    const locationId = 'LYXHQBR5F2PX2'; // Replace with your Square Location ID
    let card;

    async function initializeSquare() {
        try {
            // Check if Square is defined
            if (!window.Square) {
                throw new Error('Square.js failed to load properly');
            }

            const payments = window.Square.payments(appId, locationId);
            card = await payments.card({
                style: {
                    input: {
                        fontFamily: "sans-serif"
                    }
                }
            });

            // Customize the card element
            await card.attach('#card-container');
            console.log('Square card inserted successfully');
        } catch (e) {
            console.error('Initializing Square failed', e);
            // Fallback UI for demonstration if App ID is invalid
            renderMockSquareUI();
        }
    }

    function renderMockSquareUI() {
        const container = document.getElementById('card-container');
        container.innerHTML = `
            <div style="background: var(--navy-dark); padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 15px;">
                <input type="text" inputmode="numeric" pattern="([0-9]{4}\s?){4}" maxlength="19" oninput="let v = this.value.replace(/[^0-9]/g, ''); this.value = v.replace(/(.{4})/g, '$1 ').trim().substring(0, 19)" placeholder="Card Number 0000 0000 0000 0000" style="width: 100%; border: none; background: transparent; color: white; outline: none; font-size: 1rem; padding: 5px;">
                <div style="display: flex; gap: 15px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
                    <input type="text" inputmode="numeric" pattern="[0-9]{2}/[0-9]{2}" maxlength="5" oninput="let v = this.value.replace(/[^0-9]/g, ''); this.value = v.length > 2 ? v.substring(0,2) + '/' + v.substring(2,4) : v" placeholder="MM/YY" style="width: 50%; border: none; background: transparent; color: white; outline: none; font-size: 1rem; padding: 5px;">
                    <input type="text" inputmode="numeric" pattern="[0-9]{3,4}" maxlength="4" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" placeholder="CVC" style="width: 50%; border: none; background: transparent; color: white; outline: none; font-size: 1rem; padding: 5px;">
                </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--gray-text); margin-top: 10px; display: flex; align-items: center; gap: 5px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                Secure payment powered by Square (Mock UI)
            </p>
        `;
    }

    // Initialize the payment form
    initializeSquare();

    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.getElementById('card-button');
    const paymentStatusContainer = document.getElementById('payment-status-container');

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        submitButton.disabled = true;
        submitButton.innerHTML = 'Processing... <span class="spinner" style="display:inline-block; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite;"></span>';

        // Adding CSS keyframes for spinner dynamically
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        try {
            // Attempt to create a payment token with Square
            if (card) {
                const result = await card.tokenize();
                if (result.status === 'OK') {
                    console.log(`Payment token is ${result.token}`);
                    // Here you would send the token to your backend
                    showSuccess('Payment Successful! Welcome to the May 28th Cohort.');
                } else {
                    let errorMessage = `Tokenization failed with status: ${result.status}`;
                    if (result.errors) {
                        errorMessage += ` and errors: ${JSON.stringify(result.errors)}`;
                    }
                    throw new Error(errorMessage);
                }
            } else {
                // If using mock UI
                setTimeout(() => {
                    showSuccess('Payment Successful! Welcome to the May 28th Cohort. (Mock Mode)');
                }, 1500);
            }
        } catch (e) {
            console.error(e.message);
            showError('Payment processing failed. Please try again.');
        }
    });

    function showSuccess(message) {
        paymentStatusContainer.innerHTML = `<div style="margin-top: 20px; padding: 15px; background: rgba(76, 209, 55, 0.1); border: 1px solid #4cd137; color: #4cd137; border-radius: 8px; text-align: center; font-weight: 600;">${message}</div>`;
        submitButton.style.display = 'none';
    }

    function showError(message) {
        paymentStatusContainer.innerHTML = `<div style="margin-top: 20px; padding: 15px; background: rgba(232, 65, 24, 0.1); border: 1px solid #e84118; color: #e84118; border-radius: 8px; text-align: center; font-weight: 600;">${message}</div>`;
        submitButton.disabled = false;
        submitButton.innerHTML = `Register & Pay $999 <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;
    }

    // Smooth scroll for the CTA button
    document.querySelector('.cta-button').addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
