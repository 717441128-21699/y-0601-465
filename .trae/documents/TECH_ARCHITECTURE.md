## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层 Frontend"
        A1["React 18 + TypeScript"]
        A2["React Router Dom 路由"]
        A3["Zustand 状态管理"]
        A4["TailwindCSS 3 样式"]
        A5["Lucide React 图标"]
    end
    
    subgraph "后端层 Backend"
        B1["Express 4 API Server"]
        B2["票务控制器"]
        B3["教练控制器"]
        B4["租赁控制器"]
        B5["雪道控制器"]
        B6["救援控制器"]
        B7["财务控制器"]
        B8["消息推送控制器"]
    end
    
    subgraph "数据层 Data"
        C1["内存数据存储 (Mock)"]
        C2["用户数据"]
        C3["票务订单"]
        C4["教练数据"]
        C5["租赁记录"]
        C6["雪道状态"]
        C7["救援记录"]
        C8["财务数据"]
    end
    
    subgraph "服务层 Services"
        D1["动态定价算法"]
        D2["教练匹配推荐"]
        D3["器材尺码推荐"]
        D4["雪道状态判断"]
        D5["救援人员调度"]
        D6["赔偿金额计算"]
    end
    
    A1 --> A2
    A1 --> A3
    A1 --> A4
    A1 --> A5
    A1 --> B1
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    B1 --> B7
    B1 --> B8
    B2 --> D1
    B3 --> D2
    B4 --> D3
    B4 --> D6
    B5 --> D4
    B6 --> D5
    B2 --> C1
    B3 --> C1
    B4 --> C1
    B5 --> C1
    B6 --> C1
    B7 --> C1
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> C5
    C1 --> C6
    C1 --> C7
    C1 --> C8
```

## 2. 技术描述

- **前端**：React@18 + TypeScript + React Router Dom@6 + Zustand + TailwindCSS@3 + Lucide React
- **构建工具**：Vite 5
- **后端**：Express@4 + TypeScript
- **数据库**：内存Mock数据（开发演示用），可后续扩展SQLite
- **初始化工具**：vite-init (react-express-ts 模板)

## 3. 路由定义

| 路由路径 | 页面用途 | 访问角色 |
|---------|---------|---------|
| /login | 登录与角色选择页 | 所有 |
| /visitor/dashboard | 游客首页仪表盘 | 游客 |
| /visitor/tickets | 票务购买页 | 游客 |
| /visitor/tickets/mine | 我的雪票 | 游客 |
| /visitor/coaches | 教练预约列表 | 游客 |
| /visitor/coaches/my | 我的预约 | 游客 |
| /visitor/rentals | 雪具租赁 | 游客 |
| /visitor/rentals/my | 我的租赁 | 游客 |
| /visitor/slopes | 雪道状态地图 | 游客 |
| /visitor/sos | 一键呼救 | 游客 |
| /coach/dashboard | 教练仪表盘 | 教练 |
| /coach/schedule | 我的课表 | 教练 |
| /coach/checkin | 签到扫码 | 教练 |
| /coach/income | 收入与评价 | 教练 |
| /rental/dashboard | 雪具管理仪表盘 | 管理员 |
| /rental/lend | 扫码领取 | 管理员 |
| /rental/return | 归还检查 | 管理员 |
| /rental/inventory | 库存管理 | 管理员 |
| /manager/dashboard | 运营仪表盘 | 经理 |
| /manager/slopes | 雪道巡检 | 经理 |
| /manager/rescue | 救援调度 | 经理 |
| /finance/dashboard | 财务总览 | 财务 |
| /finance/reports | 运营报表 | 财务 |
| /messages | 消息通知中心 | 所有 |

## 4. API 定义

```typescript
// 用户相关
interface User {
  id: string;
  role: 'visitor' | 'coach' | 'rental_admin' | 'manager' | 'finance';
  name: string;
  phone?: string;
  employeeId?: string;
  avatar?: string;
}

// 票务相关
interface TicketOrder {
  id: string;
  visitorId: string;
  date: string;
  ticketType: 'adult' | 'child' | 'senior' | 'halfday';
  basePrice: number;
  dynamicFactor: number;
  finalPrice: number;
  qrCode: string;
  status: 'paid' | 'used' | 'refunded';
  createdAt: string;
}

interface DynamicPriceParams {
  date: string;
  ticketType: string;
  weather: string;
  historicalFlow: number;
}

// 教练相关
interface Coach {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  rating: number;
  ratingCount: number;
  specialties: string[];
  hourlyRate: number;
  avatar: string;
  availableSlots: string[];
}

interface CoachBooking {
  id: string;
  visitorId: string;
  coachId: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'booked' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
}

// 雪具租赁相关
interface Equipment {
  id: string;
  type: 'snowboard' | 'ski' | 'helmet' | 'boots' | 'jacket' | 'pants';
  brand: string;
  model: string;
  size: string;
  status: 'available' | 'rented' | 'damaged' | 'maintenance';
  dailyPrice: number;
}

interface RentalOrder {
  id: string;
  visitorId: string;
  items: { equipmentId: string; size: string }[];
  visitorHeight: number;
  visitorWeight: number;
  status: 'reserved' | 'picked' | 'returned' | 'damaged';
  totalPrice: number;
  damageFee?: number;
  damageLevel?: 'none' | 'minor' | 'moderate' | 'severe';
}

// 雪道相关
interface Slope {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  length: number;
  status: 'open' | 'closed' | 'caution';
  capacity: number;
  currentCount: number;
  lastInspection: string;
}

interface InspectionRecord {
  id: string;
  slopeId: string;
  managerId: string;
  snowQuality: number;
  temperature: number;
  visibility: number;
  safetyHazards: string[];
  notes: string;
  createdAt: string;
}

// 救援相关
interface RescueEvent {
  id: string;
  visitorId?: string;
  visitorName: string;
  slopeId: string;
  location: { x: number; y: number };
  type: 'injury' | 'lost' | 'equipment' | 'other';
  status: 'pending' | 'dispatched' | 'in_progress' | 'completed';
  rescuerId: string;
  report?: string;
  photos?: string[];
  createdAt: string;
  completedAt?: string;
}

// 财务相关
interface FinanceReport {
  period: string;
  ticketRevenue: number;
  coachRevenue: number;
  rentalRevenue: number;
  damageRevenue: number;
  totalRevenue: number;
  slopeBreakdown: { slopeId: string; name: string; revenue: number }[];
  coachBreakdown: { coachId: string; name: string; revenue: number }[];
}

// 消息相关
interface Message {
  id: string;
  userId: string;
  type: 'ticket' | 'booking' | 'rental' | 'slope' | 'rescue' | 'finance' | 'system';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}
```

## 5. 后端服务架构

```mermaid
graph LR
    A["API Routes 路由层"] --> B["Controller 控制器层"]
    B --> C["Service 服务层"]
    C --> D["Repository 数据访问层"]
    D --> E["Mock Data Store 内存存储"]
    
    subgraph "路由模块"
        A1["/api/auth"]
        A2["/api/tickets"]
        A3["/api/coaches"]
        A4["/api/rentals"]
        A5["/api/slopes"]
        A6["/api/rescue"]
        A7["/api/finance"]
        A8["/api/messages"]
    end
    
    subgraph "服务模块"
        C1["PricingService 动态定价"]
        C2["CoachMatchService 教练匹配"]
        C3["EquipmentRecService 器材推荐"]
        C4["SlopeStatusService 状态判断"]
        C5["RescueDispatchService 救援调度"]
        C6["DamageCalcService 赔偿计算"]
    end
    
    A --> A1
    A --> A2
    A --> A3
    A --> A4
    A --> A5
    A --> A6
    A --> A7
    A --> A8
    C --> C1
    C --> C2
    C --> C3
    C --> C4
    C --> C5
    C --> C6
```

## 6. 数据模型

### 6.1 ER 图

```mermaid
erDiagram
    USER ||--o{ TICKET_ORDER : "购买"
    USER ||--o{ COACH_BOOKING : "预约"
    USER ||--o{ RENTAL_ORDER : "租赁"
    USER ||--o{ RESCUE_EVENT : "发起"
    USER ||--o{ MESSAGE : "接收"
    COACH ||--o{ COACH_BOOKING : "被预约"
    EQUIPMENT ||--o{ RENTAL_ITEM : "被租用"
    RENTAL_ORDER ||--o{ RENTAL_ITEM : "包含"
    SLOPE ||--o{ INSPECTION_RECORD : "被巡检"
    SLOPE ||--o{ RESCUE_EVENT : "发生于"
    RESCUER ||--o{ RESCUE_EVENT : "执行"
    
    USER {
        string id PK
        string role
        string name
        string phone
    }
    
    TICKET_ORDER {
        string id PK
        string visitorId FK
        date date
        string ticketType
        number finalPrice
        string status
    }
    
    COACH {
        string id PK
        string name
        number level
        number rating
        number hourlyRate
    }
    
    COACH_BOOKING {
        string id PK
        string visitorId FK
        string coachId FK
        datetime startTime
        number rating
    }
    
    EQUIPMENT {
        string id PK
        string type
        string size
        string status
        number dailyPrice
    }
    
    RENTAL_ORDER {
        string id PK
        string visitorId FK
        string status
        number totalPrice
        number damageFee
    }
    
    SLOPE {
        string id PK
        string name
        string difficulty
        string status
        number capacity
    }
    
    INSPECTION_RECORD {
        string id PK
        string slopeId FK
        number snowQuality
        number temperature
        date createdAt
    }
    
    RESCUE_EVENT {
        string id PK
        string slopeId FK
        string type
        string status
        string rescuerId
    }
    
    MESSAGE {
        string id PK
        string userId FK
        string type
        string content
        boolean read
    }
```

### 6.2 初始化数据要点

- 预置 20 位教练（1-5星各4名）
- 预置 12 条雪道（初/中/高/专家级各3条）
- 预置 500 件各类雪具装备
- 预置 5 种角色的演示账号
- 预置近30天的历史客流数据用于动态定价
