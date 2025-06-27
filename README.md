# Niobi Reconciliation Tool

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A B2B fintech tool for comparing internal transaction records against payment provider statements to identify discrepancies.

## Features

**CSV File Processing**  
- Dual file upload (Internal System + Provider Statement)  
- Sample dataset for instant testing  
- CSV validation and error handling  

**Smart Reconciliation**  
- Transaction matching by reference ID  
- Amount/status discrepancy detection  
- Three-way categorization:  
  - ✅ Matched  
  - ⚠️ Internal-only  
  - ❌ Provider-only  

**Visual Reporting**  
- Interactive results table with tabs  
- Color-coded status indicators  
- Summary statistics dashboard  

**Data Export**  
- Download results as CSV  
- Formatted financial data  

## Live Demo

[![Replit Demo](https://img.shields.io/badge/Replit-Demo-red?style=for-the-badge&logo=replit&logoColor=white)](https://niobi-reconciliation-tool-alpha.vercel.app/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/niobi-reconciliation-tool.git
```
2. Install dependencies:
```bash
cd niobi-reconciliation-tool
npm install
```
3. Start development server:
```bash
npm run dev
```

## Deployment
### Vercel
Set these in project settings:
```
Build Command: npm run build
Output Directory: dist
Node Version: 18.x or higher
```

### Replit
```
Import from GitHub
```
Run command:

```bash
npm run dev -- --host 0.0.0.0 --port 3000
```
### Configuration
Add these files to your project root:
```
tailwind.config.js - See config
postcss.config.js - See config
```

Sample CSV files in /public:

- sample-internal.csv
- sample-provider.csv

Format requirements:

```
transaction_reference,amount,status
TX1001,500.00,SUCCESS
TX1002,750.00,FAILED
```

Tech Stack
- Frontend: React 18 + Vite
- Styling: Tailwind CSS
- CSV Parsing: Papaparse
- Build Tool: Vite 5

License
MIT License - See LICENSE
