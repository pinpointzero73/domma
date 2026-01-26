# Schema Builder - Manual Testing Checklist

**URL:** http://localhost:8080/showcase/schema-builder/

**Goal:** Systematically test every feature to ensure everything works correctly before launch.

---

## ✅ Quick Smoke Test (5 minutes)

### Basic Flow Test
1. [ ] **Page loads** without console errors
2. [ ] **Add string field** - Click "Text" in Field Library
3. [ ] **Configure field** - Set name="username", required=true, minLength=3
4. [ ] **Add number field** - Click "Number" in Field Library
5. [ ] **Configure field** - Set name="age", required=true, min=18, max=125
6. [ ] **Preview updates** - Type in form fields, watch Model State update
7. [ ] **Submit validation** - Click "Test Submit" with empty fields (should show errors)
8. [ ] **Submit validation** - Fill valid data and submit (should show success)
9. [ ] **Export works** - Click Export button, verify JavaScript/JSON/TypeScript tabs
10. [ ] **Template save** - Click Save, name it "Test", verify it saves

---

## 🔍 Detailed Feature Testing

### A. Field Types (Critical - Test All 21)

#### Basic Types
- [ ] **String** - Add, set minLength=3, maxLength=20, test validation
- [ ] **Number** - Add, set min=18, max=125, verify numbers not strings
- [ ] **Boolean** - Add, test checkbox toggle, verify true/false in state
- [ ] **Textarea** - Add, set minLength=10, test multiline input

#### Specialized Inputs
- [ ] **Email** - Add, test invalid email shows error, valid passes
- [ ] **Password** - Add, verify text is masked, test minLength
- [ ] **URL** - Add, test invalid URL shows error
- [ ] **Tel** - Add, set pattern for phone format
- [ ] **Color** - Add, test color picker opens, value updates
- [ ] **Range** - Add, set min=0 max=100 step=5, test slider
- [ ] **Hidden** - Add, verify not visible in preview, shows in state

#### Date/Time
- [ ] **Date** - Add, select date, NO validation error for valid date
- [ ] **Datetime** - Add, select date and time
- [ ] **Time** - Add, select time

#### Selection Types (Test Options Editor)
- [ ] **Select** - Add, create 3 options with values/labels, test dropdown
- [ ] **Multiselect** - Add, create options, test multiple selection
- [ ] **Radio** - Add, create options, test only one selectable
- [ ] **Checkbox-group** - Add, create options, test multiple selection

#### Advanced
- [ ] **File** - Add, verify file input renders
- [ ] **Array** - Add, export and verify type
- [ ] **Object** - Add, export and verify type

### B. Property Editor

#### Core Properties
- [ ] **Field name** - Change name, verify canvas updates
- [ ] **Type** - Change field type, verify properties update
- [ ] **Required** - Toggle, test validation
- [ ] **Default** - Set default value, verify in preview
- [ ] **Label** - Set label, verify in preview
- [ ] **Placeholder** - Set placeholder, verify in preview
- [ ] **Help text** - Set help text, verify in preview

#### Field-Specific Properties
- [ ] **String minLength/maxLength** - Set, test validation
- [ ] **Number min/max** - Set to 18 and 125, test values stored as numbers
- [ ] **Pattern** - Set regex pattern, test validation
- [ ] **Options** - Add/edit/remove/reorder options for select fields

### C. Options Editor (Select/Multiselect/Radio/Checkbox-group)

- [ ] **Add option** - Click "+ Add Option", creates new row
- [ ] **Edit value** - Type value, saves correctly
- [ ] **Edit label** - Type label, saves correctly
- [ ] **Remove option** - Click trash icon, removes option
- [ ] **Move up** - Click up arrow, reorders option
- [ ] **Move down** - Click down arrow, reorders option
- [ ] **Preview updates** - Options appear in preview dropdown/buttons

### D. Live Preview Panel

#### Panel Controls
- [ ] **Shows by default** - Preview panel visible on page load
- [ ] **Toggle button** - Click eye icon, panel hides/shows
- [ ] **Close button** - X button hides panel
- [ ] **Slide animation** - Panel slides in/out smoothly

#### Layouts
- [ ] **Stacked** - Fields display vertically
- [ ] **Grid-2** - Fields display in 2 columns
- [ ] **Grid-3** - Fields display in 3 columns
- [ ] **Grid-4** - Fields display in 4 columns

#### Model State
- [ ] **Displays on load** - Shows empty model {}
- [ ] **Updates on input** - Type in text field, JSON updates
- [ ] **Updates on change** - Select dropdown, JSON updates
- [ ] **Shows correct types** - Numbers are numbers, not strings
- [ ] **JSON formatting** - Pretty printed with indentation

#### Validation
- [ ] **Required fields** - Shows error when empty
- [ ] **Min/max number** - Shows error for values outside range
- [ ] **Min/max length** - Shows error for string length violations
- [ ] **Pattern** - Shows error for invalid regex match
- [ ] **Email format** - Shows error for invalid email
- [ ] **Date format** - No false error for valid dates

#### Submit Handler
- [ ] **Validation fails** - Shows specific field errors
- [ ] **Validation passes** - Shows success modal with data
- [ ] **Modal displays** - Data shown in formatted JSON

### E. Canvas & Field Management

#### Adding Fields
- [ ] **Click to add** - Click field type, adds to canvas
- [ ] **Drag to add** - Drag field type from library to canvas
- [ ] **Drop zones** - Highlight on drag over
- [ ] **Correct position** - Field added in right spot
- [ ] **Empty state** - Shows "No fields" when empty

#### Selecting Fields
- [ ] **Click selects** - Click field card, highlights it
- [ ] **Editor updates** - Property editor shows field properties
- [ ] **Deselect** - Click empty area, field deselects

#### Reordering Fields
- [ ] **Drag to reorder** - Drag field card up/down
- [ ] **Drop zones visible** - Blue zones between fields
- [ ] **Order updates** - Field moves to new position
- [ ] **Preview updates** - Form reflects new order

#### Removing Fields
- [ ] **Remove button** - Click trash icon, field deleted
- [ ] **Canvas updates** - Field removed immediately
- [ ] **Preview updates** - Form no longer shows field

#### Duplicating Fields
- [ ] **Duplicate button** - Click copy icon, creates duplicate
- [ ] **Properties copied** - All settings preserved
- [ ] **Unique name** - Gets auto-generated name

### F. Export Functionality

#### JavaScript Export
- [ ] **Opens modal** - Export button opens modal
- [ ] **JavaScript tab** - Shows object literal
- [ ] **Proper syntax** - Valid JavaScript code
- [ ] **Formatting** - Indented and readable
- [ ] **Numbers** - Exported as numbers, not strings
- [ ] **Comments option** - Includes field labels when enabled
- [ ] **Copy button** - Copies to clipboard

#### JSON Export
- [ ] **JSON tab** - Shows valid JSON
- [ ] **Valid syntax** - Can be parsed
- [ ] **Formatting** - Pretty printed
- [ ] **Numbers** - JSON numbers, not strings

#### TypeScript Export
- [ ] **TypeScript tab** - Shows interface
- [ ] **Interface name** - Uses custom name if provided
- [ ] **Type mappings** - Correct TS types (string, number, boolean)
- [ ] **Comments** - Includes field labels when enabled
- [ ] **Valid syntax** - Proper TypeScript code

### G. Template Management

#### Save Template
- [ ] **Save button** - Opens save modal
- [ ] **Name input** - Can type template name
- [ ] **Saves** - Template saved to localStorage
- [ ] **Schema name updates** - Header shows template name

#### Load Template
- [ ] **Load button** - Opens load modal
- [ ] **List shows** - Displays saved templates
- [ ] **Load works** - Clicking template loads it
- [ ] **Fields restore** - All fields restored correctly
- [ ] **Properties restore** - All settings preserved
- [ ] **Canvas updates** - Shows loaded fields
- [ ] **Preview updates** - Form renders loaded schema

#### Auto-save
- [ ] **Persists** - Reload page, schema still there
- [ ] **Clears** - New schema button clears active

#### Delete Template
- [ ] **Delete button** - Removes template
- [ ] **List updates** - Template no longer shown

### H. Header Controls

- [ ] **New button** - Clears all fields
- [ ] **Save button** - Opens save modal
- [ ] **Load button** - Opens load modal
- [ ] **Import button** - Can paste JSON blueprint
- [ ] **Export button** - Opens export modal
- [ ] **Schema name input** - Can type/edit name

### I. Field Library

- [ ] **Search** - Type to filter field types
- [ ] **Categories** - All 5 categories present
- [ ] **21 field types** - All types shown
- [ ] **Icons** - Each type has icon

### J. UI/UX

#### Responsive
- [ ] **Desktop** - 4-panel layout works
- [ ] **Animations** - Feature cards stagger on load
- [ ] **Hover states** - Buttons/cards show hover

#### Theme
- [ ] **Light theme** - Displays correctly
- [ ] **Dark theme** - Displays correctly
- [ ] **Theme toggle** - Switches themes

### K. Integration Tests

#### With Domma.forms
- [ ] **Export blueprint** - Copy JavaScript export
- [ ] **Open browser console** - Paste code
- [ ] **Create form** - Run: `Domma.forms.create(blueprint, {}, { layout: 'stacked', submitText: 'Submit' }).renderTo(document.body)`
- [ ] **Form works** - Validates correctly

#### With Domma.models
- [ ] **Create model** - Run: `const m = M.create(blueprint, {})`
- [ ] **Validation works** - Run: `m.validate()`
- [ ] **Get data** - Run: `m.toJSON()`

---

## 🐛 Known Fixed Issues

✅ Field name input loses focus - **FIXED**
✅ Modal transparency - **FIXED**
✅ Preview layout dropdown not working - **FIXED**
✅ Date field validation error - **FIXED**
✅ Multiselect missing options editor - **FIXED**
✅ Number min/max stored as strings - **FIXED**
✅ Preview not rendering on toggle - **FIXED**
✅ Test Submit does nothing - **FIXED**

---

## ⚠️ Testing Notes

### Critical Tests
- Number validation (min/max as actual numbers)
- Date validation (no false errors)
- Model state updates in real-time
- Test Submit shows validation results
- Options editor for select/multiselect/radio/checkbox-group

### Edge Cases to Test
- Empty fields
- Very long text
- Invalid inputs
- Duplicate field names
- No fields in schema
- Many fields (50+)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 📊 Test Results

**Date Tested:** _______________
**Tester:** _______________

**Total Features Tested:** ___ / ___
**Issues Found:** ___
**Severity:** Critical ___ | Medium ___ | Low ___

**Ready for Production?** ☐ Yes ☐ No

**Notes:**
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
