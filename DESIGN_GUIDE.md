# Design Customization Guide

This guide explains how to customize the visual design of your Readynx platform.

## Quick Start

All design configurations are stored in `/src/config/designConfig.js`. Edit this file to change colors, gradients, and effects throughout the application.

## Background Colors

To change section backgrounds, edit the `backgrounds` object:

```javascript
backgrounds: {
  hero: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  workflow: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
  // ... more sections
}
```

### Examples:

**Dark Blue Theme:**
```javascript
hero: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950'
```

**Purple Theme:**
```javascript
hero: 'bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950'
```

**Green Tech Theme:**
```javascript
hero: 'bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950'
```

## Gradient Colors

Change card and element gradients in the `gradients` object:

```javascript
gradients: {
  primary: 'from-blue-500 to-cyan-500',
  secondary: 'from-purple-500 to-pink-500',
  // ... more gradients
}
```

## Particle Effects

Toggle or customize particles:

```javascript
particles: {
  enabled: true,        // Set to false to disable
  color: '#3b82f6',    // Hex color
  count: 80,           // Number of particles
  speed: 1,            // Animation speed
}
```

## Animation Settings

Enable/disable specific effects:

```javascript
animations: {
  enableParticles: true,
  enableFloatingOrbs: true,
  enableGridBackground: true,
  enableHoverGlow: true,
}
```

## Applying Changes

After editing `designConfig.js`, import and use the values in your components:

```javascript
import designConfig from '../config/designConfig';

// Use in className
className={designConfig.backgrounds.hero}
```

## Common Customizations

### 1. Change to Light Theme
Set backgrounds to light colors:
```javascript
hero: 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'
```

### 2. Change Accent Color
Update all gradient colors to your brand color:
```javascript
primary: 'from-orange-500 to-red-500'
```

### 3. Disable All Animations
```javascript
animations: {
  enableParticles: false,
  enableFloatingOrbs: false,
  enableGridBackground: false,
  enableHoverGlow: false,
}
```

## Need Help?

Refer to [Tailwind CSS documentation](https://tailwindcss.com/docs) for available color and gradient options.
