import type { Order } from '@core/api/services/orderService';

export interface NotificationMock {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface CustomerMock {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface UserMock {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    status: 'completed',
    customer: 'Alice Johnson',
    total: 149.99,
    createdAt: '2024-01-15',
  },
  {
    id: 'ORD-002',
    status: 'pending',
    customer: 'Bob Martinez',
    total: 89.5,
    createdAt: '2024-01-18',
  },
  {
    id: 'ORD-003',
    status: 'processing',
    customer: 'Carol Smith',
    total: 320.0,
    createdAt: '2024-01-20',
  },
  {
    id: 'ORD-004',
    status: 'completed',
    customer: 'David Lee',
    total: 54.75,
    createdAt: '2024-01-22',
  },
  {
    id: 'ORD-005',
    status: 'cancelled',
    customer: 'Eva Brown',
    total: 210.0,
    createdAt: '2024-01-25',
  },
  {
    id: 'ORD-006',
    status: 'pending',
    customer: 'Frank Wilson',
    total: 99.0,
    createdAt: '2024-01-27',
  },
  {
    id: 'ORD-007',
    status: 'completed',
    customer: 'Grace Kim',
    total: 430.25,
    createdAt: '2024-01-29',
  },
  {
    id: 'ORD-008',
    status: 'processing',
    customer: 'Henry Zhao',
    total: 175.5,
    createdAt: '2024-02-01',
  },
  {
    id: 'ORD-009',
    status: 'completed',
    customer: 'Irene Patel',
    total: 612.0,
    createdAt: '2024-02-03',
  },
  {
    id: 'ORD-010',
    status: 'cancelled',
    customer: "James O'Brien",
    total: 44.99,
    createdAt: '2024-02-05',
  },
  {
    id: 'ORD-011',
    status: 'pending',
    customer: 'Karen White',
    total: 289.0,
    createdAt: '2024-02-08',
  },
  {
    id: 'ORD-012',
    status: 'completed',
    customer: 'Liam Torres',
    total: 390.75,
    createdAt: '2024-02-10',
  },
  {
    id: 'ORD-013',
    status: 'processing',
    customer: 'Mia Chen',
    total: 58.0,
    createdAt: '2024-02-12',
  },
  {
    id: 'ORD-014',
    status: 'completed',
    customer: 'Noah Williams',
    total: 519.99,
    createdAt: '2024-02-14',
  },
  {
    id: 'ORD-015',
    status: 'pending',
    customer: 'Olivia Davis',
    total: 132.5,
    createdAt: '2024-02-16',
  },
  {
    id: 'ORD-016',
    status: 'cancelled',
    customer: 'Paul Anderson',
    total: 77.25,
    createdAt: '2024-02-18',
  },
  {
    id: 'ORD-017',
    status: 'completed',
    customer: 'Quinn Martinez',
    total: 840.0,
    createdAt: '2024-02-20',
  },
  {
    id: 'ORD-018',
    status: 'processing',
    customer: 'Rachel Green',
    total: 203.6,
    createdAt: '2024-02-22',
  },
  {
    id: 'ORD-019',
    status: 'completed',
    customer: 'Sam Taylor',
    total: 66.0,
    createdAt: '2024-02-24',
  },
  {
    id: 'ORD-020',
    status: 'pending',
    customer: 'Tina Robinson',
    total: 415.0,
    createdAt: '2024-02-26',
  },
  {
    id: 'ORD-021',
    status: 'completed',
    customer: 'Uma Patel',
    total: 950.5,
    createdAt: '2024-02-28',
  },
  {
    id: 'ORD-022',
    status: 'processing',
    customer: 'Victor Huang',
    total: 115.0,
    createdAt: '2024-03-01',
  },
  {
    id: 'ORD-023',
    status: 'cancelled',
    customer: 'Wendy Clark',
    total: 33.0,
    createdAt: '2024-03-03',
  },
  {
    id: 'ORD-024',
    status: 'completed',
    customer: 'Xavier Lewis',
    total: 720.25,
    createdAt: '2024-03-05',
  },
  {
    id: 'ORD-025',
    status: 'pending',
    customer: 'Yara Scott',
    total: 188.0,
    createdAt: '2024-03-07',
  },
];

export const mockNotifications: NotificationMock[] = [
  {
    id: '1',
    title: 'Order Updated',
    message: 'Order #12345 has been shipped',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'New Customer',
    message: 'New customer registered: ACME Corp',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    type: 'success',
  },
  {
    id: '3',
    title: 'System Alert',
    message: 'Scheduled maintenance window: 2:00 AM - 3:00 AM UTC',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    type: 'warning',
  },
];

export const mockCustomers: CustomerMock[] = [
  {
    id: 'C-101',
    name: 'Alice Johnson',
    email: 'alice@northwind.test',
    company: 'Northwind Traders',
    status: 'active',
  },
  {
    id: 'C-102',
    name: 'Bob Martinez',
    email: 'bob@contoso.test',
    company: 'Contoso Retail',
    status: 'pending',
  },
  {
    id: 'C-103',
    name: 'Carol Smith',
    email: 'carol@fabrikam.test',
    company: 'Fabrikam',
    status: 'inactive',
  },
  {
    id: 'C-104',
    name: 'David Lee',
    email: 'david@acme.test',
    company: 'Acme Corp',
    status: 'active',
  },
  {
    id: 'C-105',
    name: 'Eva Brown',
    email: 'eva@tailspin.test',
    company: 'Tailspin Toys',
    status: 'active',
  },
  {
    id: 'C-106',
    name: 'Frank Wilson',
    email: 'frank@woodgrove.test',
    company: 'Woodgrove Bank',
    status: 'pending',
  },
  {
    id: 'C-107',
    name: 'Grace Kim',
    email: 'grace@adventure.test',
    company: 'Adventure Works',
    status: 'active',
  },
  {
    id: 'C-108',
    name: 'Henry Zhao',
    email: 'henry@lucerne.test',
    company: 'Lucerne Publishing',
    status: 'inactive',
  },
  {
    id: 'C-109',
    name: 'Irene Patel',
    email: 'irene@proseware.test',
    company: 'Proseware',
    status: 'active',
  },
  {
    id: 'C-110',
    name: 'James Torres',
    email: 'james@litware.test',
    company: 'Litware Inc',
    status: 'active',
  },
  {
    id: 'C-111',
    name: 'Karen White',
    email: 'karen@coho.test',
    company: 'Coho Winery',
    status: 'pending',
  },
  {
    id: 'C-112',
    name: 'Liam Anderson',
    email: 'liam@relecloud.test',
    company: 'Relecloud',
    status: 'active',
  },
  {
    id: 'C-113',
    name: 'Mia Chen',
    email: 'mia@contoso.test',
    company: 'Contoso Ltd',
    status: 'inactive',
  },
  {
    id: 'C-114',
    name: 'Noah Williams',
    email: 'noah@wingtip.test',
    company: 'Wingtip Toys',
    status: 'active',
  },
  {
    id: 'C-115',
    name: 'Olivia Davis',
    email: 'olivia@alpine.test',
    company: 'Alpine Ski House',
    status: 'active',
  },
];

export const mockUsers: UserMock[] = [
  {
    id: 'U-201',
    name: 'Admin User',
    email: 'admin@acme.test',
    role: 'super_admin',
    status: 'active',
    lastActive: '2 minutes ago',
  },
  {
    id: 'U-202',
    name: 'Org Manager',
    email: 'manager@acme.test',
    role: 'org_admin',
    status: 'invited',
    lastActive: 'Never',
  },
  {
    id: 'U-203',
    name: 'Workspace User',
    email: 'user@acme.test',
    role: 'user',
    status: 'suspended',
    lastActive: '3 days ago',
  },
  {
    id: 'U-204',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.test',
    role: 'org_admin',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: 'U-205',
    name: 'Marcus Reid',
    email: 'marcus.reid@acme.test',
    role: 'user',
    status: 'active',
    lastActive: 'Yesterday',
  },
  {
    id: 'U-206',
    name: 'Priya Nair',
    email: 'priya.nair@acme.test',
    role: 'user',
    status: 'invited',
    lastActive: 'Never',
  },
  {
    id: 'U-207',
    name: 'Tom Bauer',
    email: 'tom.bauer@acme.test',
    role: 'user',
    status: 'active',
    lastActive: '4 hours ago',
  },
  {
    id: 'U-208',
    name: 'Leila Hassan',
    email: 'leila.hassan@acme.test',
    role: 'org_admin',
    status: 'active',
    lastActive: '30 minutes ago',
  },
  {
    id: 'U-209',
    name: 'James Okafor',
    email: 'james.okafor@acme.test',
    role: 'user',
    status: 'suspended',
    lastActive: '2 weeks ago',
  },
  {
    id: 'U-210',
    name: 'Nina Kovač',
    email: 'nina.kovac@acme.test',
    role: 'user',
    status: 'active',
    lastActive: '6 hours ago',
  },
  {
    id: 'U-211',
    name: 'Diego Flores',
    email: 'diego.flores@acme.test',
    role: 'user',
    status: 'invited',
    lastActive: 'Never',
  },
  {
    id: 'U-212',
    name: 'Aisha Patel',
    email: 'aisha.patel@acme.test',
    role: 'org_admin',
    status: 'active',
    lastActive: '10 minutes ago',
  },
];

export interface ProductSaleMock {
  date: string;
  'Gross margin': number;
  Revenue: number;
}

export const mockProductSales: ProductSaleMock[] = [
  { date: '1 Jul', 'Gross margin': 28000, Revenue: 38000 },
  { date: '2 Jul', 'Gross margin': 32000, Revenue: 54000 },
  { date: '3 Jul', 'Gross margin': 22000, Revenue: 55000 },
  { date: '4 Jul', 'Gross margin': 38000, Revenue: 48000 },
  { date: '5 Jul', 'Gross margin': 48000, Revenue: 33000 },
  { date: '6 Jul', 'Gross margin': 52000, Revenue: 40000 },
  { date: '7 Jul', 'Gross margin': 36000, Revenue: 62000 },
  { date: '8 Jul', 'Gross margin': 30000, Revenue: 44000 },
  { date: '9 Jul', 'Gross margin': 38000, Revenue: 42000 },
  { date: '10 Jul', 'Gross margin': 36000, Revenue: 50000 },
  { date: '11 Jul', 'Gross margin': 42000, Revenue: 48000 },
  { date: '12 Jul', 'Gross margin': 47000, Revenue: 66000 },
];

export interface CategorySaleMock {
  name: string;
  value: number;
  color: string;
}

export const mockCategorySales: CategorySaleMock[] = [
  { name: 'Living room', value: 25, color: 'violet.5' },
  { name: 'Kids', value: 17, color: 'blue.5' },
  { name: 'Office', value: 13, color: 'teal.5' },
  { name: 'Bedroom', value: 12, color: 'cyan.5' },
  { name: 'Kitchen', value: 9, color: 'green.5' },
  { name: 'Bathroom', value: 8, color: 'pink.5' },
  { name: 'Dining room', value: 6, color: 'red.5' },
  { name: 'Decor', value: 5, color: 'orange.4' },
  { name: 'Lighting', value: 3, color: 'yellow.5' },
  { name: 'Outdoor', value: 2, color: 'lime.5' },
];

export interface CountrySaleMock {
  country: string;
  value: number;
}

export const mockCountrySales: CountrySaleMock[] = [
  { country: 'Poland', value: 19 },
  { country: 'Austria', value: 15 },
  { country: 'Spain', value: 13 },
  { country: 'Romania', value: 12 },
  { country: 'France', value: 11 },
  { country: 'Italy', value: 11 },
  { country: 'Germany', value: 10 },
  { country: 'Ukraine', value: 9 },
];

export const mockCountryDotColors: string[] = [
  '#4263eb',
  '#1971c2',
  '#f03e3e',
  '#2f9e44',
  '#f08c00',
  '#862e9c',
  '#0c8599',
  '#74c0fc',
];

export interface SettingRowMock {
  title: string;
  description: string;
  enabled: boolean;
}

export const mockSettingRows: SettingRowMock[] = [
  {
    title: 'Email notifications',
    description: 'Receive alerts for orders, users, and account activity.',
    enabled: true,
  },
  {
    title: 'Compact navigation',
    description: 'Keep the sidebar collapsed by default on large screens.',
    enabled: false,
  },
  {
    title: 'Experimental features',
    description: 'Allow early access to tenant-specific beta features.',
    enabled: false,
  },
];
