# AME (Accounting Made Easy) - Complete Entity Relationship Diagram

## Comprehensive Database Schema

---

## ENTITY DEFINITIONS (Complete Attributes)

### **1. USER Entity**
```
┌─────────────────────────────────────────────────┐
│                    USER                         │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│     fullName            : String (required)     │
│ UK  email               : String (unique, req)  │
│     password            : String (hashed, req)  │
│     phoneNumber         : String (required)     │
│     role                : Enum ['owner','admin',│
│                           'staff'] (def:'owner')│
│ FK  businessId          : ObjectId → Business   │
│     isVerified          : Boolean (def:false)   │
│     verificationToken   : String                │
│     resetPasswordToken  : String                │
│     resetPasswordExpires: Date                  │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

### **2. BUSINESS Entity**
```
┌─────────────────────────────────────────────────┐
│                  BUSINESS                       │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│     businessName        : String (required)     │
│     businessType        : Enum ['retail',       │
│                           'wholesale','service',│
│                           'freelance']          │
│ UK  gstin               : String (unique,sparse)│
│     address             : Object {              │
│       street            : String                │
│       city              : String                │
│       state             : String                │
│       pincode           : String                │
│     }                                           │
│     logo                : String (URL)          │
│ FK  owner               : ObjectId → User (req) │
│     currency            : String (def:'INR')    │
│     fiscalYearStart     : String                │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

### **3. CUSTOMER Entity**
```
┌─────────────────────────────────────────────────┐
│                  CUSTOMER                       │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│ FK  businessId          : ObjectId → Business   │
│                           (required, indexed)   │
│     customerName        : String (required)     │
│     email               : String                │
│     phoneNumber         : String (required)     │
│     address             : String                │
│     gstin               : String                │
│     creditLimit         : Number (def:0)        │
│     outstandingBalance  : Number (def:0)        │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

### **4. INVOICE Entity**
```
┌─────────────────────────────────────────────────┐
│                   INVOICE                       │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│ FK  businessId          : ObjectId → Business   │
│                           (required, indexed)   │
│ UK  invoiceNumber       : String (unique, req)  │
│ FK  customerId          : ObjectId → Customer   │
│                           (required, indexed)   │
│     items               : Array [{              │
│       productName       : String                │
│       quantity          : Number                │
│       unitPrice         : Number                │
│       gst               : Number                │
│       total             : Number                │
│     }]                                          │
│     subtotal            : Number (required)     │
│     gstAmount           : Number (required)     │
│     totalAmount         : Number (required)     │
│     status              : Enum ['draft','sent', │
│                           'paid','overdue']     │
│                           (def:'draft')         │
│     dueDate             : Date                  │
│     paymentMethod       : String                │
│     notes               : String                │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

### **5. INVENTORY Entity**
```
┌─────────────────────────────────────────────────┐
│                  INVENTORY                      │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│ FK  businessId          : ObjectId → Business   │
│                           (required, indexed)   │
│     productName         : String (required)     │
│ UK  productCode         : String (unique)       │
│     category            : String                │
│     quantity            : Number (def:0)        │
│     unit                : String (def:'pcs')    │
│     costPrice           : Number                │
│     sellingPrice        : Number                │
│     gstRate             : Number                │
│     lowStockAlert       : Number (def:10)       │
│     supplier            : String                │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

### **6. PAYMENT Entity**
```
┌─────────────────────────────────────────────────┐
│                   PAYMENT                       │
├─────────────────────────────────────────────────┤
│ PK  _id                 : ObjectId              │
│ FK  businessId          : ObjectId → Business   │
│                           (required, indexed)   │
│ FK  invoiceId           : ObjectId → Invoice    │
│                           (optional, indexed)   │
│ FK  customerId          : ObjectId → Customer   │
│                           (required, indexed)   │
│     amount              : Number (required)     │
│     paymentMethod       : Enum ['cash','upi',   │
│                           'card','bank_transfer'│
│                           ] (required)          │
│     paymentDate         : Date (def:Date.now)   │
│     transactionId       : String                │
│     notes               : String                │
│     createdAt           : Date (auto)           │
│     updatedAt           : Date (auto)           │
└─────────────────────────────────────────────────┘
```

---

## RELATIONSHIP MAPPING (Complete)

### **1. USER ←→ BUSINESS (One-to-One)**
```
┌─────────┐                              ┌──────────┐
│  USER   │ 1                          1 │ BUSINESS │
│         │◄─────────owns─────────────►  │          │
│         │                              │          │
├─────────┤                              ├──────────┤
│businessId├───┐                     ┌──►│ _id      │
└─────────┘   │                     │   ├──────────┤
              └─────references──────┘   │owner     │
                                         └──────────┘

Constraints:
- User.businessId references Business._id
- Business.owner references User._id
- CASCADE DELETE: If User deleted → Business deleted
- UNIQUE: One User = One Business
```

### **2. BUSINESS ←→ CUSTOMER (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ BUSINESS │ 1                     ∞ │ CUSTOMER │
│          │◄────────has───────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤businessId│
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Customer.businessId references Business._id (required)
- INDEX on businessId for fast queries
- CASCADE DELETE: If Business deleted → All Customers deleted
```

### **3. BUSINESS ←→ INVOICE (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ BUSINESS │ 1                     ∞ │ INVOICE  │
│          │◄────────has───────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤businessId│
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Invoice.businessId references Business._id (required)
- INDEX on businessId for fast queries
- CASCADE DELETE: If Business deleted → All Invoices deleted
```

### **4. BUSINESS ←→ INVENTORY (One-to-Many)**
```
┌──────────┐                         ┌───────────┐
│ BUSINESS │ 1                     ∞ │ INVENTORY │
│          │◄────────has───────────► │           │
│          │                         │           │
├──────────┤                         ├───────────┤
│ _id      │◄────┐           ┌──────┤businessId │
└──────────┘     │           │      └───────────┘
                 └references─┘

Constraints:
- Inventory.businessId references Business._id (required)
- INDEX on businessId for fast queries
- CASCADE DELETE: If Business deleted → All Inventory deleted
```

### **5. BUSINESS ←→ PAYMENT (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ BUSINESS │ 1                     ∞ │ PAYMENT  │
│          │◄────────has───────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤businessId│
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Payment.businessId references Business._id (required)
- INDEX on businessId for fast queries
- CASCADE DELETE: If Business deleted → All Payments deleted
```

### **6. CUSTOMER ←→ INVOICE (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ CUSTOMER │ 1                     ∞ │ INVOICE  │
│          │◄──────receives────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤customerId│
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Invoice.customerId references Customer._id (required)
- INDEX on customerId for fast queries
- RESTRICT DELETE: Cannot delete Customer if Invoices exist
```

### **7. CUSTOMER ←→ PAYMENT (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ CUSTOMER │ 1                     ∞ │ PAYMENT  │
│          │◄───────makes──────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤customerId│
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Payment.customerId references Customer._id (required)
- INDEX on customerId for fast queries
- RESTRICT DELETE: Cannot delete Customer if Payments exist
```

### **8. INVOICE ←→ PAYMENT (One-to-Many)**
```
┌──────────┐                         ┌──────────┐
│ INVOICE  │ 1                   0..∞│ PAYMENT  │
│          │◄──────settles─────────► │          │
│          │                         │          │
├──────────┤                         ├──────────┤
│ _id      │◄────┐           ┌──────┤invoiceId │
└──────────┘     │           │      └──────────┘
                 └references─┘

Constraints:
- Payment.invoiceId references Invoice._id (optional)
- INDEX on invoiceId for fast queries
- SET NULL: If Invoice deleted → Payment.invoiceId = null
- Allows partial payments (multiple payments for one invoice)
```

---

## COMPLETE ENTITY-RELATIONSHIP DIAGRAM

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    │              CENTRAL HUB                │
                    │                                         │
        ┌───────────┤           BUSINESS                      ├───────────┐
        │           │                                         │           │
        │           │  ┌────────────────────────────────┐    │           │
        │           │  │ • _id (PK)                     │    │           │
        │           │  │ • businessName                 │    │           │
        │           │  │ • businessType                 │    │           │
        │           │  │ • gstin (UK)                   │    │           │
        │           │  │ • address {}                   │    │           │
        │           │  │ • logo                         │    │           │
        │           │  │ • owner (FK → User)           │    │           │
        │           │  │ • currency                     │    │           │
        │           │  │ • fiscalYearStart              │    │           │
        │           │  └────────────────────────────────┘    │           │
        │           │              ▲                          │           │
        │           │              │                          │           │
        │           │              │ owns (1:1)              │           │
        │           │              │                          │           │
        │           └──────────────┼──────────────────────────┘           │
        │                          │                                      │
        │                  ┌───────┴───────┐                             │
        │                  │     USER      │                             │
        │                  │               │                             │
        │                  │ • _id (PK)    │                             │
        │                  │ • fullName    │                             │
        │                  │ • email (UK)  │                             │
        │                  │ • password    │                             │
        │                  │ • phoneNumber │                             │
        │                  │ • businessId  │                             │
        │                  │   (FK)        │                             │
        │                  └───────────────┘                             │
        │                                                                 │
        │                                                                 │
   has (1:∞)                                                         has (1:∞)
        │                                                                 │
        │                                                                 │
        ▼                                                                 ▼
┌───────────────┐                                              ┌───────────────┐
│   CUSTOMER    │                                              │   INVENTORY   │
│               │                                              │               │
│ • _id (PK)    │                                              │ • _id (PK)    │
│ • businessId  │                                              │ • businessId  │
│   (FK)        │                                              │   (FK)        │
│ • customerName│                                              │ • productName │
│ • email       │                                              │ • productCode │
│ • phoneNumber │                                              │ • quantity    │
│ • creditLimit │                                              │ • costPrice   │
│ • outstanding │                                              │ • sellingPrice│
│   Balance     │                                              │ • gstRate     │
└───────┬───────┘                                              └───────────────┘
        │
        │ receives (1:∞)
        │
        ▼
┌───────────────┐          settles (1:0..∞)          ┌───────────────┐
│   INVOICE     │◄────────────────────────────────────┤   PAYMENT     │
│               │                                      │               │
│ • _id (PK)    │                                      │ • _id (PK)    │
│ • businessId  │                                      │ • businessId  │
│   (FK)        │                                      │   (FK)        │
│ • invoiceNum  │                                      │ • invoiceId   │
│   (UK)        │                                      │   (FK)        │
│ • customerId  │◄─────────────makes (1:∞)────────────┤ • customerId  │
│   (FK)        │                                      │   (FK)        │
│ • items []    │                                      │ • amount      │
│ • subtotal    │                                      │ • paymentDate │
│ • gstAmount   │                                      │ • method      │
│ • totalAmount │                                      │ • transactionId│
│ • status      │                                      └───────────────┘
│ • dueDate     │
└───────────────┘
```

---

## INDEX STRATEGY

### **Required Indexes:**
```javascript
// User Collection
User.index({ email: 1 }, { unique: true })
User.index({ businessId: 1 })

// Business Collection
Business.index({ owner: 1 }, { unique: true })
Business.index({ gstin: 1 }, { unique: true, sparse: true })

// Customer Collection
Customer.index({ businessId: 1 })
Customer.index({ businessId: 1, customerName: 1 })

// Invoice Collection
Invoice.index({ businessId: 1 })
Invoice.index({ customerId: 1 })
Invoice.index({ invoiceNumber: 1 }, { unique: true })
Invoice.index({ businessId: 1, status: 1 })
Invoice.index({ dueDate: 1 })

// Inventory Collection
Inventory.index({ businessId: 1 })
Inventory.index({ productCode: 1 }, { unique: true })
Inventory.index({ businessId: 1, category: 1 })

// Payment Collection
Payment.index({ businessId: 1 })
Payment.index({ customerId: 1 })
Payment.index({ invoiceId: 1 })
Payment.index({ paymentDate: 1 })
```

---

## DATA INTEGRITY RULES

### **Referential Integrity:**
1. **User → Business**: Cannot delete User if Business exists
2. **Business → Customer**: Cascade delete all customers if business deleted
3. **Business → Invoice**: Cascade delete all invoices if business deleted
4. **Business → Inventory**: Cascade delete all inventory if business deleted
5. **Business → Payment**: Cascade delete all payments if business deleted
6. **Customer → Invoice**: Restrict delete customer if invoices exist
7. **Customer → Payment**: Restrict delete customer if payments exist
8. **Invoice → Payment**: Set null on invoiceId if invoice deleted

### **Business Logic Constraints:**
1. **Outstanding Balance**: Customer.outstandingBalance = SUM(unpaid invoices)
2. **Invoice Total**: totalAmount = subtotal + gstAmount
3. **Payment Amount**: Cannot exceed invoice totalAmount
4. **Stock Quantity**: Inventory.quantity cannot be negative
5. **Invoice Status**: Auto-update to 'overdue' if dueDate < today and status != 'paid'

---

## Query Optimization Patterns

### **Common Queries:**
```javascript
// Get all customers with outstanding balance
Customer.find({ 
  businessId: businessId, 
  outstandingBalance: { $gt: 0 } 
}).index('businessId_outstandingBalance')

// Get overdue invoices
Invoice.find({ 
  businessId: businessId,
  status: { $ne: 'paid' },
  dueDate: { $lt: new Date() }
}).index('businessId_status_dueDate')

// Get low stock items
Inventory.find({ 
  businessId: businessId,
  $expr: { $lt: ['$quantity', '$lowStockAlert'] }
}).index('businessId_quantity')

// Get payments for an invoice
Payment.find({ invoiceId: invoiceId })
  .index('invoiceId')
```

---

This complete ER diagram provides the full database architecture for AME with all entities, relationships, constraints, and optimization strategies.
