import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import exp from "constants";

export interface Product {
   productId: string,
   name: string,
   stock: ProductStock[]
}

export interface ProductStock {
   stockId: string,
   productId: string,
   size: number,
   quantity: number 
   price: number,
}

export interface NewProduct {
   name: string;
   productId?: string;
   stock: {
      size: number;
      quantity: number;
      price: number;
   }[];
}

export interface SaleSummary {
   saleSummaryId: string,
   totalValue: number,
   changePercentage?: number,
   date: string
}

export interface PurchaseSummary {
   purchaseSummaryId: string,
   totalPurchased: number,
   changePercentage?: number,
   date: string
}

export interface ExpenseSummary {
   expenseSummaryId: string,
   totalExpenses: number,
   date: string
}

export interface ExpenseByCategorySummary {
   expenseByCategorySummaryId: string,
   category: string,
   amount: string,
   date: string
}

export interface DashboardMetrics {
   // popularProducts: Product[],
   saleSummary: SaleSummary[],
   purchaseSummary: PurchaseSummary[],
   expenseSummary: ExpenseSummary[],
   expenseByCategorySummary: ExpenseByCategorySummary[]
}

export interface Customers {
   userId: string,
   name: string,
   phoneNumber: string,
   instagram: string,
   streetAddress: string,
   city: string,
   state: string,
   zipCode: string
}

export interface NewCustomer {
   name: string,
   phoneNumber: string,
   instagram: string,
   streetAddress: string,
   city: string,
   state: string,
   zipCode: string
}

export interface Sales {
   saleId: string,
   stockId: string,
   userId: string,
   quantity: number,
   salesPrice: number,
   timestamp: string
}

export interface NewSale {
   stockId: string,
   userId: string,
   quantity: number,
   salesPrice: number,
   timestamp: string
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: "api",
   tagTypes: ['DashboardMetrics', 'Products', 'Customers', 'Sales'],
   endpoints: (build) => ({
      getDashboardMetrics: build.query<DashboardMetrics, void>({
         query: () => '/dashboard',
         providesTags: ['DashboardMetrics']
      }),

      // Products
      getProducts: build.query<Product[], string | void>({
         query: (search) => ({
            url: '/products',
            params: search ? { search } : {}
         }),
         providesTags: ['Products']
      }),
      createProduct: build.mutation<Product, NewProduct>({
         query: (newProduct) => ({
            url: '/products',
            method: 'POST',
            body: {
               name: newProduct.name,
               stock: newProduct.stock
            }
         }),
         invalidatesTags: ['Products']
      }),
      deleteProduct: build.mutation<void, string>({
         query: (productId) => ({
            url: `/products/${productId}`,
            method: 'DELETE'
         }),
         invalidatesTags: ['Products']
      }),
      updateProduct: build.mutation<Product, Partial<Product>>({
         query: ({ productId, ...updatedFields }) => ({
            url: `/products/${productId}`,
            method: 'PUT',
            body: updatedFields,
         }),
         invalidatesTags: ['Products']
      }),

      // Product Stocks
      updateProductStock: build.mutation<Product, { productId: string, stock: ProductStock[] }>({
         query: ({ productId, stock }) => ({
            url: `/products/${productId}/stock`,
            method: 'POST',
            body: { stock },
         }),
         invalidatesTags: ['Products'],
      }),
      deleteProductStock: build.mutation<Product, { productId: string, stockId: string }>({
         query: ({ productId, stockId }) => ({
            url: `/products/${productId}/stock/${stockId}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['Products'],
      }),

      // Customers
      getCustomers: build.query<Customers[], void>({
         query: () => '/customers',
         providesTags: ['Customers']
      }),
      getCustomer: build.query<Customers, string>({
         query: (userId) => `/customers/${userId}`,
         providesTags: ['Customers']
      }),
      createCustomer: build.mutation<Customers[], NewCustomer>({
         query: (newCustomer) => ({
            url: '/customers',
            method: 'POST',
            body: newCustomer
         }),
         invalidatesTags: ['Customers']
      }),
      deleteCustomer: build.mutation<void, string>({
         query: (userId) => ({
            url: `/customers/${userId}`,
            method: 'DELETE'
         }),
         invalidatesTags: ['Customers']
      }),
      updateCustomer: build.mutation<Customers, Partial<Customers>>({
         query: ({ userId, ...updatedFields }) => ({
            url: `/customers/${userId}`,
            method: 'PUT',
            body: updatedFields
         }),
         invalidatesTags: ['Customers']
      }),

      // Sales
      newSale: build.mutation<Sales, NewSale>({
         query: (saleData) => ({
           url: '/sales',
           method: 'POST',
           body: saleData,
         }),
         invalidatesTags: ['Sales'],
       }),
   }),
})

export const { 
   useGetDashboardMetricsQuery, 
   useGetProductsQuery, 
   useCreateProductMutation, 
   useDeleteProductMutation,
   useUpdateProductMutation,
   useUpdateProductStockMutation,
   useDeleteProductStockMutation,
   useGetCustomersQuery,
   useGetCustomerQuery,
   useDeleteCustomerMutation,
   useCreateCustomerMutation,
   useUpdateCustomerMutation,
   useNewSaleMutation
} = api;