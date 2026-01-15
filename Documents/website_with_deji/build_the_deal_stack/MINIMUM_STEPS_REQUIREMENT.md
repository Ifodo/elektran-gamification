# Minimum Steps Requirement

**Date**: January 15, 2026  
**Feature**: Minimum 9 steps required before assessment submission  
**Purpose**: Ensure meaningful engagement with the transaction readiness tool

---

## Requirement

**Users must add at least 9 transaction steps to their deal stack before they can submit for assessment.**

### Why 9 Steps?

1. **Meaningful Engagement**: Forces users to think through the transaction process
2. **Educational Value**: Ensures users explore multiple card options
3. **Quality Threshold**: Most scenarios have 8-10 mandatory cards, so 9 ensures near-completion
4. **Prevents Gaming**: Discourages quick submissions without learning
5. **Professional Standard**: Real transactions require multiple coordinated steps

---

## User Experience

### Visual Indicators

#### Stack Count Display

**Before 9 steps (e.g., 5 cards added)**:
```
┌─────────────────────────┐
│ Your Deal Stack         │
│ 5/9 minimum            │ ← Orange text, shows progress
└─────────────────────────┘
```

**After 9 steps (e.g., 10 cards added)**:
```
┌─────────────────────────┐
│ Your Deal Stack         │
│ 10 steps               │ ← Green text, ready to submit
└─────────────────────────┘
```

#### Review Deal Button

**When < 9 steps**:
```
┌───────────────────────────────┐
│   Review Deal                 │ ← Grayed out, disabled
│   (disabled)                  │    Tooltip: "Add 4 more steps..."
└───────────────────────────────┘
```

**When ≥ 9 steps**:
```
┌───────────────────────────────┐
│   Review Deal                 │ ← Active, clickable
│   (enabled)                   │    Green, with shadow
└───────────────────────────────┘
```

### Error Message

**If user tries to click Review Deal with < 9 steps**:
```
┌──────────────────────────────────────┐
│ ⚠️ Minimum Steps Required            │
│                                      │
│ You need at least 9 transaction      │
│ steps to complete an assessment.     │
│                                      │
│ You currently have 5 steps.          │
│                                      │
│ Please add 4 more steps to continue. │
│                                      │
│         [ Okay ]                     │
└──────────────────────────────────────┘
```

---

## Technical Implementation

### 1. Validation Check (js/game.js)

```javascript
function validateStack() {
    const dealStack = StateManager.getDealStack();
    
    // Edge Case 1: Empty stack
    if (dealStack.length === 0) {
        ModalManager.alert(
            'No Transaction Steps Selected',
            'To receive an assessment, please add transaction steps...',
            'error'
        );
        return;
    }

    // Edge Case 1b: Minimum steps requirement (NEW)
    const MINIMUM_STEPS = 9;
    if (dealStack.length < MINIMUM_STEPS) {
        const remaining = MINIMUM_STEPS - dealStack.length;
        ModalManager.alert(
            'Minimum Steps Required',
            `You need at least ${MINIMUM_STEPS} transaction steps...\n\n` +
            `You currently have ${dealStack.length} step${dealStack.length !== 1 ? 's' : ''}.\n\n` +
            `Please add ${remaining} more step${remaining !== 1 ? 's' : ''} to continue.`,
            'warning'
        );
        return;
    }
    
    // Continue with validation...
}
```

### 2. Real-time Progress Display (js/game.js)

```javascript
function updateIndicators() {
    const MINIMUM_STEPS = 9;
    const stackCards = StateManager.getSelectedCards();
    const stackCount = document.getElementById('stackCount');
    const validateBtn = document.getElementById('validateBtn');
    
    if (stackCount) {
        if (stackCards.length < MINIMUM_STEPS) {
            // Show progress toward minimum
            stackCount.textContent = `${stackCards.length}/${MINIMUM_STEPS} minimum`;
            stackCount.style.color = 'var(--color-accent)'; // Orange
            
            // Disable button
            if (validateBtn) {
                validateBtn.disabled = true;
                validateBtn.style.opacity = '0.5';
                validateBtn.style.cursor = 'not-allowed';
                validateBtn.title = `Add ${MINIMUM_STEPS - stackCards.length} more...`;
            }
        } else {
            // Show total steps
            stackCount.textContent = `${stackCards.length} steps`;
            stackCount.style.color = 'var(--color-primary)'; // Green
            
            // Enable button
            if (validateBtn) {
                validateBtn.disabled = false;
                validateBtn.style.opacity = '1';
                validateBtn.style.cursor = 'pointer';
                validateBtn.title = 'Submit your deal stack for assessment';
            }
        }
    }
}
```

### 3. Button Styling (css/style.css)

```css
.btn-review:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-text-muted);
    box-shadow: none;
}

.btn-review:disabled:hover {
    transform: none;
}
```

---

## User Journey

### Scenario: First-Time User

**Step 1**: User starts with empty stack
```
Stack: 0/9 minimum (orange)
Button: Disabled (grayed out)
```

**Step 2**: User adds 3 cards
```
Stack: 3/9 minimum (orange)
Button: Still disabled
Tooltip: "Add 6 more steps to unlock assessment"
```

**Step 3**: User adds 5 more cards (total 8)
```
Stack: 8/9 minimum (orange)
Button: Still disabled
Tooltip: "Add 1 more step to unlock assessment"
```

**Step 4**: User adds 1 more card (total 9)
```
Stack: 9 steps (green)
Button: Enabled! ✅
Tooltip: "Submit your deal stack for assessment"
```

**Step 5**: User clicks "Review Deal"
```
✅ Validation proceeds
→ Redirects to result.html
```

---

## Edge Cases Handled

### 1. User with < 9 Steps Tries to Submit
**Scenario**: User has 5 steps and clicks Review Deal (somehow bypasses disabled state)

**Handling**:
```javascript
if (dealStack.length < MINIMUM_STEPS) {
    ModalManager.alert('Minimum Steps Required', ...);
    return; // Prevents submission
}
```

### 2. User Removes Cards Below Minimum
**Scenario**: User has 10 steps, then removes 2 (now 8)

**Handling**:
- `updateIndicators()` runs automatically on card removal
- Stack count changes to "8/9 minimum" (orange)
- Button becomes disabled again
- User sees visual feedback immediately

### 3. Page Reload Mid-Session
**Scenario**: User has 6 steps, refreshes page

**Handling**:
- State loads from Local Storage
- `updateIndicators()` runs on page load
- Displays "6/9 minimum" (orange)
- Button correctly disabled

### 4. Different Scenarios Have Different Mandatory Counts
**Scenario**: Commercial has 11 mandatory, Land has 5 mandatory

**Handling**:
- Minimum is still 9 for all scenarios (universal threshold)
- Ensures consistent engagement level across all transaction types
- Users must add cards beyond minimum mandatory in some scenarios

---

## Benefits

### For Users:
✅ **Clear expectations** - Know exactly how many more steps needed  
✅ **Visual progress** - See "5/9 minimum" updating in real-time  
✅ **Prevents frustration** - Can't submit incomplete assessment  
✅ **Learning reinforcement** - Must explore card library thoroughly  

### For Product:
✅ **Higher quality submissions** - More thoughtful deal stacks  
✅ **Better data** - Assessments reflect genuine understanding  
✅ **Reduced noise** - Fewer "test" submissions with 2-3 cards  
✅ **Educational value** - Users learn the transaction process  

### For Business:
✅ **Lead quality** - Users who complete 9+ steps are more serious  
✅ **Engagement metric** - Measures genuine interest in property transactions  
✅ **Qualification funnel** - Separates curious browsers from serious buyers  

---

## Configuration

### Changing the Minimum

To adjust the minimum requirement, update the constant in **js/game.js**:

**Current**:
```javascript
const MINIMUM_STEPS = 9;
```

**Alternative Values**:
```javascript
const MINIMUM_STEPS = 5;  // More lenient (not recommended)
const MINIMUM_STEPS = 10; // Stricter (all mandatory + 1-2 optional)
const MINIMUM_STEPS = 12; // Very strict (forces optional cards)
```

**Recommendation**: Keep at 9 as it balances:
- Ensures mandatory completion (8-10 mandatory per scenario)
- Allows some flexibility (not overly restrictive)
- Meaningful engagement without frustration

---

## Scenario-Specific Analysis

### Residential (Beginner-Friendly):
- **Mandatory Cards**: 10
- **Minimum Required**: 9
- **Impact**: User must add 9/10 mandatory (90% completion)

### Off-Plan (Intermediate):
- **Mandatory Cards**: 7-8 (when card pools are created)
- **Minimum Required**: 9
- **Impact**: User must add all mandatory + 1-2 optional

### Commercial (Advanced):
- **Mandatory Cards**: 9-11 (when card pools are created)
- **Minimum Required**: 9
- **Impact**: User must add most/all mandatory

### Land (Intermediate):
- **Mandatory Cards**: 5-6 (when card pools are created)
- **Minimum Required**: 9
- **Impact**: User must add all mandatory + 3-4 optional

**Note**: Currently all scenarios use the Residential card pool (22 cards total). When scenario-specific card pools are implemented, the 9-step minimum will still apply universally.

---

## Testing Scenarios

### Test 1: Empty to Minimum
1. Start with 0 cards
2. Verify button is disabled
3. Add 8 cards, verify still disabled
4. Add 9th card, verify button enables
5. Click button, verify submission proceeds

### Test 2: Above Minimum
1. Add 15 cards
2. Verify button is enabled
3. Click button, verify submission proceeds

### Test 3: Below Minimum Attempt
1. Add 5 cards
2. Button should be disabled
3. If somehow clicked, verify error modal appears
4. Verify submission is blocked

### Test 4: Add and Remove
1. Add 10 cards (button enabled)
2. Remove 2 cards (now 8, button should disable)
3. Add 1 card (now 9, button should enable)
4. Verify state transitions smoothly

### Test 5: Page Reload
1. Add 7 cards
2. Refresh page
3. Verify shows "7/9 minimum"
4. Verify button is disabled

---

## Analytics

### Metrics to Track

**Engagement**:
- Average cards added before submission
- % of users who reach 9+ steps
- Time to reach 9 steps
- Drop-off rate at each step count (0-8)

**Conversion**:
- % who complete with exactly 9 steps
- % who exceed minimum (10+, 15+)
- Correlation between step count and TRS score

**User Behavior**:
- How many users try to submit < 9 (hit error)
- Card categories chosen to reach minimum
- Scenarios with highest/lowest completion rates

---

## Future Enhancements

### Dynamic Minimum by Scenario
```javascript
const MINIMUM_STEPS = {
    'residential_basic': 9,
    'offplan_investment': 8,
    'commercial_property': 11,
    'land_banking': 7
};
```

### Progressive Unlock
- First-time users: 12 steps required
- Returning users: 9 steps
- Expert users (completed 3+ scenarios): 7 steps

### Adaptive Minimum
- Based on mandatory count: `Math.ceil(mandatory * 0.9)`
- Example: 10 mandatory → minimum = 9

---

## Success Metrics

### Immediate (Week 1):
- [ ] 90%+ of submissions have 9+ steps
- [ ] < 5% error rate on "minimum required" modal
- [ ] Button disabled/enabled transitions work smoothly

### Short-term (Month 1):
- [ ] Average steps per submission increases to 10-12
- [ ] User feedback is positive on clarity
- [ ] No reports of confusion about requirement

### Long-term (Quarter 1):
- [ ] Higher quality leads (more engaged users)
- [ ] Better TRS scores on average (more complete stacks)
- [ ] Lower bounce rate on result page

---

## User Communication

### On Landing Page (Optional Addition):
> "Build a complete transaction stack with at least 9 steps to receive your readiness assessment."

### In-Game Help Text (Optional):
> **Tip**: Add at least 9 transaction steps to unlock your assessment. Each step represents a critical action in the property transaction process.

### First-Time User Tutorial (Optional):
> **Step 3**: Build your stack by dragging cards from the left panel. You'll need at least 9 steps to complete your assessment.

---

## Rollback Plan

If the 9-step minimum creates too much friction:

### Option 1: Reduce to 7
```javascript
const MINIMUM_STEPS = 7;
```

### Option 2: Remove Minimum
```javascript
// Comment out minimum check
// if (dealStack.length < MINIMUM_STEPS) { ... }
```

### Option 3: Make it a Warning (Not a Block)
```javascript
if (dealStack.length < MINIMUM_STEPS) {
    ModalManager.confirm(
        'Low Step Count',
        `Most users add 9+ steps. Continue with ${dealStack.length}?`,
        () => proceedWithValidation(),
        null,
        { confirmText: 'Continue Anyway', cancelText: 'Add More' }
    );
    return;
}
```

---

## Summary

✅ **Minimum 9 steps required** for assessment submission  
✅ **Visual progress indicator** shows "X/9 minimum"  
✅ **Button disabled** until requirement met  
✅ **Clear error message** if minimum not reached  
✅ **Real-time updates** as cards added/removed  

**Impact**: Higher quality submissions, better user engagement, more meaningful assessments.

---

**Status**: ✅ Implemented and ready for testing  
**Files Modified**: `js/game.js`, `css/style.css`  
**Testing Required**: All edge cases listed above  
**User Communication**: Consider adding help text explaining the requirement

---

**Questions?** The minimum is set as a constant in `js/game.js` - easy to adjust if needed based on user feedback.
