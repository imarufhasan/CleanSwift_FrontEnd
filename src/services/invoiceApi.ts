import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Invoice = {
  _id: string;
  order: string;
  customer: string;
  invoiceNumber: string;
  total: number;
  lineItems?: Array<{
    name: string;
    amount: number;
    quantity: number;
  }>;
  paid: boolean;
  generatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type InvoiceDownloadLink = {
  invoice: Invoice;
  downloadUrl: string;
  expiresIn: number;
};

export const invoiceApi = api.injectEndpoints({
  endpoints: builder => ({
    getInvoiceByOrderId: builder.query<ApiResponse<Invoice>, string>({
      query: orderId => ({
        url: `/invoices/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Invoice', id: orderId },
      ],
    }),
    createInvoiceDownloadLink: builder.mutation<
      ApiResponse<InvoiceDownloadLink>,
      string
    >({
      query: orderId => ({
        url: `/invoices/order/${orderId}/download-link`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetInvoiceByOrderIdQuery,
  useCreateInvoiceDownloadLinkMutation,
} = invoiceApi;
