# React Portfolio Website - Enhanced Version

A modern, responsive portfolio website built with React 19, featuring interactive animations, page routing, and a professional design.

## ✨ New Features

### 1. **Multi-Page Structure with React Router**
- Separate dedicated pages for:
  - **Home** - Hero section with typing animation
  - **About Me** - Personal information, services, and experience timeline
  - **Skills** - Technical and professional skills with animated progress bars
  - **Projects** - Portfolio projects showcase
  - **Contact** - Contact form and social links
- Smooth navigation between pages
- Consistent header and footer across all pages
- Active link highlighting in navigation

### 2. **Three.js Interactive Animation (About Me Page)**
- **Code Editor Section**: Hover over the code editor to see a beautiful 3D wireframe cube animation
- Subtle depth and motion effects that respond to mouse hover
- Smooth transitions with gradient color shifts
- Lightweight and performant implementation

### 3. **360° Icon Rotation (Skills Page)**
- All tool and technology icons rotate 360 degrees on hover
- Fast, clean, and responsive animation
- Works perfectly on all devices
- Lift-up effect combined with rotation for extra polish

### 4. **Service Card Hover Effects (About Me Page)**
- Polished lift-up animation with scale transformation
- Dynamic shadow expansion on hover
- Gradient overlay effect
- Icon rotation and scale for enhanced interactivity
- Modern cubic-bezier easing for smooth motion

### 5. **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes (mobile, tablet, desktop)
- Touch-friendly interactions
- Smooth animations across devices

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- React 19
- React Router DOM (for page routing)
- Three.js (for 3D animations)
- React Three Fiber & Drei (React bindings for Three.js)
- All other required dependencies

### Step 2: Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
react-portfolio/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Navigation.jsx      # Navigation with React Router
│   │   ├── Hero.jsx           # Home hero section
│   │   ├── About.jsx          # About section with services
│   │   ├── CodeEditorWithThree.jsx  # 3D animated code editor
│   │   ├── Skills.jsx         # Skills with rotating icons
│   │   ├── Projects.jsx       # Projects showcase
│   │   ├── Contact.jsx        # Contact form
│   │   ├── Footer.jsx         # Footer component
│   │   └── BackToTop.jsx      # Scroll to top button
│   ├── pages/
│   │   ├── HomePage.jsx       # Home page
│   │   ├── AboutPage.jsx      # About page
│   │   ├── SkillsPage.jsx     # Skills page
│   │   ├── ProjectsPage.jsx   # Projects page
│   │   └── ContactPage.jsx    # Contact page
│   ├── App.jsx                # Main app with router
│   ├── index.jsx              # Entry point
│   └── index.css              # All styles and animations
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🎨 Features Breakdown

### Multi-Page Navigation
- Click any navigation link to smoothly transition to the corresponding page
- Browser back/forward buttons work correctly
- URLs update for each page (/, /about, /skills, /projects, /contact)
- Active page is highlighted in the navigation menu

### Interactive Animations

#### 1. Code Editor (About Me Page)
- **Location**: About Me page, left side
- **Trigger**: Mouse hover
- **Effect**: 3D wireframe cube appears and rotates behind the code editor
- **Details**: 
  - Smooth fade-in/fade-out
  - Color transitions between primary and secondary colors
  - Floating animation on hover
  - No impact on page performance

#### 2. Skill Icons (Skills Page)
- **Location**: Skills page, "Tools & Technologies" section
- **Trigger**: Mouse hover on individual icon cards
- **Effect**: Icon rotates 360 degrees
- **Details**:
  - 0.6s smooth rotation animation
  - Card lifts up slightly
  - Shadow expands for depth
  - Each icon retains its unique color

#### 3. Service Cards (About Me Page)
- **Location**: About Me page, "My Services" section
- **Trigger**: Mouse hover on service cards
- **Effect**: Multiple combined animations
- **Details**:
  - Lift-up with scale (translateY + scale)
  - Shadow expansion
  - Gradient overlay fade-in
  - Icon rotation and scale
  - Cubic-bezier easing for professional feel

### Theme Toggle
- Light/Dark mode switcher in navigation
- Persists preference in localStorage
- Smooth transitions between themes
- All components adapt to theme changes

### Responsive Design
- Mobile menu with hamburger icon
- Optimized layouts for all screen sizes
- Touch-friendly hover effects on mobile
- Performance optimized for slower devices

## 🎯 Key Technologies

- **React 19** - Latest React with improved performance
- **React Router DOM v6** - Client-side routing
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **CSS3** - Modern animations and transitions
- **Font Awesome** - Icon library
- **Google Fonts** - Inter and Fira Code fonts

## 📝 Customization Guide

### Updating Personal Information
Edit `src/components/About.jsx`:
```javascript
// Update your personal details
Name: "Your Name"
Email: "your.email@example.com"
Phone: "Your Phone Number"
Location: "Your Location"
```

### Changing Colors
Edit `src/index.css`:
```css
:root {
  --primary: #0ea5e9;    /* Primary color */
  --secondary: #7e22ce;  /* Secondary color */
  --dark: #0f172a;       /* Dark background */
  --darker: #020617;     /* Darker background */
}
```

### Adding More Services
Edit `src/components/About.jsx`:
```javascript
const services = [
  {
    icon: 'fas fa-your-icon',
    title: 'Your Service Title',
    description: 'Your service description'
  },
  // Add more services...
];
```

### Modifying Animations
All animation styles are in `src/index.css`:
- Search for "INTERACTIVE ANIMATIONS" section
- Adjust transition durations, transform values, etc.
- All animations use CSS for optimal performance

## 🔧 Troubleshooting

### Issue: Animations not working
**Solution**: Clear browser cache and restart development server
```bash
# Stop the server (Ctrl+C)
# Clear cache
npm start
```

### Issue: Three.js not rendering
**Solution**: Ensure all Three.js packages are installed
```bash
npm install three @react-three/fiber @react-three/drei
```

### Issue: Routing not working in production
**Solution**: Configure your hosting provider for client-side routing
- For Netlify: Add `_redirects` file with `/* /index.html 200`
- For Vercel: Routing works automatically
- For Apache: Add `.htaccess` configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Three.js Documentation](https://threejs.org/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)

## 📄 License

This project is free to use for personal and commercial purposes.

## 🙏 Credits

- Designed and developed with React 19
- Icons from Font Awesome
- Fonts from Google Fonts
- 3D graphics powered by Three.js

## 🚀 Deployment

### Deploy to Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add `_redirects` file: `/* /index.html 200`

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Vercel auto-detects React settings
4. Deploy!

### Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json:
# "homepage": "https://yourusername.github.io/portfolio"
# "predeploy": "npm run build"
# "deploy": "gh-pages -d build"
npm run deploy
```

## 📧 Support

For questions or issues, please check:
1. This README first
2. React documentation
3. Create an issue in the project repository

---

**Built with ❤️ using React 19 and Three.js**

Enjoy your enhanced portfolio website! 🎉
