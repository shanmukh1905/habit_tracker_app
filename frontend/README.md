# Habit Tracker Application

A modern, responsive web application for tracking daily habits and building positive routines.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Collapsible sidebar navigation
│   │   ├── Button.jsx        # Reusable button component
│   │   ├── HabitItem.jsx     # Individual habit display component
│   │   └── StatCard.jsx      # Statistics display component
│   ├── pages/
│   │   ├── Home.jsx          # Main dashboard page
│   │   └── Habits.jsx        # Habit management page
│   ├── App.jsx               # Main application component
│   ├── App.css               # Global styles
│   └── main.jsx              # Application entry point
└── package.json              # Project dependencies
```

## Features Implemented

### 1. Navigation System
- Collapsible sidebar with smooth animations
- Responsive design that adapts to different screen sizes
- Icon-based navigation with text labels
- Active state indicators for current page

### 2. Home/Dashboard Page
- Welcome section with user greeting
- Quick statistics display:
  - Total habits
  - Completed habits today
  - Best streak
- Feature cards for quick navigation
- Habit list with completion tracking

### 3. Habits Management
- Add new habits
- Mark habits as complete/incomplete
- Delete habits
- Track habit streaks
- Visual progress indicators

### 4. Styling and UI
- Modern gradient backgrounds
- Smooth transitions and animations
- Responsive layout for all screen sizes
- Interactive hover effects
- Consistent color scheme
- Card-based design system

### 5. Components

#### Navbar Component
- Collapsible sidebar
- Icon-based navigation
- Responsive design
- Smooth animations

#### Button Component
- Multiple variants (primary, secondary)
- Different sizes
- Hover and active states
- Icon support

#### HabitItem Component
- Habit name and streak display
- Completion toggle
- Delete functionality
- Visual progress indicators

#### StatCard Component
- Title and value display
- Consistent styling
- Responsive layout

## Technical Implementation

### Dependencies
- React 19.0.0
- React DOM 19.0.0
- React Icons 5.5.0
- Vite 6.2.0

### Styling
- CSS with modern features
- Flexbox and Grid layouts
- Media queries for responsiveness
- CSS animations and transitions
- Custom keyframe animations

### State Management
- React useState hooks
- Component-level state
- Props for data passing

## Responsive Design Breakpoints
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Future Improvements
1. User authentication
2. Data persistence
3. Habit categories
4. Detailed statistics
5. Goal setting
6. Reminder system
7. Dark/light theme toggle

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Development Notes

- The application uses a mobile-first approach
- All components are designed to be reusable
- CSS is organized with a component-based structure
- Animations are optimized for performance
- The codebase follows React best practices
