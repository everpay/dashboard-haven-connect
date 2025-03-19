
export const sampleInvoiceData = [
  {
    id: 1,
    merchant_id: '0',  // This should be set to the actual merchant id
    customer_name: 'John Smith',
    customer_email: 'john.smith@example.com',
    total_amount: 499.99,
    issue_date: '2023-06-01',
    due_date: '2023-06-30',
    status: 'Paid'
  },
  {
    id: 2,
    merchant_id: '0',
    customer_name: 'Emily Johnson',
    customer_email: 'emily.johnson@example.com',
    total_amount: 299.50,
    issue_date: '2023-06-15',
    due_date: '2023-07-15',
    status: 'Pending'
  },
  {
    id: 3,
    merchant_id: '0',
    customer_name: 'Michael Brown',
    customer_email: 'michael.brown@example.com',
    total_amount: 1250.00,
    issue_date: '2023-05-20',
    due_date: '2023-06-19',
    status: 'Overdue'
  },
  {
    id: 4,
    merchant_id: '0',
    customer_name: 'Sarah Davis',
    customer_email: 'sarah.davis@example.com',
    total_amount: 750.25,
    issue_date: '2023-06-25',
    due_date: '2023-07-25',
    status: 'Draft'
  },
  {
    id: 5,
    merchant_id: '0',
    customer_name: 'Robert Wilson',
    customer_email: 'robert.wilson@example.com',
    total_amount: 1899.99,
    issue_date: '2023-05-15',
    due_date: '2023-06-14',
    status: 'Cancelled'
  }
];

export const updateSampleInvoices = async (merchantId: string) => {
  // In a real implementation, you'd update the sample data with the real merchant ID
  return sampleInvoiceData.map(invoice => ({
    ...invoice,
    merchant_id: merchantId
  }));
};
