export const loadPayPalSdk = (clientId = 'Aa-aNx86Z7v_VTBCrO_7T-jaXU2jELDV6c3K0fBU1JUNIRpHfNE_uGWbhUMFly6-LLrpBJC2SRc6MUsQ', currency = 'USD') => {
    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById('paypal-sdk');
        if (existingScript) {
            if (window.paypal) {
                return resolve(window.paypal);
            }
            existingScript.onload = () => resolve(window.paypal);
            existingScript.onerror = (e) => reject(e);
            return;
        }

        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
        script.async = true;
        script.onload = () => {
            if (window.paypal) {
                resolve(window.paypal);
            } else {
                reject(new Error('PayPal SDK loaded but window.paypal not found'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        document.body.appendChild(script);
    });
};
