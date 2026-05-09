import type { AppRole } from './moduleRegistry';

export interface DashboardWidgets {
  customerStats: boolean;
  revenueStats: boolean;
  ordersStats: boolean;
  returnsStats: boolean;
  productSalesChart: boolean;
  categoryChart: boolean;
  countryChart: boolean;
}

export const DASHBOARD_WIDGETS: Record<AppRole, DashboardWidgets> = {
  super_admin: {
    customerStats: true,
    revenueStats: true,
    ordersStats: true,
    returnsStats: true,
    productSalesChart: true,
    categoryChart: true,
    countryChart: true,
  },
  org_admin: {
    customerStats: true,
    revenueStats: true,
    ordersStats: true,
    returnsStats: true,
    productSalesChart: true,
    categoryChart: true,
    countryChart: false,
  },
  user: {
    customerStats: false,
    revenueStats: false,
    ordersStats: true,
    returnsStats: true,
    productSalesChart: false,
    categoryChart: false,
    countryChart: false,
  },
};
