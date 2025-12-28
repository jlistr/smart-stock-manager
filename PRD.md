# Planning Guide

A streamlined inventory management system that enables small retail businesses and warehouses to track stock levels, manage products, and make data-driven reorder decisions without the complexity and cost of enterprise solutions.

**Experience Qualities**:
1. **Effortless** - The system should feel intuitive and require minimal training, allowing business owners to focus on operations rather than wrestling with software.
2. **Trustworthy** - Real-time stock visibility and clear alerts build confidence in inventory decisions, eliminating the anxiety of potential stockouts.
3. **Empowering** - Actionable insights and automated alerts transform inventory management from a reactive chore into a proactive advantage.

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused inventory tracking tool with CRUD operations, filtering, and basic reporting - it doesn't require complex multi-view navigation or advanced integrations that would push it into "Complex Application" territory.

## Essential Features

### Product Catalog Management
- **Functionality**: Add, edit, and delete products with details (name, SKU, category, current stock, minimum threshold, unit price)
- **Purpose**: Maintains a centralized database of all inventory items
- **Trigger**: User clicks "Add Product" button or edits existing product
- **Progression**: Click action → Form modal opens → Fill product details → Save → Product appears in catalog with confirmation toast
- **Success criteria**: Products persist across sessions, all fields validate correctly, duplicate SKUs are prevented

### Real-Time Stock Tracking
- **Functionality**: Adjust stock quantities with quick increment/decrement controls and manual entry for larger adjustments
- **Purpose**: Keeps inventory counts accurate as products move in and out
- **Trigger**: User clicks stock adjustment controls or enters transaction
- **Progression**: Select product → Choose adjustment type (add/remove) → Enter quantity → Confirm → Stock updates with timestamp
- **Success criteria**: Stock changes are immediate, all adjustments are logged, negative stock is prevented with warnings

### Low Stock Alerts
- **Functionality**: Visual indicators and filtering for products below minimum threshold
- **Purpose**: Prevents stockouts by highlighting items needing reorder
- **Trigger**: Stock level falls below user-defined minimum threshold
- **Progression**: Stock drops below threshold → Product badge turns warning color → Appears in "Low Stock" filter → Shows in reorder report
- **Success criteria**: Alerts appear instantly when threshold is crossed, clear visual hierarchy distinguishes alert severity

### Reorder Report Generation
- **Functionality**: Generate a formatted list of products below threshold with suggested reorder quantities
- **Purpose**: Simplifies purchasing decisions with actionable data
- **Trigger**: User clicks "Generate Reorder Report" button
- **Progression**: Click report → System calculates products below threshold → Display report with suggested quantities → Option to export or print
- **Success criteria**: Report includes all relevant data (SKU, current stock, minimum, suggested order), calculations are accurate

### Search and Filter
- **Functionality**: Search by product name/SKU and filter by category or stock status
- **Purpose**: Quick access to specific products in large inventories
- **Trigger**: User types in search field or selects filter option
- **Progression**: Enter search term/select filter → Results update in real-time → Clear filters to reset view
- **Success criteria**: Search is instant and accurate, multiple filters can be combined, results count is displayed

## Edge Case Handling

- **Empty Inventory State**: Display friendly onboarding message with clear "Add Your First Product" call-to-action and helpful tips
- **Duplicate SKU Prevention**: Validate SKU uniqueness on product creation/edit with clear error message suggesting available SKUs
- **Invalid Quantity Inputs**: Prevent negative numbers and non-numeric entries with inline validation and helpful error messages
- **Bulk Stock Adjustments**: Provide batch update capability for scenarios like physical inventory counts
- **Product Deletion with History**: Warn users before deleting products that have transaction history, offer archive option instead
- **Zero Minimum Threshold**: Allow but flag products without minimum thresholds in a separate view for review

## Design Direction

The design should evoke confidence and clarity - like a well-organized warehouse where everything has its place. It should feel professional yet approachable, combining the precision of data management with the warmth of a tool built for real people solving real problems. Visual hierarchy should guide users naturally through tasks, with status indicators that communicate urgency without creating anxiety.

## Color Selection

A utilitarian color scheme that emphasizes clarity and status communication, inspired by warehouse signage and inventory management systems.

- **Primary Color**: Deep slate blue (oklch(0.35 0.04 250)) - Communicates professionalism and stability, used for primary actions and navigation
- **Secondary Colors**: 
  - Warm neutral gray (oklch(0.55 0.01 60)) for secondary UI elements and subtle backgrounds
  - Cool white (oklch(0.98 0.005 250)) for cards and elevated surfaces
- **Accent Color**: Vibrant amber (oklch(0.75 0.15 75)) - Attention-grabbing for low stock warnings and critical actions, creates urgency without alarm
- **Status Colors**:
  - Success green (oklch(0.65 0.15 145)) for healthy stock levels
  - Warning amber (accent) for low stock
  - Critical red (oklch(0.55 0.22 25)) for out of stock

**Foreground/Background Pairings**:
- Primary slate (oklch(0.35 0.04 250)): White text (oklch(1 0 0)) - Ratio 9.8:1 ✓
- Accent amber (oklch(0.75 0.15 75)): Slate text (oklch(0.25 0.02 250)) - Ratio 8.2:1 ✓
- Background white (oklch(0.98 0.005 250)): Foreground slate (oklch(0.25 0.02 250)) - Ratio 13.5:1 ✓
- Success green (oklch(0.65 0.15 145)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should balance utilitarian clarity with modern approachability - crisp enough for scanning data tables, warm enough for daily use by non-technical users.

- **Primary**: Space Grotesk - A technical geometric sans with friendly curves, perfect for the data-heavy interface while maintaining warmth
- **Data/Tabular**: JetBrains Mono - For SKUs, stock numbers, and prices where monospace aids scanning and comparison

**Typographic Hierarchy**:
- H1 (Page Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
- H2 (Section Headers): Space Grotesk Semibold/24px/normal
- H3 (Card Titles): Space Grotesk Medium/18px/normal
- Body (Descriptions): Space Grotesk Regular/16px/relaxed line-height (1.6)
- Data (Numbers, SKUs): JetBrains Mono Medium/15px/tabular-nums
- Labels: Space Grotesk Medium/14px/uppercase/wide letter spacing (0.05em)
- Small (Metadata): Space Grotesk Regular/13px/muted color

## Animations

Animations should feel crisp and purposeful, like the satisfying click of a well-maintained warehouse scanner. Focus on micro-interactions that provide feedback and guide attention - stock adjustments should have subtle numeric count-up animations, status badges should pulse gently when crossing thresholds, and modal transitions should feel snappy rather than floaty. Avoid elaborate transitions that slow down repetitive tasks; users will be adjusting stock frequently and need speed over spectacle.

## Component Selection

- **Components**: 
  - Dialog for product add/edit forms (modal focus for data entry)
  - Card for product display in grid/list views with clear visual hierarchy
  - Table for detailed inventory view with sortable columns
  - Badge for stock status indicators (low stock, out of stock, healthy)
  - Input and Textarea for form fields with clear validation states
  - Select for category filtering and product category assignment
  - Button variants for primary actions (add product), secondary (cancel), and destructive (delete)
  - Alert for important system notifications and warnings
  - Tabs for switching between "All Products", "Low Stock", and "Reports" views
  - Tooltip for additional context on stock thresholds and calculations
  
- **Customizations**: 
  - Stock adjustment control: Custom component combining decrement button, editable number input, and increment button in a single cohesive unit
  - Quick stats dashboard: Custom grid of metric cards showing total products, low stock count, total inventory value
  - Reorder report card: Custom formatted component for print-friendly reorder lists
  
- **States**: 
  - Buttons: Default slate blue, hover with subtle lift (shadow), active with pressed state, disabled muted
  - Stock badges: Color-coded (green/amber/red) with subtle border, hover reveals threshold details in tooltip
  - Input fields: Default with gray border, focus with primary blue ring, error with red border and icon, success with green check
  
- **Icon Selection**: 
  - Plus (add product), PencilSimple (edit), Trash (delete)
  - Package (product/inventory), WarningCircle (low stock alert)
  - ArrowUp/ArrowDown (stock adjustments), MagnifyingGlass (search)
  - Funnel (filter), FileText (generate report), Download (export)
  - Tag (category), Barcode (SKU), CurrencyDollar (price)
  
- **Spacing**: 
  - Page padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Card padding: p-6 with gap-4 for internal elements
  - Form field spacing: gap-4 between fields, gap-2 between label and input
  - Grid gaps: gap-6 for card grids, gap-4 for list items
  - Button padding: px-4 py-2 for default, px-6 py-3 for large primary actions
  
- **Mobile**: 
  - Grid switches from 3 columns → 2 columns → 1 column at breakpoints
  - Table switches to stacked card view on mobile with priority data visible
  - Quick stats stack vertically on small screens
  - Stock adjustment controls increase touch target size to 44px minimum
  - Search and filters collapse into a slide-out sheet on mobile
  - Product dialog becomes full-screen on mobile for easier data entry
