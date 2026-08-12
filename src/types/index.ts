export interface CustomOrderItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  deliveryTime: string;
}

export type CategoryType = 
  | 'TODOS'
  | 'HUD' 
  | 'Sistemas' 
  | 'Scripts' 
  | 'Maps' 
  | 'Vehicles' 
  | 'Jobs' 
  | 'UI' 
  | 'AntiCheat' 
  | 'Roleplay' 
  | 'Free Resources';

export type ProductBadge = 'NUEVO' | 'BEST SELLER' | 'FREE' | 'SALE' | 'DESTACADO';

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  screenshots: string[];
  videoUrl?: string;
  version: string;
  lastUpdated: string;
  changelog: string[];
  requirements: string[];
  mtaCompatibility: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  badge?: ProductBadge;
  isFree: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  downloadUrl?: string;
  productIdCode: string; // e.g. "MTA-HUD-01"
}

export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  productName: string;
  userId: string;
  username: string;
  discordId?: string;
  serverIp: string;
  serverPort: number;
  status: LicenseStatus;
  activatedAt: string;
  lastValidatedAt: string;
  ipResetCooldownUntil?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  discordId?: string;
  registeredAt: string;
  totalSpent: number;
  purchasedProductIds: string[];
  activeLicenseCount: number;
  hideInRanking: boolean;
  isAdmin: boolean;
  favorites: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  username: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  amount: number;
  paymentMethod: 'CARD' | 'PAYPAL' | 'DISCORD_PAY' | 'GIFT' | 'FREE';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  transactionId: string;
  licenseKey?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  username: string;
  userAvatar: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  sender: string;
  senderRole: 'USER' | 'ADMIN';
  avatar: string;
  message: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  username: string;
  userAvatar: string;
  subject: string;
  category: string;
  message: string;
  productId?: string;
  productName?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  user: string;
  details: string;
  ip: string;
}

export interface TopBuyer {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  totalPurchases: number;
  totalSpent: number;
  discordId?: string;
  hideInRanking?: boolean;
}

export interface LicenseValidationRequest {
  license_key: string;
  product_id: string;
  discord_id?: string;
  server_ip: string;
  server_port: number;
}

export interface LicenseValidationResponse {
  valid: boolean;
  reason?: 'INVALID_LICENSE' | 'PRODUCT_NOT_OWNED' | 'IP_MISMATCH' | 'PORT_MISMATCH' | 'LICENSE_REVOKED' | 'LICENSE_EXPIRED' | 'INVALID_REQUEST' | 'SUCCESS';
  product?: string;
  status?: LicenseStatus;
  bound_ip?: string;
  bound_port?: number;
  validated_at?: string;
}
