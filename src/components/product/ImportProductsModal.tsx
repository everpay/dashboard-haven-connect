
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { FileUp, Database, UploadCloud } from 'lucide-react';
import Papa from 'papaparse';

interface ImportProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ImportProductsModal({ open, onOpenChange, onSuccess }: ImportProductsModalProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  const processCSV = async (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data as any[]),
        error: (error) => reject(error)
      });
    });
  };

  const importProducts = async (source: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to import products",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      let products: any[] = [];

      switch (source) {
        case 'file':
          if (!file) {
            toast({
              title: "Error",
              description: "Please select a file to import",
              variant: "destructive"
            });
            return;
          }
          products = await processCSV(file);
          break;

        case 'shopify':
        case 'amazon':
        case 'magento':
        case 'woocommerce':
        case 'salesforce':
          if (!apiKey) {
            toast({
              title: "Error",
              description: "Please enter your API key",
              variant: "destructive"
            });
            return;
          }
          // Here you would make API calls to the respective platforms
          toast({
            title: "Import Started",
            description: `Importing products from ${source}...`,
          });
          // Simulated delay to show import process
          await new Promise(resolve => setTimeout(resolve, 2000));
          products = simulateImportFromPlatform(source);
          break;
      }

      if (products.length > 0) {
        // Map products to match the database schema (stock instead of inventory)
        const formattedProducts = products.map(product => ({
          ...product,
          user_id: session.user.id,
          id: crypto.randomUUID(),
          // Ensure stock is set if inventory was provided, or set a default
          stock: product.stock || product.inventory || 0,
          // Set a default product_type if not provided
          product_type: product.product_type || 'physical'
        }));

        const { error } = await supabase
          .from('products')
          .insert(formattedProducts);

        if (error) throw error;
      }

      onSuccess();
      toast({
        title: "Success",
        description: "Products imported successfully"
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import products",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setFile(null);
      setApiKey('');
    }
  };

  // Simulate import from platforms with sample data
  const simulateImportFromPlatform = (platform: string): any[] => {
    // Return 3 sample products based on the platform
    return [
      {
        name: `${platform} Product 1`,
        description: `Imported from ${platform} - product description 1`,
        price: 19.99,
        stock: 100,
        image_url: `https://placehold.co/600x400?text=${platform}+Product+1`,
        product_type: 'physical'
      },
      {
        name: `${platform} Product 2`,
        description: `Imported from ${platform} - product description 2`,
        price: 29.99,
        stock: 50,
        image_url: `https://placehold.co/600x400?text=${platform}+Product+2`,
        product_type: 'digital'
      },
      {
        name: `${platform} Product 3`,
        description: `Imported from ${platform} - product description 3`,
        price: 39.99,
        stock: 75,
        image_url: `https://placehold.co/600x400?text=${platform}+Product+3`,
        product_type: 'subscription'
      }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid grid-cols-6 gap-2">
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
            <TabsTrigger value="magento">Magento</TabsTrigger>
            <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
            <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Upload CSV or Excel File</Label>
              <Input 
                type="file" 
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <p className="text-sm text-muted-foreground">
                Upload a CSV or Excel file containing your product data
              </p>
            </div>
            <Button 
              onClick={() => importProducts('file')}
              disabled={!file || importing}
              className="w-full"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {importing ? 'Importing...' : 'Import from File'}
            </Button>
          </TabsContent>

          {['shopify', 'amazon', 'magento', 'woocommerce', 'salesforce'].map((platform) => (
            <TabsContent key={platform} value={platform} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{platform} API Key</Label>
                <Input
                  type="text"
                  placeholder={`Enter your ${platform} API key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Connect to your {platform} store to import products
                </p>
              </div>
              <Button
                onClick={() => importProducts(platform)}
                disabled={!apiKey || importing}
                className="w-full"
              >
                <Database className="mr-2 h-4 w-4" />
                {importing ? 'Importing...' : `Import from ${platform}`}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
