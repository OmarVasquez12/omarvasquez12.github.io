import { Product, TopBuyer, Review, License, Order, User, Ticket, AuditLog, CustomOrderItem } from '../types';

export const INITIAL_CUSTOM_ORDERS: CustomOrderItem[] = [
  {
    id: 'custom-1',
    title: 'Sistema de Facciones & Guerra de Bandas 3D',
    description: 'Scripting custom en Lua a medida con interfaz DxDraw, mapas 3D y guardado en MySQL Pooled.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    category: 'Lua Scripting Custom',
    deliveryTime: '3-5 Días'
  },
  {
    id: 'custom-2',
    title: 'HUD & UI Redesign Completo para Servidor Roleplay',
    description: 'Diseño vectorial e implementación en MTA con gráficos de alto rendimiento a 60 FPS.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    category: 'Diseño UI / UX',
    deliveryTime: '2-4 Días'
  },
  {
    id: 'custom-3',
    title: 'Optimizador de Servidor & AntiLag Fix',
    description: 'Auditoría de memoria Lua, refactorización de eventos y limpieza de scripts pesados.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'Optimización Server',
    deliveryTime: '1-2 Días'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'xf-hud-cyberpunk-v2',
    name: 'XF HUD Cyberpunk V2 Pro',
    shortDescription: 'HUD futurista vectorizado con velocímetro custom, indicador de sed/hambre, estado de vehículo y mapa redondo minimapa.',
    fullDescription: 'Un HUD ultraligero y optimizado a 60 FPS escrito en DxDraw y Lua puro para MTA:SA. Incluye velocímetro analógico/digital, indicador de salud, chaleco, resistencia, estado de motor, gasolina, cinturón de seguridad, integración con Discord RPC y menú de personalización de colores RGB para los jugadores.',
    category: 'HUD',
    price: 14.99,
    originalPrice: 24.99,
    discountPercent: 40,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    version: '2.4.1',
    lastUpdated: '2026-08-01',
    changelog: [
      'v2.4.1: Optimización de memoria en DxDraw (0.01ms CPU).',
      'v2.4.0: Añadido soporte para resolución Ultrawide 21:9 y 4K.',
      'v2.3.0: Sistema de velocímetro RPM dinámico con sonidos de turbos.'
    ],
    requirements: ['MTA:SA Server v1.5.9+', 'ACL Admin Permissions', 'DxDraw Library'],
    mtaCompatibility: 'MTA 1.5.9 & 1.6 All Build Systems',
    rating: 4.9,
    reviewCount: 38,
    salesCount: 245,
    badge: 'BEST SELLER',
    isFree: false,
    isFeatured: true,
    isBestSeller: true,
    productIdCode: 'MTA-HUD-01'
  },
  {
    id: 'prod-2',
    slug: 'xf-roleplay-inventory-v3',
    name: 'XF Inventory Grid & Crafting RP',
    shortDescription: 'Sistema de inventario de cuadrícula Drag & Drop con crafteo, mochilas, baúl de vehículos y licencias vinculadas.',
    fullDescription: 'Inventario estilo Roleplay moderno con soporte para ítems con peso, durabilidad, armas personalizadas, contenedores, robar a otros jugadores, baúles de autos sincronizados y sistema de crafteo por recetas. Incluye soporte para Discord Logs de ítems tirados y transferidos.',
    category: 'Sistemas',
    price: 29.99,
    originalPrice: 39.99,
    discountPercent: 25,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    ],
    version: '3.1.0',
    lastUpdated: '2026-08-05',
    changelog: [
      'v3.1.0: Sistema de crafteo avanzado con animación 3D.',
      'v3.0.0: Reescritura completa del backend MySQL con Pooled DB.'
    ],
    requirements: ['MTA:SA v1.5.9+', 'MySQL / MariaDB Database'],
    mtaCompatibility: 'MTA 1.5.9 / 1.6',
    rating: 5.0,
    reviewCount: 52,
    salesCount: 310,
    badge: 'DESTACADO',
    isFree: false,
    isFeatured: true,
    isBestSeller: true,
    productIdCode: 'MTA-SYS-02'
  },
  {
    id: 'prod-3',
    slug: 'xf-anticheat-shield-v5',
    name: 'XF Shield AntiCheat & Protection API',
    shortDescription: 'Protector de servidor contra Script Injections, Mod Menus, SpeedHack, Fly, Money Hacks y Aimbot.',
    fullDescription: 'La protección definitiva para servidores MTA. Detecta automáticamente inyecciones de Lua del cliente, memoria modificada, archivos dff/txd maliciosos, cleo scripts, airbreak y teleportación sin falsos positivos. Genera baneos automáticos sincronizados con tu panel de control y avisos inmediatos a Discord Webhook.',
    category: 'AntiCheat',
    price: 34.99,
    originalPrice: 49.99,
    discountPercent: 30,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    version: '5.2.0',
    lastUpdated: '2026-08-10',
    changelog: [
      'v5.2.0: Nueva heurística anti-aimbot por paquetes de rotación.',
      'v5.1.0: Bloqueo de ejecuciones remotas desencadenadas por triggerServerEvent falsos.'
    ],
    requirements: ['MTA:SA v1.5.9+', 'ACL Admin Full Access'],
    mtaCompatibility: 'MTA 1.5.9+',
    rating: 4.95,
    reviewCount: 84,
    salesCount: 420,
    badge: 'BEST SELLER',
    isFree: false,
    isFeatured: true,
    isBestSeller: true,
    productIdCode: 'MTA-AC-03'
  },
  {
    id: 'prod-4',
    slug: 'xf-jobs-mechanic-delivery',
    name: 'XF Advanced Jobs Pack (Mecánico + Delivery + Camionero)',
    shortDescription: 'Paquete de 3 trabajos súper interactivos con minijuegos, niveles de habilidad y vehículos de empresa.',
    fullDescription: 'Eleva el juego de rol en tu servidor con este paquete de 3 trabajos listos para instalar. Incluye trabajo de Mecánico con reparación física de partes de motor, Camionero de larga distancia con remolques pesados y Delivery en moto con app de entregas estilo Uber Eats.',
    category: 'Jobs',
    price: 19.99,
    originalPrice: 29.99,
    discountPercent: 33,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    version: '1.8.0',
    lastUpdated: '2026-07-28',
    changelog: ['v1.8.0: Recompensas dinámicas ajustables por archivo config.lua.'],
    requirements: ['MTA:SA v1.5.9+'],
    mtaCompatibility: 'MTA 1.5.9 / 1.6',
    rating: 4.8,
    reviewCount: 22,
    salesCount: 165,
    badge: 'NUEVO',
    isFree: false,
    isFeatured: false,
    isBestSeller: false,
    productIdCode: 'MTA-JOB-04'
  },
  {
    id: 'prod-5',
    slug: 'xf-map-los-santos-dealer-hd',
    name: 'XF Concesionario Los Santos Luxury HD Map',
    shortDescription: 'Mapeado 3D HQ exclusivo para concesionario de autos deportivos con interior detallado e iluminación nocturna neon.',
    fullDescription: 'Mapeado optimizado de alta definición ubicado en el centro de Los Santos. Cuenta con área de exhibición iluminada, oficinas administrativas, área de entrega de llaves, estacionamiento subterráneo y archivos .txd/.dff ultra optimizados para no provocar caídas de FPS.',
    category: 'Maps',
    price: 12.50,
    originalPrice: 18.00,
    discountPercent: 30,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    version: '1.2.0',
    lastUpdated: '2026-07-20',
    changelog: ['v1.2.0: Colisiones mejoradas e iluminación nocturna neon fija.'],
    requirements: ['MTA:SA Engine LOD Support'],
    mtaCompatibility: 'MTA 1.5.9 / 1.6',
    rating: 4.7,
    reviewCount: 19,
    salesCount: 130,
    badge: 'SALE',
    isFree: false,
    isFeatured: false,
    isBestSeller: false,
    productIdCode: 'MTA-MAP-05'
  },
  {
    id: 'prod-6',
    slug: 'xf-free-speedometer-basic',
    name: 'XF Clean Speedometer Free Edition',
    shortDescription: 'Velocímetro básico, minimalista y gratuito con velocímetro digital, fuel bar e indicador de luces.',
    fullDescription: 'Recurso completamente gratuito ofrecido por XF CODE para la comunidad MTA:SA. Un velocímetro moderno, limpio y muy fácil de editar en Lua sin ningún tipo de restricción.',
    category: 'Free Resources',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
    ],
    version: '1.0.0',
    lastUpdated: '2026-08-01',
    changelog: ['v1.0.0: Lanzamiento inicial gratuito para la comunidad.'],
    requirements: ['MTA:SA v1.5.9+'],
    mtaCompatibility: 'MTA 1.5.9+',
    rating: 4.9,
    reviewCount: 112,
    salesCount: 1890,
    badge: 'FREE',
    isFree: true,
    isFeatured: true,
    isBestSeller: false,
    productIdCode: 'MTA-FREE-06'
  },
  {
    id: 'prod-7',
    slug: 'xf-ui-login-dashboard-futuristic',
    name: 'XF UI Login Panel & Character Selector',
    shortDescription: 'Panel de Login/Registro futurista con música de fondo, selector de personajes 3D y vinculación con Discord.',
    fullDescription: 'Panel de inicio de sesión ultra estético con selector de personaje en tiempo real, efectos Blur de fondo, recuperador de contraseña directo y sistema de registro con código de verificación de correo o Discord OAuth.',
    category: 'UI',
    price: 16.00,
    originalPrice: 22.00,
    discountPercent: 27,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
    ],
    version: '2.1.0',
    lastUpdated: '2026-08-02',
    changelog: ['v2.1.0: Integración con CEF browser y animaciones CSS3.'],
    requirements: ['CEF Enabled or DxDraw fallback'],
    mtaCompatibility: 'MTA 1.5.9+',
    rating: 4.85,
    reviewCount: 29,
    salesCount: 198,
    badge: 'NUEVO',
    isFree: false,
    isFeatured: false,
    isBestSeller: false,
    productIdCode: 'MTA-UI-07'
  },
  {
    id: 'prod-8',
    slug: 'xf-free-admin-system-lite',
    name: 'XF Admin System Lite (Free)',
    shortDescription: 'Sistema de administración ligero con comandos de sanción, teletransporte, espectador y logs a Discord.',
    fullDescription: 'Un panel de administración 100% gratuito optimizado para servidores de práctica o servidores nuevos. Incluye comandos como /ban, /kick, /jail, /spec, /goto, /bring y sistema de reporte de jugadores.',
    category: 'Free Resources',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    ],
    version: '1.1.0',
    lastUpdated: '2026-07-15',
    changelog: ['v1.1.0: Añadido soporte para Discord Webhook Logs.'],
    requirements: ['ACL Admin permissions'],
    mtaCompatibility: 'MTA 1.5.9+',
    rating: 4.92,
    reviewCount: 95,
    salesCount: 2150,
    badge: 'FREE',
    isFree: true,
    isFeatured: true,
    isBestSeller: false,
    productIdCode: 'MTA-FREE-08'
  }
];

export const INITIAL_TOP_BUYERS: TopBuyer[] = [
  {
    rank: 1,
    userId: 'usr-101',
    username: 'ApexDeveloper_MTA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=200',
    totalPurchases: 14,
    totalSpent: 389.50,
    discordId: '384910293847129834',
    hideInRanking: false
  },
  {
    rank: 2,
    userId: 'usr-102',
    username: 'KryptonRP_Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=200',
    totalPurchases: 11,
    totalSpent: 295.00,
    discordId: '839210492817263541',
    hideInRanking: false
  },
  {
    rank: 3,
    userId: 'usr-103',
    username: 'GhostRider_MTA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=200',
    totalPurchases: 9,
    totalSpent: 210.80,
    discordId: '192837465019283746',
    hideInRanking: false
  },
  {
    rank: 4,
    userId: 'usr-104',
    username: 'OverlordServer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=200',
    totalPurchases: 7,
    totalSpent: 168.00,
    discordId: '992831029384756123',
    hideInRanking: false
  },
  {
    rank: 5,
    userId: 'usr-105',
    username: 'NexusGaming_Latam',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=200',
    totalPurchases: 6,
    totalSpent: 142.50,
    discordId: '475839201928374650',
    hideInRanking: false
  }
];

export const INITIAL_USER: User = {
  id: 'usr-me',
  username: 'XF_Client_Vip',
  email: 'usuario@xfcode.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=200',
  discordId: '772910293817263549',
  registeredAt: '2026-01-15',
  totalSpent: 79.97,
  purchasedProductIds: ['prod-1', 'prod-2', 'prod-6'],
  activeLicenseCount: 2,
  hideInRanking: false,
  isAdmin: true, // Has access to admin panel for demo & control
  favorites: ['prod-3', 'prod-4']
};

export const INITIAL_LICENSES: License[] = [
  {
    id: 'lic-1001',
    licenseKey: 'XF-77A9-9B21-44EF',
    productId: 'prod-1',
    productName: 'XF HUD Cyberpunk V2 Pro',
    userId: 'usr-me',
    username: 'XF_Client_Vip',
    discordId: '772910293817263549',
    serverIp: '185.220.101.45',
    serverPort: 22003,
    status: 'ACTIVE',
    activatedAt: '2026-02-10 14:22:00',
    lastValidatedAt: '2026-08-11 09:15:22'
  },
  {
    id: 'lic-1002',
    licenseKey: 'XF-33B8-11C2-88FA',
    productId: 'prod-2',
    productName: 'XF Inventory Grid & Crafting RP',
    userId: 'usr-me',
    username: 'XF_Client_Vip',
    discordId: '772910293817263549',
    serverIp: '185.220.101.45',
    serverPort: 22003,
    status: 'ACTIVE',
    activatedAt: '2026-03-01 18:40:11',
    lastValidatedAt: '2026-08-11 08:30:00'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9001',
    orderNumber: 'XF-ORD-2026-001',
    userId: 'usr-me',
    username: 'XF_Client_Vip',
    userEmail: 'usuario@xfcode.com',
    productId: 'prod-1',
    productName: 'XF HUD Cyberpunk V2 Pro',
    productImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    amount: 14.99,
    paymentMethod: 'CARD',
    status: 'PAID',
    createdAt: '2026-02-10 14:22:00',
    transactionId: 'txn_stripe_9921827412',
    licenseKey: 'XF-77A9-9B21-44EF'
  },
  {
    id: 'ord-9002',
    orderNumber: 'XF-ORD-2026-002',
    userId: 'usr-me',
    username: 'XF_Client_Vip',
    userEmail: 'usuario@xfcode.com',
    productId: 'prod-2',
    productName: 'XF Inventory Grid & Crafting RP',
    productImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    amount: 29.99,
    paymentMethod: 'PAYPAL',
    status: 'PAID',
    createdAt: '2026-03-01 18:40:11',
    transactionId: 'PAYID-MTA-992817234',
    licenseKey: 'XF-33B8-11C2-88FA'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'usr-101',
    username: 'ApexDeveloper_MTA',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=200',
    rating: 5,
    comment: 'Increíble HUD. Cero lag, consumos mínimos de 0.01ms CPU en MTA y la interfaz neon se ve espectacular en el servidor.',
    isVerifiedPurchase: true,
    createdAt: '2026-07-25'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'usr-102',
    username: 'KryptonRP_Owner',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=200',
    rating: 5,
    comment: 'La integración con la API de licencias funcionó a la primera. El soporte de XF CODE respondió mis dudas en 5 minutos.',
    isVerifiedPurchase: true,
    createdAt: '2026-08-01'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-8841',
    userId: 'usr-me',
    username: 'XF_Client_Vip',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=200',
    subject: 'Duda de vinculación de IP de servidor MTA',
    category: 'Licencias & IP',
    message: 'Hola equipo XF CODE, cambié de VPS hosting y necesito validar si la nueva IP requiere puerto específico.',
    productId: 'prod-1',
    productName: 'XF HUD Cyberpunk V2 Pro',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-10 11:20:00',
    updatedAt: '2026-08-10 12:00:00',
    messages: [
      {
        id: 'msg-1',
        sender: 'XF_Client_Vip',
        senderRole: 'USER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=200',
        message: 'Hola equipo XF CODE, cambié de VPS hosting y necesito validar si la nueva IP requiere puerto específico.',
        createdAt: '2026-08-10 11:20:00'
      },
      {
        id: 'msg-2',
        sender: 'Soporte XF CODE',
        senderRole: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=200',
        message: 'Hola! Sí, debes indicar la IP pública de tu servidor VPS y el puerto UDP por el que escucha tu MTA (por defecto 22003). Puedes usar el botón "Reset IP" de tu panel.',
        createdAt: '2026-08-10 12:00:00'
      }
    ]
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-11 10:15:22',
    action: 'LICENSE_VALIDATE',
    target: 'XF HUD Cyberpunk V2 Pro',
    user: 'MTA_Server_185.220.101.45:22003',
    details: 'Remote API validation success (License: XF-77A9-9B21-44EF)',
    ip: '185.220.101.45'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-11 09:40:11',
    action: 'USER_LOGIN',
    target: 'Client Dashboard',
    user: 'XF_Client_Vip',
    details: 'Login via Session Auth',
    ip: '190.22.45.12'
  }
];
