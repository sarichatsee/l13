# ShoreSquad Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
ShoreSquad is a beach cleanup coordination web application that combines environmental activism with social features. The app helps young people organize beach cleanups using weather data, interactive maps, and crew coordination tools.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js for interactive maps
- **Styling**: Modern CSS with custom properties (CSS variables)
- **Responsive**: Mobile-first design approach
- **Development**: Live Server for hot reload

## Design System

### Color Palette
- Ocean Blue (#0077BE) - Primary brand color
- Deep Navy (#1A365D) - Text and contrast
- Sea Green (#20B2AA) - Success states and environmental focus
- Coral (#FF6B6B) - Accent color for CTAs
- Sandy Beige (#F5E6D3) - Secondary warmth
- Wave White (#F8FBFF) - Clean backgrounds

### Typography
- Font Family: Poppins (Google Fonts)
- Hierarchy: Clear heading structure (h1-h6)
- Accessibility: Minimum 16px base font size

### Spacing System
- XS: 0.5rem, SM: 1rem, MD: 1.5rem, LG: 2rem, XL: 3rem, XXL: 4rem

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Maintain clear document structure
- Use BEM-style class naming where appropriate

### CSS
- Use CSS custom properties for theming
- Mobile-first responsive design
- Flexbox and Grid for layouts
- Smooth transitions and animations
- High contrast support
- Reduced motion preferences

### JavaScript
- ES6+ modern syntax
- Class-based architecture
- Async/await for promises
- Event delegation patterns
- Error handling and fallbacks
- Performance considerations

## Key Features to Maintain
1. **Accessibility**: WCAG 2.1 AA compliance
2. **Performance**: Fast loading and smooth interactions
3. **Responsive**: Works on all device sizes
4. **Progressive Enhancement**: Core functionality without JavaScript
5. **Social Features**: Sharing and crew coordination
6. **Environmental Focus**: Beach cleanup and sustainability

## API Integration Notes
- Weather API integration ready (currently simulated)
- Geolocation services implemented
- Map markers for cleanup locations
- Social sharing capabilities

## Development Conventions
- Keep functions small and focused
- Use descriptive variable names
- Comment complex logic
- Maintain consistent indentation
- Test across different browsers and devices

## Component Structure
- Modular CSS with logical sections
- JavaScript organized in classes
- Reusable utility functions
- Clear separation of concerns

When writing code for this project, prioritize:
1. User experience and accessibility
2. Environmental theme and ocean aesthetics
3. Social features that encourage participation
4. Mobile-first responsive design
5. Performance and loading speed
6. Code maintainability and documentation
