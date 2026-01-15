# Testing Quick Reference Guide

## How to Test

### Method 1: Automated Test Runner
1. Open `test-runner.html` in your browser
2. Click individual test buttons or "Run All Tests"
3. Review results and console logs

### Method 2: Manual Testing
1. Open `index.html` in your browser
2. Follow test scenarios from `TEST_SCENARIOS.md`
3. Verify results match expected outcomes

### Method 3: Console Testing
1. Open browser console on `game.html`
2. Use JavaScript to create test stacks:
```javascript
import { RulesEngine } from './js/rules.js';
const result = RulesEngine.validateDealStack(['card_001', 'card_002', ...]);
console.log(result);
```

---

## Test Scenarios Summary

| Test | Scenario | Cards | Expected TRS | Expected Band | Key Validation |
|------|----------|-------|--------------|---------------|----------------|
| **1** | Perfect Deal | All 10 mandatory (correct order) | ≥ 80 | High | Completeness: 100, Sequencing: 100 |
| **2** | Missing Cards | 5 of 10 mandatory | < 65 | Low | Completeness: 50, Multiple gaps |
| **3** | Wrong Order | All 10 (reverse order) | 65-80 | Moderate | Sequencing: <60, Multiple violations |
| **4** | Time Overflow | All cards (18 total) | 65-80 | Moderate | Time Discipline: <60, Risk: <70 |
| **5** | Risky Shortcuts | 7 cards with 3 risky | < 65 | Low | Risk Handling: <20, High penalties |

---

## Scoring Breakdown

### Score Weights
- **Completeness**: 30% (30 points)
- **Sequencing**: 25% (25 points)
- **Risk Handling**: 25% (25 points)
- **Time Discipline**: 20% (20 points)
- **Total**: 100 points

### Score Bands
- **High**: TRS ≥ 80 → "View Verified Opportunities"
- **Moderate**: 65 ≤ TRS < 80 → "See What You Missed"
- **Low**: TRS < 65 → "Understand the Deal Process"

---

## Expected Card Sequences

### Correct Sequence (Test 1)
```
1. Bank Pre-Approval (card_001)
2. Property Inspection (card_002)
3. Land Verification at Registry (card_003)
4. Legal Due Diligence (card_004) [requires card_003]
5. Property Survey (card_005) [requires card_003]
6. Purchase Agreement Signing (card_006) [requires card_004]
7. Initial Deposit Payment (card_007) [requires card_006]
8. Property Insurance (card_008) [requires card_001]
9. Final Payment (card_009) [requires card_007, card_008]
10. Title Registration (card_010) [requires card_009]
```

### Incorrect Sequence (Test 3)
```
Reverse order - all prerequisites violated
10 → 9 → 7 → 6 → 4 → 5 → 3 → 8 → 2 → 1
```

---

## Time Budget Analysis

### Scenario: 45-Day Timeline

| Card | Time (Days) | Category |
|------|-------------|----------|
| Bank Pre-Approval | 5 | Mandatory |
| Property Inspection | 2 | Mandatory |
| Land Verification | 10 | Mandatory |
| Legal Due Diligence | 7 | Mandatory |
| Property Survey | 5 | Mandatory |
| Purchase Agreement | 1 | Mandatory |
| Initial Deposit | 1 | Mandatory |
| Property Insurance | 3 | Mandatory |
| Final Payment | 1 | Mandatory |
| Title Registration | 14 | Mandatory |
| **Mandatory Total** | **49 days** | **4 days over** |

Adding optional/red herrings:
- Estate Infrastructure: +1 day
- Environmental Assessment: +5 days
- Neighborhood Verification: +2 days
- Building Assessment: +3 days
- Interior Design: +4 days
- Furniture Shopping: +2 days
- Housewarming Party: +1 day
- Social Media: +1 day
- **Optional/Red Herring Total**: +19 days
- **Grand Total**: 68 days (51% over budget)

---

## Risk Penalties

| Risky Card | Penalty Points | Time Saved |
|------------|----------------|------------|
| Skip Land Verification | -35 | -10 days |
| Use Unverified Agent | -25 | 0 days |
| Skip Legal Due Diligence | -40 | -7 days |
| Verbal Agreement Only | -30 | -1 day |

| Red Herring Card | Penalty Points | Time Added |
|------------------|----------------|------------|
| Interior Design | -15 | +4 days |
| Furniture Shopping | -10 | +2 days |
| Housewarming Party | -12 | +1 day |
| Social Media | -8 | +1 day |

---

## Validation Checkpoints

### ✓ Completeness Score
- 10/10 mandatory cards = 100%
- 5/10 mandatory cards = 50%
- Formula: `(mandatoryCount / 10) * 30`

### ✓ Sequencing Score
- All prerequisites met = 100%
- Multiple violations = proportional reduction
- Formula: `(correctSequences / totalPossibleSequences) * 25`

### ✓ Risk Handling Score
- No risky/red herring cards = 100%
- Each penalty point reduces score
- Formula: `max(0, 25 - totalPenalties/4)`

### ✓ Time Discipline Score
- Within 45 days = 100%
- Each day over reduces score
- Formula: `max(0, 20 - (daysOver / totalDays) * 20)`

---

## Expected Messaging

### Test 1 (High TRS)
**Strengths:**
- All mandatory transaction steps completed
- Perfect sequencing of prerequisites
- No risky shortcuts taken
- Strong understanding of legal requirements

**Gaps:**
- Timeline slightly exceeded (if over 45 days)

**CTA:** "View Verified Opportunities" → igethouse.com/properties

---

### Test 2 (Low TRS)
**Strengths:**
- Minimal

**Gaps:**
- Missing 5 of 10 mandatory transaction steps
- Legal Due Diligence not completed
- Property Survey not conducted
- Property Insurance not obtained
- Title Registration not completed

**CTA:** "Understand the Deal Process" → igethouse.com/buyers-guide

---

### Test 3 (Moderate TRS)
**Strengths:**
- All mandatory transaction steps included
- No risky shortcuts taken

**Gaps:**
- Critical sequencing errors detected
- Title Registration attempted before payment completion
- Legal Due Diligence performed after agreement signing

**CTA:** "See What You Missed" → igethouse.com/consultation

---

### Test 4 (Moderate TRS)
**Strengths:**
- All mandatory transaction steps completed
- Correct sequencing maintained

**Gaps:**
- Timeline exceeded by 23 days (51% over budget)
- Included non-essential activities
- Poor time management and prioritization

**CTA:** "See What You Missed" → igethouse.com/consultation

---

### Test 5 (Low TRS)
**Strengths:**
- Minimal or none

**Gaps:**
- Critical legal verification steps skipped
- Land verification not performed (high fraud risk)
- Legal due diligence bypassed (legal liability exposure)
- Severe risk exposure in transaction structure

**CTA:** "Understand the Deal Process" → igethouse.com/buyers-guide

---

## Browser Console Commands

### Check Current State
```javascript
import { StateManager } from './js/state.js';
StateManager.load();
```

### Run Validation
```javascript
import { RulesEngine } from './js/rules.js';
const stack = ['card_001', 'card_002', 'card_003'];
const result = RulesEngine.validateDealStack(stack);
console.table(result.breakdown);
```

### Clear All Data
```javascript
localStorage.clear();
location.reload();
```

### Check Specific Scores
```javascript
const result = RulesEngine.validateDealStack(dealStack);
console.log('TRS:', result.totalScore);
console.log('Band:', result.scoreBand.level);
console.log('Breakdown:', result.breakdown);
console.log('Strengths:', result.strengths);
console.log('Gaps:', result.gaps);
```

---

## Pass/Fail Criteria

### Test 1: Successful Deal
- ✅ TRS ≥ 80
- ✅ Score Band = "high"
- ✅ Completeness = 100%
- ✅ Sequencing = 100%
- ✅ CTA = "View Verified Opportunities"

### Test 2: Missing Mandatory
- ✅ TRS < 65
- ✅ Score Band = "low"
- ✅ Completeness ≤ 50%
- ✅ Gaps mention missing mandatory cards
- ✅ CTA = "Understand the Deal Process"

### Test 3: Wrong Sequence
- ✅ TRS between 65-80
- ✅ Score Band = "moderate"
- ✅ Sequencing < 60%
- ✅ Gaps mention sequencing errors
- ✅ CTA = "See What You Missed"

### Test 4: Time Overflow
- ✅ Time Discipline < 60%
- ✅ Gaps mention timeline exceeded
- ✅ Total days > 60

### Test 5: Risky Shortcuts
- ✅ TRS < 65
- ✅ Risk Handling < 20%
- ✅ Gaps mention skipped legal steps
- ✅ Validation.riskyCards.length > 0

---

**Last Updated**: January 14, 2026  
**Version**: 1.0
