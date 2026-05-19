# Bills Module - Frontend Testing Guide (Step-by-Step)

## Prerequisites
- Backend API server running on `http://localhost:4000` (or your configured port)
- Frontend server running on `http://localhost:5173` (Vite default)
- Redux store configured with Bills reducer
- You are logged in and have access to the Bills page

---

## 🚀 Quick Setup Before Testing

### 1. Ensure Backend is Running
```bash
cd /Users/devanshu/Desktop/M\ and\ D\ Engineering/backend/mdengineers
npm start
# Verify logs show server is running on port 4000
```

### 2. Ensure Frontend is Running
```bash
cd /Users/devanshu/Desktop/M\ and\ D\ Engineering\ Frontend/md-engineers-frontend
npm run dev
# Should show: Local: http://localhost:5173
```

### 3. Navigate to Bills Page
- Login to the frontend
- Click on **"Bills"** in the sidebar navigation
- You should see the Bills dashboard with an empty list or existing bills

---

## 📋 Test Cases

### **TEST 1: Page Load & Initial State**

**Objective:** Verify the Bills page loads correctly with proper UI elements

**Steps:**
1. Navigate to the Bills page
2. Observe the page loading

**Expected Results:**
- ✅ Page title "Bills" appears
- ✅ "Add Bill" button is visible (with + icon)
- ✅ Search box is visible
- ✅ Status filter dropdown is visible (showing "All Statuses")
- ✅ Bills table or empty state is displayed
- ✅ No error messages appear

**How to Verify:**
- Check browser console (F12 → Console tab) for any JavaScript errors
- Verify the page structure matches the mockup (header, filters, buttons, table/list)

---

### **TEST 2: Create a New Bill**

**Objective:** Create a bill from scratch with multiple line items

**Steps:**

1. **Click "Add Bill" button**
   - Expected: A form modal or page appears with the following fields:
     - Bill Number (auto-generated or text input)
     - Customer Name
     - Customer Email
     - Customer Phone
     - Bill Date (date picker)
     - Due Date (date picker)
     - Notes (text area)
     - Status (dropdown: Draft/Sent/Paid)

2. **Fill in Bill Details**
   ```
   Bill Number: AUTO or leave blank
   Customer Name: John Doe
   Customer Email: john.doe@example.com
   Customer Phone: 98765 43210
   Bill Date: Today's date (auto-filled)
   Due Date: 30 days from today
   Notes: Test bill for module validation
   Status: Draft
   ```

3. **Add Line Items** (at least 2)
   - Click "Add Item" or "+ Add Item Line"
   
   **Item 1:**
   ```
   Description: Software Development Services
   Quantity: 10
   Unit Price: 5000
   GST Rate: 18%
   ```
   - Expected: Item is added to the list with calculated amounts

   **Item 2:**
   ```
   Description: Project Management
   Quantity: 1
   Unit Price: 20000
   GST Rate: 18%
   ```
   - Expected: Item is added to the list

4. **Verify Calculations**
   - Item 1: Amount = 50,000, GST = 9,000, Total = 59,000
   - Item 2: Amount = 20,000, GST = 3,600, Total = 23,600
   - **Subtotal: 70,000**
   - **Total GST: 12,600**
   - **Grand Total: 82,600**

5. **Click "Save Bill" or "Create"**
   - Expected: Success message appears (e.g., "Bill created successfully")
   - Expected: Page redirects to Bills list
   - Expected: New bill appears in the list

**How to Verify:**
- Check browser Network tab (F12 → Network) to see POST request to `/api/bills` with status 201/200
- Check Redux DevTools (if installed) to see bills state updated
- Look for the new bill in the table with status "Draft"

---

### **TEST 3: View Bill Details**

**Objective:** Open and view a bill in detail mode

**Steps:**

1. **Click the "Eye" icon or bill number** from the list
   - Expected: Detail view opens showing all bill information

2. **Verify Detail View Contains:**
   - ✅ Bill number
   - ✅ Bill date and due date
   - ✅ Customer name, email, phone
   - ✅ Status badge (color-coded: Yellow for Draft, Blue for Sent, Green for Paid)
   - ✅ Line items table with all columns (Description, Qty, Rate, Amount, GST %, Total)
   - ✅ Totals section (Subtotal, GST, Grand Total)
   - ✅ Notes section (if notes exist)
   - ✅ "Back to List" button

3. **Click "Back to List"**
   - Expected: Returns to bills list view

**How to Verify:**
- All financial calculations are correct
- Formatting is readable (dates, currency symbols, percentages)
- Status badge colors match the status (visual consistency)

---

### **TEST 4: Edit a Bill**

**Objective:** Modify an existing bill

**Steps:**

1. **From Bills list, click the "Edit" icon (pencil)** on any bill
   - Expected: Form loads with pre-filled data

2. **Modify Bill Details**
   - Change Customer Name: `John Doe → Jane Smith`
   - Change Due Date: Select a new date
   - Change Notes: Add or modify text
   - Update Item 1 Quantity: `10 → 15`
   - Expected: Changes are reflected in the form fields

3. **Modify Line Items**
   - Click "Remove" on Item 1 or the X button
   - Expected: Item is removed from the list
   - Add a new item: `Consultation: 5 hrs @ 2000/hr with 18% GST`

4. **Click "Update Bill" or "Save Changes"**
   - Expected: Success message ("Bill updated successfully")
   - Expected: Page returns to list
   - Expected: Bill shows updated data

**How to Verify:**
- Check Network tab for PUT/PATCH request to `/api/bills/:id`
- Click view on the updated bill to confirm changes persisted
- Totals should recalculate automatically

---

### **TEST 5: Delete a Bill**

**Objective:** Remove a bill from the system

**Steps:**

1. **From Bills list, click the "Trash/Delete" icon** on any bill
   - Expected: Confirmation dialog appears asking "Are you sure you want to delete this bill?"

2. **Click "Confirm" or "Yes"**
   - Expected: Success message appears
   - Expected: Bill is removed from the list

3. **Verify it's gone**
   - Count the bills before and after; count should decrease by 1
   - Search for the deleted bill; should not appear in results

**How to Verify:**
- Check Network tab for DELETE request to `/api/bills/:id`
- Refresh page (F5); bill should remain deleted (persisted to backend)

---

### **TEST 6: Search Functionality**

**Objective:** Filter bills by customer name or bill number

**Steps:**

1. **Ensure you have at least 3 bills with different customer names** (or create them)

2. **Click on the Search box** at the top
   - Type a partial customer name: `Jane`
   - Expected: List instantly filters to show only bills with customers matching "Jane"

3. **Search by Bill Number**
   - Clear search and type a bill number: `INV-001`
   - Expected: List shows only that bill

4. **Search with No Matches**
   - Type: `xyz123xyz`
   - Expected: Empty state message or "No bills found"

5. **Clear Search**
   - Delete the search text or click clear button
   - Expected: All bills reappear

**How to Verify:**
- Search is case-insensitive
- Search works in real-time (no page reload needed)
- No API call for each keystroke (should be client-side filtering)

---

### **TEST 7: Status Filtering**

**Objective:** Filter bills by status

**Steps:**

1. **Ensure you have bills with different statuses** (Draft, Sent, Paid)
   - If not, create/update bills to have these statuses

2. **Click the Status Filter dropdown**
   - Options should be: All Statuses, Draft, Sent, Paid

3. **Select "Draft"**
   - Expected: Only Draft bills appear in the list
   - Expected: Other bills are hidden

4. **Select "Sent"**
   - Expected: Only Sent bills appear

5. **Select "Paid"**
   - Expected: Only Paid bills appear

6. **Select "All Statuses"**
   - Expected: All bills appear again

**How to Verify:**
- Check Network tab; filter should trigger a GET request with status parameter
- Each status badge should match the selected filter

---

### **TEST 8: Send Bill (Email)**

**Objective:** Send a bill to the customer

**Steps:**

1. **From Bills list, click the "Send" icon (arrow/envelope)** on a bill
   - Expected: A modal or notification appears confirming the action

2. **Confirm sending**
   - Expected: Success message "Bill sent to [customer_email]"
   - Expected: Bill status changes to "Sent" (blue badge)

3. **Verify Bill Status Changed**
   - Refresh the page (F5)
   - Bill should still show "Sent" status

**How to Verify:**
- Check Network tab for POST request to `/api/bills/:id/send`
- Check email service logs (if available) or backend logs for email records
- Status should persist after page refresh

**Note:** Email sending depends on backend email configuration. If not configured, an error message should appear.

---

### **TEST 9: Download/Print Bill**

**Objective:** Generate and download a PDF of the bill

**Steps:**

1. **From Bills list, click the "Download" icon (or print icon)**
   - Expected: A PDF file downloads or a print dialog opens

2. **Open the PDF**
   - Verify all bill details are present
   - Verify formatting is professional
   - Verify calculations are correct

3. **If Print Dialog Opens**
   - Review preview
   - Can print to physical printer or save as PDF from browser

**How to Verify:**
- Check Downloads folder for PDF file named something like `bill-[number].pdf`
- PDF contains customer name, bill number, date, items, and totals
- No errors in browser console during PDF generation

---

### **TEST 10: Pagination/Scrolling** (if applicable)

**Objective:** Test large bill lists

**Steps:**

1. **If you have 50+ bills**, scroll to the bottom
   - Expected: Bills load smoothly or pagination appears
   - Expected: No lag or performance issues

2. **If pagination exists**
   - Click "Next Page" or page number
   - Expected: New set of bills loads
   - Expected: Previous bills are hidden

**How to Verify:**
- Check browser DevTools for network requests on pagination
- Verify page loads in reasonable time (<2 seconds)

---

### **TEST 11: Error Handling**

**Objective:** Verify graceful error handling

**Steps:**

1. **Stop the backend server**
   - Go to backend terminal, press Ctrl+C

2. **Try to perform any action:**
   - Click "Add Bill" → try to save → Expected: Error message "Failed to connect to server" or similar
   - Click refresh or try to load bills → Expected: Error message displayed, not a blank page crash

3. **Restart the backend**
   - Run `npm start` in backend directory
   - Refresh frontend page → Expected: Bills load successfully again

**How to Verify:**
- Error messages are user-friendly and helpful
- No application crash or white screen
- Application recovers when backend comes back

---

### **TEST 12: Calculations Accuracy** (Detail Verification)

**Objective:** Ensure all math is correct

**Steps:**

1. **Create a bill with complex items:**
   ```
   Item 1: 12 units × ₹1,234 @ 5% GST
   Item 2: 3.5 units × ₹2,000 @ 12% GST
   Item 3: 8 units × ₹500 @ 18% GST
   ```

2. **Manual Calculation:**
   - Item 1: 12 × 1,234 = 14,808 + (14,808 × 5%) = 15,548.4
   - Item 2: 3.5 × 2,000 = 7,000 + (7,000 × 12%) = 7,840
   - Item 3: 8 × 500 = 4,000 + (4,000 × 18%) = 4,720
   - **Total: 15,548.4 + 7,840 + 4,720 = 28,108.4**

3. **Compare with displayed totals**
   - Expected: Totals match your calculations exactly

**How to Verify:**
- Use a calculator to double-check
- Verify in view mode and download PDF
- All totals should be consistent across UI and API responses

---

## 🔍 Visual/UX Checks

### **Responsive Design**
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px width) - sidebar may collapse
- [ ] Test on mobile (375px width) - modal should be full-width
- All buttons and text should be clearly visible

### **Accessibility**
- [ ] Tab through form fields (keyboard navigation works)
- [ ] All form labels are associated with inputs
- [ ] Color coding is not the only way to distinguish status (check for icons or text)

### **Consistency**
- [ ] Buttons have consistent styling (color, size, hover effects)
- [ ] Modals/forms match the application theme
- [ ] Success/error messages use consistent colors (green/red)

---

## 🐛 Common Issues & Troubleshooting

### Issue: "Bills page not found" or 404
- **Solution:** Check `RoutesConfig.jsx` to ensure Bills route is added correctly
- Verify sidebar link points to correct route

### Issue: Empty bills list, but bills exist on backend
- **Solution:** 
  - Check Network tab to see if GET `/api/bills` is being called
  - Verify API returns bills in correct format
  - Check Redux DevTools to see if bills state is populated

### Issue: "Failed to create bill" error
- **Solution:**
  - Check browser console for detailed error message
  - Verify all required fields are filled
  - Check backend logs for validation errors
  - Ensure customer email is valid format

### Issue: Search/filter not working
- **Solution:**
  - Check if bill list has data first
  - Verify search text matches customer name exactly (try case variations)
  - Refresh page and try again

### Issue: PDF download fails
- **Solution:**
  - Check browser console for errors
  - Verify backend PDF generation is working
  - Check browser download permissions

### Issue: Send email returns error
- **Solution:**
  - Check if backend has email service configured
  - Verify customer email is valid
  - Check backend logs for email service errors

---

## ✅ Test Completion Checklist

- [ ] Test 1: Page Load & Initial State - ✅ Passed
- [ ] Test 2: Create a New Bill - ✅ Passed
- [ ] Test 3: View Bill Details - ✅ Passed
- [ ] Test 4: Edit a Bill - ✅ Passed
- [ ] Test 5: Delete a Bill - ✅ Passed
- [ ] Test 6: Search Functionality - ✅ Passed
- [ ] Test 7: Status Filtering - ✅ Passed
- [ ] Test 8: Send Bill (Email) - ✅ Passed
- [ ] Test 9: Download/Print Bill - ✅ Passed
- [ ] Test 10: Pagination/Scrolling - ✅ Passed (if applicable)
- [ ] Test 11: Error Handling - ✅ Passed
- [ ] Test 12: Calculations Accuracy - ✅ Passed
- [ ] Responsive Design - ✅ Verified
- [ ] Accessibility - ✅ Verified
- [ ] Consistency - ✅ Verified

---

## 📊 Test Execution Report

**Date:** [Fill in today's date]
**Tester Name:** [Your name]
**Frontend Version:** [Check package.json version]
**Backend Version:** [Check package.json version]

### Summary
- **Total Tests:** 12
- **Passed:** [ ]
- **Failed:** [ ]
- **Blocked:** [ ]

### Notes & Observations
[Document any issues, observations, or deviations from expected behavior]

---

## 🎯 Next Steps After Testing

1. **If all tests pass:**
   - Proceed to production deployment
   - Update changelog/release notes
   - Notify stakeholders

2. **If issues are found:**
   - Document bugs with steps to reproduce
   - Prioritize by severity
   - Create GitHub issues or tickets
   - Re-run tests after fixes

---

## 📞 Support & Questions

For issues or questions during testing:
1. Check backend API logs: `tail -f logs/combined.log`
2. Check browser console: F12 → Console
3. Check Network tab: F12 → Network (filter for XHR requests)
4. Refer to `BILLS_INTEGRATION.md` for integration details
5. Refer to `BILLS_TESTING_QUICKSTART.md` for quick reference
