# Build the Deal Stack

**A Transaction Readiness Simulator for Nigerian Real Estate**

---

## 🚀 Quick Start

### Run Locally (No Server Required!)

1. **Download or Clone** this repository
2. **Double-click** `index.html`
3. **Start building** your deal stack!

That's it! The application runs directly in your browser without needing any server setup.

---

## 📖 What is This?

Build the Deal Stack is a qualification funnel designed to identify serious buyers and investors in Nigerian real estate. It simulates the complete transaction process, testing users' understanding of:

- Mandatory legal and financial steps
- Correct sequencing of procedures
- Risk management and avoidance
- Timeline and budget discipline

**This is NOT a game** - it's a professional assessment tool with transaction readiness scoring.

---

## 🎯 Features

### Interactive Deal Building
- Drag-and-drop interface for assembling transaction steps
- Real-time risk and timeline indicators
- Visual feedback on deal health

### Comprehensive Validation
- Checks for all mandatory transaction steps
- Validates correct sequencing and prerequisites
- Identifies risky shortcuts and unnecessary steps
- Calculates Transaction Readiness Score (TRS 0-100)

### Personalized Results
- Detailed performance breakdown across 4 metrics
- Specific strengths and development areas identified
- Score-based CTAs:
  - TRS ≥ 80: "View Verified Opportunities"
  - TRS 65-80: "See What You Missed"
  - TRS < 65: "Understand the Deal Process"

### Smart Session Management
- Progress saved automatically to Local Storage
- Survives page refreshes
- Can pause and resume assessment
- "Start New Deal" clears data and starts fresh

---

## 📁 Project Structure

```
build_the_deal_stack/
├── index.html              # Landing page
├── game.html               # Assessment interface
├── result.html             # Results display
├── css/
│   └── style.css          # All styles (mobile-first, responsive)
├── js/
│   ├── data.js            # Deal scenarios and cards
│   ├── state.js           # Local Storage state management
│   ├── rules.js           # Validation engine and scoring
│   ├── game.js            # Drag-and-drop logic
│   └── result.js          # Results rendering
├── assets/
│   └── logo.jpg           # Brand logo
├── test-runner.html       # Automated testing interface
└── Documentation/
    ├── Recommendations.md          # Product requirements (PRD)
    ├── .cursorrules               # Project conventions
    ├── EDGE_CASES.md              # Edge case handling
    ├── TEST_SCENARIOS.md          # Testing procedures
    ├── TESTING_QUICK_REFERENCE.md # Testing cheat sheet
    └── NO_SERVER_REQUIRED.md      # Technical explanation
```

---

## 🧪 Testing

### Automated Tests
1. Open `test-runner.html` in your browser
2. Click "Run All Tests"
3. Verify all 5 scenarios pass

### Manual Testing
See `TEST_SCENARIOS.md` for detailed test procedures covering:
- Successful deal completion
- Missing mandatory cards
- Incorrect sequencing
- Time overflow
- Risky shortcuts

---

## 🎨 Design Principles

### Professional, Not Playful
- No game terminology (no "points", "win", "levels")
- Advisory tone throughout
- Clean, card-based UI
- Neutral color palette (Deep Green, Terracotta, Sand White)

### Mobile-First Responsive
- Works on all screen sizes
- Three-column layout on desktop
- Stacked layout on mobile
- Touch-friendly interactions

### Accessibility
- Semantic HTML5
- ARIA labels
- Keyboard navigation support
- Clear visual hierarchy

---

## 🔧 Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Local Storage** - State persistence
- **HTML5 Drag and Drop API** - Card interaction

**No build process, no dependencies, no npm** - just pure web technologies!

---

## 📊 Transaction Readiness Score (TRS)

The TRS is calculated from 4 weighted metrics:

| Metric | Weight | Measures |
|--------|--------|----------|
| **Completeness** | 30% | Presence of all mandatory steps |
| **Sequencing** | 25% | Correct order and prerequisites |
| **Risk Handling** | 25% | Avoiding shortcuts and red herrings |
| **Time Discipline** | 20% | Staying within 45-day timeline |

**Total:** 100 points

### Score Bands
- **High (80-100):** Ready for property acquisition
- **Moderate (65-79):** Needs targeted guidance
- **Low (0-64):** Requires foundational education

---

## 🎓 Learning Objectives

Users completing this assessment will:
- Understand the Nigerian real estate transaction process
- Recognize mandatory legal and financial requirements
- Appreciate the importance of correct sequencing
- Identify risky shortcuts and their consequences
- Develop realistic timeline expectations

---

## 🚀 Deployment

The application is fully static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service
- Traditional web server (Apache, Nginx)

Simply upload all files - no build step required!

---

## 🔒 Privacy & Data

- **All data stored locally** in browser's Local Storage
- **No server-side storage** or transmission
- **No tracking or analytics**
- Email capture is soft gate (optional, stored locally only)
- User can clear data anytime via "Start New Deal"

---

## 🐛 Troubleshooting

### Application won't load
- Ensure JavaScript is enabled in your browser
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

### Progress not saving
- Check if Local Storage is enabled (not in private/incognito mode)
- Verify browser supports Local Storage (all modern browsers do)

### Drag-and-drop not working
- Use a modern browser (Chrome, Edge, Firefox, Safari)
- Try clicking cards if drag fails (mobile fallback TBD)

### Results not displaying
- Complete and submit the assessment first
- Check browser console (F12) for errors
- Try "Start New Deal" and reassess

---

## 📝 License

© 2026 IGetHouse / IICOCECE Properties & Investment Ltd. All rights reserved.

---

## 👥 Credits

**Development:** Cursor AI  
**Product Design:** Based on PRD in `Recommendations.md`  
**Brand Identity:** IGetHouse  
**Target Market:** Nigerian Real Estate

---

## 📞 Support

For questions or issues:
1. Check `EDGE_CASES.md` for common scenarios
2. Review `TEST_SCENARIOS.md` for expected behavior
3. Inspect browser console for error messages

---

## 🎯 Future Enhancements

Potential additions (see `Recommendations.md` for details):
- Multiple deal scenarios (Lagos, Abuja, Port Harcourt)
- Difficulty levels (beginner, intermediate, advanced)
- Detailed explanations for each card
- Downloadable PDF report
- Social sharing
- Leaderboard (anonymous)
- Mobile app version

---

**Version:** 1.0  
**Last Updated:** January 14, 2026  
**Status:** ✅ Production Ready
