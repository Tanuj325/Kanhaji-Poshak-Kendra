# REUSABLE COMPONENT LIBRARY DESIGN

## Design Principles

1. **Composition over configuration**: Components accept children and compose well
2. **Forward refs**: All form inputs forward refs for React Hook Form integration
3. **Controlled + Uncontrolled**: Support both patterns
4. **Tailwind variants**: Use clsx/twMerge for dynamic classes
5. **Accessible**: All components have proper ARIA attributes by default
6. **Loading states**: Every component handles its loading state

---

## UI Primitives

### Button
```
Props:
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading: boolean        → Shows spinner, disables
  isDisabled: boolean       → Grayed out, no pointer events
  isFullWidth: boolean      → w-full
  leftIcon: ReactNode       → Icon before text
  rightIcon: ReactNode      → Icon after text
  type: 'button' | 'submit' | 'reset'
  children: ReactNode
  onClick: () => void
  as: 'button' | 'a' | typeof Link    → Polymorphic

States:
  - Default
  - Hover (slight darken/brighten)
  - Active/Pressed (scale 0.98)
  - Focus (ring-2 with royal blue)
  - Loading (spinner + opacity 70%)
  - Disabled (opacity 50%, cursor-not-allowed)
  - Success feedback (brief green flash on toast)

Variants:
  primary:   bg-royal-blue text-white hover:bg-deep-navy
  secondary: bg-temple-gold text-dark-charcoal hover:bg-amber-600
  outline:   border-2 border-royal-blue text-royal-blue hover:bg-royal-blue/5
  ghost:     text-royal-blue hover:bg-royal-blue/5
  danger:    bg-red-600 text-white hover:bg-red-700
  link:      text-royal-blue underline hover:text-deep-navy
```

### Input
```
Props:
  label: string              → Renders <label> above input
  name: string               → For form registration
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url'
  placeholder: string
  value: string
  onChange: (e) => void
  error: string              → Shows red border + error text below
  helperText: string         → Grey hint text below
  isDisabled: boolean
  isReadOnly: boolean
  isRequired: boolean        → Shows * on label
  leftIcon: ReactNode        → Icon inside input (left)
  rightIcon: ReactNode       → Icon inside input (right)
  size: 'sm' | 'md' | 'lg'
  maxLength: number

States:
  - Default (border: muted-sand)
  - Focus (border: royal-blue, ring-1)
  - Filled (border: darker shade)
  - Error (border: red-500, red error text)
  - Disabled (bg: muted-sand/20, cursor-not-allowed)
  - ReadOnly (bg: muted-sand/10)
```

### Textarea
```
Props: (similar to Input but multiline)
  rows: number (default: 4)
  maxLength: number
  resizable: 'none' | 'vertical' | 'both' (default: 'vertical')
```

### Select
```
Props:
  label: string
  name: string
  options: Array<{ value: string|number, label: string }>
  placeholder: string
  value: string|number
  onChange: (e) => void
  error: string
  isDisabled: boolean
  isRequired: boolean
  size: 'sm' | 'md' | 'lg'
  
States: Same as Input
Custom styling: Chevron icon, no native arrow
```

### Checkbox
```
Props:
  label: string | ReactNode
  name: string
  checked: boolean
  onChange: (e) => void
  error: string
  isDisabled: boolean
  isIndeterminate: boolean   → Dashed state for "some selected"
  size: 'sm' | 'md' | 'lg'

States:
  - Unchecked (border muted-sand)
  - Checked (bg royal-blue, white checkmark)
  - Indeterminate (bg royal-blue, white dash)
  - Error (border red)
  - Disabled (opacity 50%)
```

### RadioGroup
```
Props:
  label: string
  name: string
  options: Array<{ value: string|number, label: string, description?: string }>
  value: string|number
  onChange: (value) => void
  error: string
  direction: 'horizontal' | 'vertical'
  isDisabled: boolean

States: Similar to Checkbox
Extra: Optional description below each radio label
```

### Badge
```
Props:
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size: 'sm' | 'md' | 'lg'
  children: ReactNode
  isDot: boolean            → Small dot only (for notification badge)

Variants:
  default: bg-muted-sand/20 text-dark-charcoal
  success: bg-green-100 text-green-800
  warning: bg-yellow-100 text-yellow-800
  danger:  bg-red-100 text-red-800
  info:    bg-blue-100 text-blue-800
  purple:  bg-purple-100 text-purple-800
```

### Avatar
```
Props:
  src: string               → Image URL
  alt: string
  name: string              → For initials fallback
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isOnline: boolean         → Shows green dot
  className: string

Behavior:
  - If src loads: show image
  - If src fails: show initials from name
  - If no name: show user icon
```

### Card
```
Props:
  variant: 'default' | 'elevated' | 'bordered' | 'flat'
  padding: 'none' | 'sm' | 'md' | 'lg'
  isHoverable: boolean      → Lift on hover
  onClick: () => void       → Make card clickable
  children: ReactNode
  className: string

Variants:
  default:  bg-white border border-muted-sand/30
  elevated: bg-white shadow-md hover:shadow-lg
  bordered: bg-white border-2 border-muted-sand
  flat:     bg-muted-sand/10
```

### Modal
```
Props:
  isOpen: boolean
  onClose: () => void
  title: string | ReactNode
  subtitle: string
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: ReactNode
  footer: ReactNode         → For action buttons
  closeOnOverlay: boolean (default: true)
  closeOnEsc: boolean (default: true)
  showCloseButton: boolean (default: true)

Behavior:
  - Portal rendered to body
  - Backdrop with blur effect
  - Escape key closes
  - Click outside closes (configurable)
  - Body scroll lock when open
  - Focus trap within modal
  - Smooth fade + scale animation (100ms)
```

### Drawer
```
Props:
  isOpen: boolean
  onClose: () => void
  title: string
  placement: 'left' | 'right' | 'top' | 'bottom'
  size: 'sm' | 'md' | 'lg'
  children: ReactNode
  footer: ReactNode

Behavior: Same as Modal but slides from edge
  - right: Cart drawer (420px)
  - left: Mobile menu (full width mobile)
  - Smooth slide animation (200ms)
```

### Alert
```
Props:
  variant: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  isDismissible: boolean
  onDismiss: () => void
  icon: ReactNode           → Custom icon (default by variant)
  action: ReactNode         → Optional action button

Variants:
  success: bg-green-50 border-green-200 text-green-800
  warning: bg-yellow-50 border-yellow-200 text-yellow-800
  error:   bg-red-50 border-red-200 text-red-800
  info:    bg-blue-50 border-blue-200 text-blue-800
```

### Loader / Spinner
```
Props:
  size: 'sm' | 'md' | 'lg' | 'xl'
  variant: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  color: 'royal-blue' | 'white' | 'temple-gold'
  isFullPage: boolean       → Centered in viewport
  label: string             → Accessible label
```

### Skeleton
```
Props:
  variant: 'text' | 'rect' | 'circle' | 'card' | 'table-row'
  width: string
  height: string
  count: number             → Repeated skeleton items (for list)
  isRounded: boolean

Animation: shimmer effect (left-to-right gradient sweep)
```

### Pagination
```
Props:
  currentPage: number
  totalPages: number
  onPageChange: (page) => void
  siblingCount: number      → Pages shown around current (default: 1)
  showFirstLast: boolean    → First/Last buttons
  showPrevNext: boolean     → Previous/Next buttons
  size: 'sm' | 'md' | 'lg'
  isDisabled: boolean

Behavior:
  - Shows page numbers with ellipsis: 1 ... 4 5 6 ... 10
  - Active page has royal-blue bg
  - Disabled prev on first page, disabled next on last
```

### Breadcrumb
```
Props:
  items: Array<{ label: string, href?: string, icon?: ReactNode }>
  separator: '/' | '›' | '>' | ReactNode
  maxItems: number          → Truncate with ellipsis
```

### Table
```
Props:
  columns: Array<{ key, label, sortable, render, width }>
  data: Array<any>
  isLoading: boolean
  isSortable: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (key, order) => void
  onRowClick: (row) => void
  emptyMessage: string
  selectedRows: Set<string>
  onSelectionChange: (Set) => void
  pagination: { page, totalPages, onPageChange }

States:
  - Loading (skeleton rows)
  - Empty (centered empty state)
  - Error (error state with retry)
  - Sorted (arrow indicator on column header)
  - Selected (checkbox + highlight row)
```

### DataGrid
```
Props:
  columns: Array<{ key, label, render, width }>
  data: Array<any>
  isLoading: boolean
  onRowClick: (row) => void
  emptyMessage: string
  searchable: boolean
  filterable: boolean
  sortable: boolean
  pagination: object
  selectable: boolean
  actions: Array<{ label, icon, onClick, variant }>
```

### Tabs
```
Props:
  tabs: Array<{ id, label, icon, badge, isDisabled }>
  activeTab: string
  onChange: (tabId) => void
  variant: 'underline' | 'pill' | 'box'
  size: 'sm' | 'md' | 'lg'
```

### Accordion
```
Props:
  items: Array<{ title, content, isOpen }>
  allowMultiple: boolean    → Multiple open at once
  onChange: (index, isOpen) => void
  variant: 'bordered' | 'ghost'
```

### Stepper (for checkout)
```
Props:
  steps: Array<{ label, description, icon, isCompleted, isCurrent }>
  currentStep: number
  orientation: 'horizontal' | 'vertical'
  variant: 'numbered' | 'icon' | 'dot'
```

### StarRating
```
Props:
  rating: number            → Current rating (0-5)
  maxRating: 5
  size: 'sm' | 'md' | 'lg'
  isInteractive: boolean    → Allow user to click to rate
  onChange: (rating) => void
  showValue: boolean        → Show "4.5/5" next to stars
  count: number             → Show "(128 reviews)" text
```

### FileUpload
```
Props:
  accept: string            → MIME types
  maxSize: number           → MB
  multiple: boolean
  files: File[]
  onChange: (files) => void
  error: string
  isDisabled: boolean
  preview: boolean          → Show image preview
  dropzone: boolean         → Drag & drop area

Behavior:
  - Click to browse or drag & drop
  - File type validation
  - File size validation
  - Image preview before upload
  - Remove individual files
  - Show progress for upload (future)
```

---

## Form Components

All form components follow this pattern:
- Wrap a UI primitive
- Integrate with React Hook Form's `register()` or `Controller`
- Display validation errors from Zod
- Accept all UI primitive props

```javascript
// Pattern: FormField
// Usage:
<FormField label="Email" name="email" error={errors.email} isRequired>
  <Input {...register('email')} placeholder="your@email.com" />
</FormField>
```

### PasswordInput
```
Extra: Show/hide toggle button (eye icon)
      Strength indicator (optional, for registration)
```

### FormPhoneInput
```
Extra: Country code selector (default: +91 India)
      Phone format masking
```

---

## Component Tree Visibility

| Component | Public | Customer | Admin |
|---|---|---|---|
| Button, Input, Select, etc. | ✓ | ✓ | ✓ |
| ProductCard | ✓ | ✓ | ✓ |
| OrderCard | - | ✓ | ✓ |
| ProductsTable | - | - | ✓ |
| SalesChart | - | - | ✓ |
| Sidebar | - | - | ✓ |
| CategoryMegaMenu | ✓ | ✓ | - |
| AddressForm | - | ✓ | - |
</content>

