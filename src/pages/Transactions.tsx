import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Transactions = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const handleOpenPaymentModal = () => {
    // Load VGS Collect script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
    script.async = true;
    script.onload = () => {
      initializeVGSCollect();
    };
    document.body.appendChild(script);
    setIsPaymentModalOpen(true);
  };

  const initializeVGSCollect = () => {
    // Type assertion for VGSCollect
    const VGSCollect = (window as any).VGSCollect;
    
    if (VGSCollect) {
      const collect = VGSCollect.create('tntxrsfst11', 'sandbox');
      
      collect.field('#card-number', {
        type: 'cardNumber',
        name: 'card_number',
        placeholder: 'Card Number',
        css: {
          'color': '#333',
          'font-size': '16px',
          'padding': '10px',
          'border': '1px solid #ccc',
          'border-radius': '5px',
          'margin-bottom': '10px'
        }
      });

      collect.field('#card-expiry', {
        type: 'cardExpiryDate',
        name: 'card_expiry',
        placeholder: 'MM / YY',
        css: {
          'color': '#333',
          'font-size': '16px',
          'padding': '10px',
          'border': '1px solid #ccc',
          'border-radius': '5px',
          'margin-bottom': '10px'
        }
      });

      collect.field('#card-cvc', {
        type: 'cardCVC',
        name: 'card_cvc',
        placeholder: 'CVC',
        css: {
          'color': '#333',
          'font-size': '16px',
          'padding': '10px',
          'border': '1px solid #ccc',
          'border-radius': '5px',
          'margin-bottom': '10px'
        }
      });

      // Optional: Add event listeners for validation and submit
      collect.on('field:valid', (data: any) => {
        console.log('Field Valid:', data);
      });

      collect.on('field:invalid', (data: any) => {
        console.log('Field Invalid:', data);
      });

      const submitButton = document.getElementById('submit-button');
      if (submitButton) {
        submitButton.addEventListener('click', () => {
          collect.submit('/post', {
            extraHeaders: {
              'X-Custom-Header': 'Your Custom Value'
            },
            form: {
              "card_number": "{{card_number}}",
              "card_expiry": "{{card_expiry}}",
              "card_cvc": "{{card_cvc}}"
            }
          }, (status: number, response: any) => {
            console.log('Response Status:', status);
            console.log('Response Data:', response);
            alert('Payment processed successfully!');
            setIsPaymentModalOpen(false);
          }, (error: any) => {
            console.error('Submission Error:', error);
            alert('Payment processing failed.');
          });
        });
      }
    }
  };

  return (
    <div>
      <h1>Transactions</h1>
      <Button onClick={handleOpenPaymentModal}>Add Payment Method</Button>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-number" className="text-right">
                Card Number
              </Label>
              <div className="col-span-3">
                <div id="card-number"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-expiry" className="text-right">
                Card Expiry
              </Label>
              <div className="col-span-3">
                <div id="card-expiry"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-cvc" className="text-right">
                Card CVC
              </Label>
              <div className="col-span-3">
                <div id="card-cvc"></div>
              </div>
            </div>
          </div>
          <Button id="submit-button">Submit Payment</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
