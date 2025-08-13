# Construction Calculators

A comprehensive collection of construction calculators built with Next.js 14+ App Router.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── calculators/        # Calculator pages and layouts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable React components
│   └── Sidebar.tsx         # Navigation sidebar
├── constants/              # Application constants
│   └── index.ts            # Shared constants
├── lib/                    # Utility functions
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript type definitions
    └── calculator.ts       # Calculator-related types

public/                     # Static assets
├── favicon.ico
└── *.svg                   # Icon files
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Available Calculators

### Construction Converters
- Board Foot Calculator
- Square Feet to Cubic Yards Calculator
- Cubic Yard Calculator
- Square Footage Calculator
- Gallons per Square Foot Calculator
- Square Yards Calculator
- Size to Weight Calculator (Rectangular Box)

### Other Categories
- Construction Materials
- Cement & Concrete
- Home & Garden
- Roofing
- Water Tank & Vessels
- Materials Specifications
- Other Tools

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Icons**: Emoji-based icons

## 📁 File Organization

This project follows Next.js 13+ App Router conventions with the `src` directory structure:

- **`src/app/`**: Contains all pages, layouts, and route handlers
- **`src/components/`**: Reusable UI components
- **`src/lib/`**: Utility functions and helpers
- **`src/types/`**: TypeScript type definitions
- **`src/constants/`**: Application constants and configuration

## 🎨 Styling

- Uses Tailwind CSS for styling
- Custom CSS variables for theming
- Dark mode support
- Responsive design for all screen sizes

## 📱 Features

- ✅ Responsive design
- ✅ Dark mode support
- ✅ Type-safe with TypeScript
- ✅ SEO optimized
- ✅ Fast loading with Next.js optimization
- ✅ Clean, professional UI
- ✅ Comprehensive calculator collection

## 🔧 Development

To add a new calculator:

1. Create a new page in `src/app/calculators/[category]/[calculator]/page.tsx`
2. Add types in `src/types/calculator.ts`
3. Add constants in `src/constants/index.ts`
4. Update the sidebar navigation if needed

## 📄 License

This project is built for construction professionals and educational purposes.
