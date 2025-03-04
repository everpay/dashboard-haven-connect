
/**
 * EverPay Payment Widget
 * This script provides a lightweight, customizable payment widget
 * that can be embedded into any website.
 */

(function() {
  // Create global EverPay object
  window.EverPay = window.EverPay || {};
  
  // Widget configuration defaults
  const defaultConfig = {
    containerId: 'everpay-widget',
    amount: 0,
    currency: 'USD',
    title: 'Payment',
    description: 'Complete your payment',
    theme: {
      primaryColor: '#1AA47B',
      secondaryColor: '#19363B',
      showLogo: true,
    },
    customerFields: true,
    paymentMethods: ['card'],
    successUrl: window.location.href,
    cancelUrl: window.location.href
  };
  
  // Initialize widget
  EverPay.initializeWidget = function(config) {
    // Merge custom config with defaults
    const widgetConfig = { ...defaultConfig, ...config };
    widgetConfig.theme = { ...defaultConfig.theme, ...config.theme };
    
    // Get container element
    const container = document.getElementById(widgetConfig.containerId);
    if (!container) {
      console.error(`EverPay: Container element #${widgetConfig.containerId} not found`);
      return;
    }
    
    // Create widget HTML
    const widgetHtml = `
      <div class="epw-container" style="font-family: system-ui, -apple-system, sans-serif; max-width: 450px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
        <div class="epw-header" style="background-color: ${widgetConfig.theme.secondaryColor}; color: white; padding: 16px;">
          ${widgetConfig.theme.showLogo ? 
            `<div style="text-align: center; margin-bottom: 12px;">
              <img src="https://everpayinc.com/logo.png" alt="EverPay" style="height: 32px;" />
            </div>` : ''}
          <h2 style="margin: 0; text-align: center; font-size: 20px;">${widgetConfig.title}</h2>
          <p style="margin: 8px 0 0; text-align: center; font-size: 14px; opacity: 0.85;">${widgetConfig.description}</p>
        </div>
        
        <div class="epw-body" style="background: white; padding: 24px;">
          <div class="epw-amount" style="background: #f7f7f7; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 14px;">Amount:</span>
              <span style="font-weight: bold;">${widgetConfig.currency} ${parseFloat(widgetConfig.amount).toFixed(2)}</span>
            </div>
          </div>
          
          ${widgetConfig.customerFields ? `
          <div class="epw-customer-fields" style="margin-bottom: 20px;">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; margin-bottom: 4px;">Full Name</label>
              <input type="text" id="epw-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="John Doe" />
            </div>
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; margin-bottom: 4px;">Email</label>
              <input type="email" id="epw-email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="john@example.com" />
            </div>
          </div>
          ` : ''}
          
          <div class="epw-payment-methods">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; margin-bottom: 8px;">Payment Method</label>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${widgetConfig.paymentMethods.includes('card') ? 
                  `<button class="epw-method active" data-method="card" style="flex: 1; min-width: 80px; background: ${widgetConfig.theme.primaryColor}; color: white; border: none; padding: 10px; border-radius: 4px; font-size: 14px; cursor: pointer;">Card</button>` : ''}
                ${widgetConfig.paymentMethods.includes('bank_transfer') ? 
                  `<button class="epw-method" data-method="bank" style="flex: 1; min-width: 80px; background: #f7f7f7; color: #333; border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-size: 14px; cursor: pointer;">Bank</button>` : ''}
                ${widgetConfig.paymentMethods.includes('local_payment') ? 
                  `<button class="epw-method" data-method="local" style="flex: 1; min-width: 80px; background: #f7f7f7; color: #333; border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-size: 14px; cursor: pointer;">Local</button>` : ''}
                ${widgetConfig.paymentMethods.includes('crypto') ? 
                  `<button class="epw-method" data-method="crypto" style="flex: 1; min-width: 80px; background: #f7f7f7; color: #333; border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-size: 14px; cursor: pointer;">Crypto</button>` : ''}
              </div>
            </div>
          </div>
          
          <div class="epw-card-form" style="margin-top: 20px;">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; margin-bottom: 4px;">Card Number</label>
              <input type="text" id="epw-card-number" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="4242 4242 4242 4242" />
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
              <div style="flex: 1;">
                <label style="display: block; font-size: 14px; margin-bottom: 4px;">Expiry Date</label>
                <input type="text" id="epw-card-expiry" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="MM/YY" />
              </div>
              <div style="flex: 1;">
                <label style="display: block; font-size: 14px; margin-bottom: 4px;">CVV</label>
                <input type="text" id="epw-card-cvv" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="123" />
              </div>
            </div>
          </div>
          
          <div style="margin-top: 24px;">
            <button id="epw-pay-button" style="width: 100%; background: ${widgetConfig.theme.primaryColor}; color: white; border: none; padding: 12px; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.3s;">
              Pay ${widgetConfig.currency} ${parseFloat(widgetConfig.amount).toFixed(2)}
            </button>
          </div>
          
          <div style="margin-top: 16px; text-align: center;">
            <p style="font-size: 12px; color: #777; margin: 0;">
              Secure payment processed by EverPay
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Insert widget into container
    container.innerHTML = widgetHtml;
    
    // Add event listeners
    const payButton = document.getElementById('epw-pay-button');
    if (payButton) {
      payButton.addEventListener('click', function() {
        // In a real implementation, this would process the payment
        // For now, just simulate a successful payment
        
        payButton.textContent = 'Processing...';
        payButton.style.opacity = '0.7';
        payButton.disabled = true;
        
        setTimeout(() => {
          // Simulate successful payment
          if (Math.random() > 0.2) {
            // Redirect to success URL
            window.location.href = widgetConfig.successUrl;
          } else {
            // Show error
            payButton.textContent = 'Payment Failed. Try Again';
            payButton.style.opacity = '1';
            payButton.disabled = false;
          }
        }, 2000);
      });
    }
    
    // Method selection logic
    const methodButtons = document.getElementsByClassName('epw-method');
    Array.from(methodButtons).forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        Array.from(methodButtons).forEach(btn => {
          btn.classList.remove('active');
          btn.style.background = '#f7f7f7';
          btn.style.color = '#333';
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.style.background = widgetConfig.theme.primaryColor;
        this.style.color = 'white';
      });
    });
  };
})();
