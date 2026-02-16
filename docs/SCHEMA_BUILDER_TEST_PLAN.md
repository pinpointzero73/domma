# Schema Builder - Comprehensive Test Plan

**Date:** 2026-01-26
**Version:** v0.10.2
**Tested By:** Claude Code

---

## Test Environment

- **URL:** http://localhost:8080/showcase/schema-builder/
- **Browser:** Chrome/Firefox/Safari
- **Screen Sizes:** Desktop (1920px), Tablet (768px), Mobile (375px)

---

## 1. Field Type Tests (21 Total)

### Basic Types (4)

#### ✓ String
- [ ] Add string field
- [ ] Set required: true
- [ ] Set minLength: 3
- [ ] Set maxLength: 20
- [ ] Set pattern: `^[A-Za-z]+$`
- [ ] Set label, placeholder, help text
- [ ] Test in preview: validate min/max length
- [ ] Test in preview: validate pattern
- [ ] Verify model state updates in real-time

#### ✓ Number
- [ ] Add number field
- [ ] Set required: true
- [ ] Set min: 18
- [ ] Set max: 125
- [ ] Set label, placeholder, help text
- [ ] Test in preview: enter value < 18 (should fail)
- [ ] Test in preview: enter value > 125 (should fail)
- [ ] Test in preview: enter valid value (18-125)
- [ ] Verify model state shows numeric value, not string

#### ✓ Boolean
- [ ] Add boolean field
- [ ] Set required: true
- [ ] Set default: true
- [ ] Set label, help text
- [ ] Test in preview: checkbox toggles
- [ ] Verify model state shows true/false

#### ✓ Textarea
- [ ] Add textarea field
- [ ] Set required: true
- [ ] Set minLength: 10
- [ ] Set maxLength: 500
- [ ] Set label, placeholder, help text
- [ ] Test in preview: validate min/max length
- [ ] Verify model state updates with multiline text

### Specialized Inputs (7)

#### ✓ Email
- [ ] Add email field
- [ ] Set required: true
- [ ] Set label, placeholder
- [ ] Test in preview: invalid email format (should fail)
- [ ] Test in preview: valid email (should pass)
- [ ] Verify model state shows email value

#### ✓ Password
- [ ] Add password field
- [ ] Set required: true
- [ ] Set minLength: 8
- [ ] Set label, placeholder
- [ ] Test in preview: text is masked
- [ ] Test in preview: validate min length
- [ ] Verify model state shows password value

#### ✓ URL
- [ ] Add URL field
- [ ] Set required: true
- [ ] Set label, placeholder
- [ ] Test in preview: invalid URL (should fail)
- [ ] Test in preview: valid URL (should pass)
- [ ] Verify model state shows URL value

#### ✓ Tel
- [ ] Add tel field
- [ ] Set required: true
- [ ] Set pattern: `^\d{3}-\d{3}-\d{4}$`
- [ ] Set label, placeholder
- [ ] Test in preview: validate phone format
- [ ] Verify model state shows phone value

#### ✓ Color
- [ ] Add color field
- [ ] Set default: '#ff0000'
- [ ] Set label
- [ ] Test in preview: color picker opens
- [ ] Test in preview: select different color
- [ ] Verify model state shows hex color value

#### ✓ Range
- [ ] Add range field
- [ ] Set min: 0
- [ ] Set max: 100
- [ ] Set step: 5
- [ ] Set default: 50
- [ ] Set label
- [ ] Test in preview: slider moves
- [ ] Test in preview: value changes
- [ ] Verify model state shows numeric value

#### ✓ Hidden
- [ ] Add hidden field
- [ ] Set default: 'secret-value'
- [ ] Test in preview: field not visible in form
- [ ] Verify model state contains hidden value

### Date/Time Types (3)

#### ✓ Date
- [ ] Add date field
- [ ] Set required: true
- [ ] Set label
- [ ] Test in preview: date picker opens
- [ ] Test in preview: select date
- [ ] Verify model state shows date value
- [ ] Verify no validation error for valid date

#### ✓ Datetime
- [ ] Add datetime field
- [ ] Set required: true
- [ ] Set label
- [ ] Test in preview: datetime picker opens
- [ ] Test in preview: select date and time
- [ ] Verify model state shows datetime value

#### ✓ Time
- [ ] Add time field
- [ ] Set required: true
- [ ] Set label
- [ ] Test in preview: time picker opens
- [ ] Test in preview: select time
- [ ] Verify model state shows time value

### Selection Types (4)

#### ✓ Select
- [ ] Add select field
- [ ] Set required: true
- [ ] Add options: Admin (admin), User (user), Guest (guest)
- [ ] Set label
- [ ] Test options editor: add option
- [ ] Test options editor: remove option
- [ ] Test options editor: reorder options
- [ ] Test in preview: dropdown shows all options
- [ ] Test in preview: select option
- [ ] Verify model state shows selected value

#### ✓ Multiselect
- [ ] Add multiselect field
- [ ] Set required: true
- [ ] Add options: Red (red), Green (green), Blue (blue)
- [ ] Set label
- [ ] Test options editor: add/remove/reorder
- [ ] Test in preview: can select multiple
- [ ] Verify model state shows array of selected values

#### ✓ Radio
- [ ] Add radio field
- [ ] Set required: true
- [ ] Add options: Yes (yes), No (no), Maybe (maybe)
- [ ] Set label
- [ ] Test options editor: add/remove/reorder
- [ ] Test in preview: radio buttons display
- [ ] Test in preview: only one can be selected
- [ ] Verify model state shows selected value

#### ✓ Checkbox-group
- [ ] Add checkbox-group field
- [ ] Add options: Feature A (a), Feature B (b), Feature C (c)
- [ ] Set label
- [ ] Test options editor: add/remove/reorder
- [ ] Test in preview: multiple can be selected
- [ ] Verify model state shows array of selected values

### Advanced Types (3)

#### ✓ File
- [ ] Add file field
- [ ] Set required: true
- [ ] Set label, help text
- [ ] Test in preview: file input renders
- [ ] Note: File uploads require special handling

#### ✓ Array
- [ ] Add array field
- [ ] Set default: []
- [ ] Set label
- [ ] Test export: array type preserved

#### ✓ Object
- [ ] Add object field
- [ ] Set default: {}
- [ ] Set label
- [ ] Test export: object type preserved

---

## 2. Property Editor Tests

### Core Properties
- [ ] Field name updates correctly
- [ ] Type selection changes field type
- [ ] Required checkbox toggles
- [ ] Default value sets initial value
- [ ] Label updates correctly
- [ ] Placeholder updates correctly
- [ ] Help text updates correctly

### Field-Specific Properties
- [ ] Number: min/max stored as numbers (not strings) ✓ FIXED
- [ ] String: minLength/maxLength stored as numbers
- [ ] Pattern field accepts regex
- [ ] Options editor shows for select/multiselect/radio/checkbox-group

### Form Display Options
- [ ] Column span (1-12) works in grid layouts
- [ ] Input loses focus bug FIXED ✓

---

## 3. Options Editor Tests (Select/Multiselect/Radio/Checkbox-group)

- [ ] Add option button creates new option
- [ ] Value and label inputs work independently
- [ ] Remove option button deletes option
- [ ] Move up button reorders option up
- [ ] Move down button reorders option down
- [ ] Options persist when field is deselected
- [ ] Options display correctly in preview
- [ ] Empty options show placeholder

---

## 4. Live Preview Tests

### Preview Panel
- [ ] Preview panel shows by default if enabled
- [ ] Toggle preview button shows/hides panel
- [ ] Close preview button hides panel
- [ ] Preview panel slides in/out with animation

### Layout Modes
- [ ] Stacked layout displays fields vertically
- [ ] Grid-2 layout displays 2 columns
- [ ] Grid-3 layout displays 3 columns
- [ ] Grid-4 layout displays 4 columns
- [ ] Grid-6 layout displays 6 columns
- [ ] Grid-12 layout displays 12 columns
- [ ] Inline layout displays fields horizontally

### Model State Display
- [ ] Model state shows on page load
- [ ] Model state updates on input (every keystroke)
- [ ] Model state updates on change (selects, checkboxes)
- [ ] Model state shows proper JSON formatting
- [ ] Model state shows correct data types (numbers, booleans, strings)
- [ ] Model state updates for all field types

### Validation Display
- [ ] Required fields show validation errors
- [ ] Min/max validation shows errors
- [ ] Pattern validation shows errors
- [ ] Email format validation shows errors
- [ ] URL format validation shows errors
- [ ] Date validation shows no false positives ✓ FIXED

---

## 5. Canvas/Field Management Tests

### Adding Fields
- [ ] Click field type adds to canvas
- [ ] Drag field type from library to canvas
- [ ] Drop zone highlights on drag over
- [ ] Field added in correct position
- [ ] Empty canvas shows "No fields" message

### Selecting Fields
- [ ] Click field card selects it
- [ ] Selected field highlights
- [ ] Property editor updates for selected field
- [ ] Clicking canvas area deselects

### Reordering Fields
- [ ] Drag field card to reorder
- [ ] Drop zones appear between fields
- [ ] Field moves to new position
- [ ] Preview updates with new order

### Removing Fields
- [ ] Remove button deletes field
- [ ] Canvas updates immediately
- [ ] Preview updates immediately
- [ ] Model state updates immediately

### Duplicating Fields
- [ ] Duplicate button creates copy
- [ ] Copy has same properties
- [ ] Copy has unique generated name

---

## 6. Export Tests

### JavaScript Export
- [ ] Export modal opens
- [ ] JavaScript tab shows object literal
- [ ] Proper formatting with indentation
- [ ] Comments option includes field labels
- [ ] includeDefaults option works
- [ ] Copy button copies to clipboard
- [ ] Numbers are exported as numbers (not strings)
- [ ] Strings are properly escaped

### JSON Export
- [ ] JSON tab shows valid JSON
- [ ] Pretty option adds formatting
- [ ] Valid JSON can be parsed
- [ ] Numbers are JSON numbers
- [ ] Strings are properly escaped

### TypeScript Export
- [ ] TypeScript tab shows interface
- [ ] Interface name option works
- [ ] Comments option includes field labels
- [ ] Type mappings are correct:
  - string → string
  - number → number
  - boolean → boolean
  - date → Date | string
  - array → any[]
  - object → any
- [ ] Proper TypeScript syntax

---

## 7. Template Management Tests

### Save Template
- [ ] Save button opens modal
- [ ] Template name input works
- [ ] Save button saves to localStorage
- [ ] Template appears in load list
- [ ] Schema name updates

### Load Template
- [ ] Load button opens modal
- [ ] Template list shows saved templates
- [ ] Load button loads template
- [ ] All fields restored correctly
- [ ] All properties restored correctly
- [ ] Canvas updates immediately
- [ ] Preview updates immediately

### Auto-save
- [ ] Auto-save option works
- [ ] Active schema persists on reload
- [ ] Fields restore on page load

### Delete Template
- [ ] Delete button removes template
- [ ] Template no longer in list
- [ ] localStorage cleaned up

---

## 8. Blueprint Composition Tests

### Import Blueprint
- [ ] Import button opens input
- [ ] Valid JSON blueprint imports
- [ ] Fields created from blueprint
- [ ] All properties preserved
- [ ] Invalid JSON shows error

### M.extend
- [ ] Can extend with additional fields
- [ ] Original fields preserved
- [ ] New fields added
- [ ] All properties preserved

### M.pick
- [ ] Can pick specific fields
- [ ] Only selected fields included
- [ ] Field properties preserved

### M.omit
- [ ] Can omit specific fields
- [ ] Omitted fields excluded
- [ ] Remaining fields preserved

---

## 9. UI/UX Tests

### Header Controls
- [ ] New button clears schema
- [ ] Save button works
- [ ] Load button works
- [ ] Import button works
- [ ] Export button works
- [ ] Schema name input updates

### Field Library
- [ ] Search filters field types
- [ ] Categories collapse/expand
- [ ] All 21 field types present
- [ ] Icons display correctly

### Responsive Design
- [ ] Desktop: 4-panel layout
- [ ] Tablet: Panels stack properly
- [ ] Mobile: Single column layout
- [ ] Preview panel adapts to screen size

### Theme Integration
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme toggle works
- [ ] CSS variables apply properly

### Animations
- [ ] Feature cards stagger on load
- [ ] Field cards fade in
- [ ] Preview panel slides in/out
- [ ] Drop zones highlight on hover

---

## 10. Integration Tests

### With Domma.forms
- [ ] Exported blueprint works with Domma.forms.create()
- [ ] Form generates correctly
- [ ] Validation works in generated form
- [ ] Layout options work

### With Domma.models
- [ ] Exported blueprint works with M.create()
- [ ] Model validates correctly
- [ ] Model binding works
- [ ] Persistence works

### With CRUD Helper
- [ ] Exported blueprint works with Domma.forms.crud()
- [ ] CRUD operations work
- [ ] Table displays correctly

---

## 11. Error Handling Tests

- [ ] Invalid field names handled
- [ ] Duplicate field names handled
- [ ] Invalid regex patterns handled
- [ ] Empty options lists handled
- [ ] Invalid JSON import handled
- [ ] Missing required properties handled
- [ ] Browser localStorage full handled

---

## 12. Performance Tests

- [ ] Page loads under 2 seconds
- [ ] Adding 50 fields performs well
- [ ] Preview updates under 100ms
- [ ] Export generates quickly
- [ ] No memory leaks on repeated use
- [ ] Auto-save doesn't block UI

---

## Known Issues (Fixed)

✓ Field name input loses focus - FIXED
✓ Modal transparency issue - FIXED
✓ Preview layout dropdown not working - FIXED
✓ Date field validation error - FIXED
✓ Multiselect missing options editor - FIXED
✓ Number min/max stored as strings - FIXED
✓ Preview not rendering on toggle - FIXED

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

---

## Final Checklist

- [ ] All 21 field types work
- [ ] All validation rules work
- [ ] Live preview updates in real-time
- [ ] Export formats generate correctly
- [ ] Templates save/load correctly
- [ ] Drag-and-drop works
- [ ] Options editor works for selection types
- [ ] Grid layouts work (1-12 columns)
- [ ] No console errors
- [ ] No visual glitches
- [ ] Ready for production launch
