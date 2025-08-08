# Dota 2 Drafting Tool - Detailed Execution Plan

## Phase 1: Project Setup and Configuration

### Initial Setup
- [ ] Create a new Next.js 14+ project with TypeScript using `npx create-next-app@latest dota2-draft-tool --typescript --app --tailwind`
- [ ] Remove all default Next.js boilerplate code from app/page.tsx
- [ ] Delete default styles from app/globals.css except Tailwind directives
- [ ] Create a .env.local file in the root directory
- [ ] Add NEXT_PUBLIC_OPENDOTA_API_URL=https://api.opendota.com/api to .env.local
- [ ] Create a .env.example file with the same structure but empty values
- [ ] Add .env.local to .gitignore if not already present
- [ ] Initialize git repository with `git init` if not already done
- [ ] Create initial commit with message "Initial project setup"

### Tailwind Configuration
- [ ] Open tailwind.config.ts file
- [ ] Add custom color palette to theme.extend.colors with values: background: '#121315', accentPrimary: '#ad3f21', black: '#000000', textLight: '#d1d1c6', textSecondary: '#cecece'
- [ ] Update content array in tailwind.config.ts to include all component paths
- [ ] Create a new CSS file app/styles/variables.css for CSS custom properties
- [ ] Define CSS variables in variables.css matching the color palette
- [ ] Import variables.css in app/globals.css

### Project Structure
- [ ] Create folder app/components in the project root
- [ ] Create folder app/components/ui for UI components
- [ ] Create folder app/components/draft for draft-specific components
- [ ] Create folder app/lib for utility functions and API calls
- [ ] Create folder app/lib/api for API integration functions
- [ ] Create folder app/types for TypeScript type definitions
- [ ] Create folder app/hooks for custom React hooks
- [ ] Create folder app/contexts for React context providers
- [ ] Create folder public/images/heroes for hero portraits
- [ ] Create folder app/constants for constant values

## Phase 2: TypeScript Interfaces and Type Definitions

### Hero Data Types
- [ ] Create file app/types/hero.ts
- [ ] Define interface IHero with properties: id (number), name (string), localized_name (string), primary_attr (string), attack_type (string), roles (string[])
- [ ] Define interface IHeroStats with properties: base_health, base_mana, base_armor, base_attack_min, base_attack_max, base_str, base_agi, base_int
- [ ] Define type HeroRole as union type: 'Carry' | 'Mid' | 'Offlane' | 'Support' | 'Hard Support'
- [ ] Define type Position as union type: 1 | 2 | 3 | 4 | 5
- [ ] Create mapping constant ROLE_TO_POSITION mapping HeroRole to Position

### Draft Types
- [ ] Create file app/types/draft.ts
- [ ] Define interface IDraftSlot with properties: hero (IHero | null), role (HeroRole | null), team ('radiant' | 'dire'), position (Position | null)
- [ ] Define interface IDraftState with properties: radiantPicks (IDraftSlot[]), direPicks (IDraftSlot[]), recommendations (IHero[])
- [ ] Define interface ITeamComposition with properties: team ('radiant' | 'dire'), slots (IDraftSlot[])
- [ ] Define type DraftPhase as union type: 'ban' | 'pick' | 'complete'

### API Response Types
- [ ] Create file app/types/api.ts
- [ ] Define interface IOpenDotaHeroResponse matching OpenDota API hero endpoint response structure
- [ ] Define interface IOpenDotaMatchResponse for match data structure
- [ ] Define interface IApiError with properties: message (string), code (number), details (any)
- [ ] Create type guard function isApiError to check if an object is IApiError

## Phase 3: OpenDota API Integration

### API Client Setup
- [ ] Create file app/lib/api/opendota.ts
- [ ] Create constant OPENDOTA_BASE_URL from environment variable
- [ ] Implement function fetchWithTimeout that adds timeout to fetch requests (default 5000ms)
- [ ] Implement error handling wrapper function handleApiError that formats API errors consistently
- [ ] Create function buildUrl that constructs API URLs with query parameters

### Hero Data Fetching
- [ ] Implement async function fetchAllHeroes that fetches from /heroes endpoint
- [ ] Add response caching to fetchAllHeroes using Next.js cache with 1 hour revalidation
- [ ] Implement async function fetchHeroStats that fetches from /heroStats endpoint
- [ ] Create function transformHeroData that maps API response to IHero interface
- [ ] Implement retry logic for failed API calls (max 3 retries with exponential backoff)
- [ ] Create function getHeroImageUrl that returns CDN URL for hero portraits
- [ ] Implement function filterHeroesByRole that filters heroes array by role
- [ ] Create function searchHeroes that searches heroes by name (partial match)

### Data Caching Layer
- [ ] Create file app/lib/api/cache.ts
- [ ] Implement in-memory cache for hero data using Map
- [ ] Create function getCachedHeroes that returns cached data if available and not expired
- [ ] Implement function setCachedHeroes that stores hero data with timestamp
- [ ] Create cache invalidation function clearHeroCache
- [ ] Add cache warming function that pre-fetches hero data on app start

## Phase 4: Core UI Components

### Hero Portrait Component
- [ ] Create file app/components/ui/HeroPortrait.tsx
- [ ] Define component props: hero (IHero | null), onClick (function), isSelected (boolean), size ('small' | 'medium' | 'large')
- [ ] Implement conditional rendering for empty state (show placeholder when hero is null)
- [ ] Add Next.js Image component for hero portrait with proper sizing
- [ ] Implement hover effect with scale transform and border highlight
- [ ] Add selected state styling with accent color border
- [ ] Create loading skeleton state for when image is loading
- [ ] Add hero name tooltip on hover using CSS
- [ ] Implement click handler that calls onClick prop with hero data
- [ ] Add disabled state styling when hero is already picked

### Role Selector Component
- [ ] Create file app/components/ui/RoleSelector.tsx
- [ ] Define component props: value (HeroRole | null), onChange (function), disabled (boolean)
- [ ] Create dropdown using native select element styled with Tailwind
- [ ] Add options for all 5 roles: Carry, Mid, Offlane, Support, Hard Support
- [ ] Implement controlled component pattern with value and onChange
- [ ] Add default "Select Role" placeholder option
- [ ] Style dropdown with dark theme matching color palette
- [ ] Add hover and focus states with accent color
- [ ] Implement disabled state styling
- [ ] Add aria-label for accessibility

### Hero Search Input
- [ ] Create file app/components/ui/HeroSearchInput.tsx
- [ ] Define component props: value (string), onChange (function), placeholder (string)
- [ ] Implement text input with search icon
- [ ] Add debouncing to onChange handler (300ms delay)
- [ ] Style with dark background and light text
- [ ] Add clear button when input has value
- [ ] Implement focus state with accent color border
- [ ] Add keyboard navigation support (Escape to clear)
- [ ] Create loading spinner for search in progress

### Hero Grid Component
- [ ] Create file app/components/ui/HeroGrid.tsx
- [ ] Define component props: heroes (IHero[]), onHeroSelect (function), selectedHeroes (IHero[])
- [ ] Implement CSS Grid layout with responsive columns
- [ ] Render HeroPortrait for each hero in heroes array
- [ ] Add visual indicator for already selected heroes (opacity reduction)
- [ ] Implement virtualization for performance with large hero lists
- [ ] Add attribute filter buttons (Strength, Agility, Intelligence, Universal)
- [ ] Create role filter chips for quick filtering
- [ ] Add "Show All" button to clear filters
- [ ] Implement smooth scroll to top when filters change

### Hero Selection Modal
- [ ] Create file app/components/draft/HeroSelectionModal.tsx
- [ ] Define component props: isOpen (boolean), onClose (function), onSelectHero (function), excludedHeroes (IHero[])
- [ ] Implement modal overlay with semi-transparent background
- [ ] Create modal container with max-width and centered position
- [ ] Add modal header with title "Select Hero" and close button
- [ ] Integrate HeroSearchInput at the top of modal
- [ ] Add HeroGrid below search input
- [ ] Implement search functionality that filters hero grid
- [ ] Add keyboard navigation (Escape to close, Enter to select)
- [ ] Create smooth open/close animations with CSS transitions
- [ ] Implement click-outside-to-close functionality
- [ ] Add loading state while heroes are being fetched

## Phase 5: Draft Interface Implementation

### Draft Slot Component
- [ ] Create file app/components/draft/DraftSlot.tsx
- [ ] Define component props: slot (IDraftSlot), onHeroClick (function), onRoleChange (function), slotIndex (number)
- [ ] Create container div with border and padding
- [ ] Integrate HeroPortrait component for hero display
- [ ] Add RoleSelector component below hero portrait
- [ ] Display position number (1-5) in corner
- [ ] Implement empty state with "+" icon to add hero
- [ ] Add team color indicator (green for Radiant, red for Dire)
- [ ] Create hover effect to show edit options
- [ ] Add remove hero button (X icon) on hover
- [ ] Implement slot highlighting when active

### Team Draft Section
- [ ] Create file app/components/draft/TeamDraftSection.tsx
- [ ] Define component props: team ('radiant' | 'dire'), slots (IDraftSlot[]), onSlotUpdate (function)
- [ ] Create team header with team name and styling
- [ ] Implement horizontal layout for 5 draft slots
- [ ] Add team-specific background color (subtle green/red tint)
- [ ] Create responsive layout that stacks on mobile
- [ ] Add team label with custom font styling
- [ ] Implement animation when heroes are added
- [ ] Add visual separator between teams

### Main Draft Layout
- [ ] Create file app/components/draft/DraftLayout.tsx
- [ ] Define component props: draftState (IDraftState), onDraftUpdate (function)
- [ ] Create main container with full height and dark background
- [ ] Add title "Dota 2 Draft Tool" at the top
- [ ] Implement Radiant team section at the top
- [ ] Add VS divider between teams
- [ ] Implement Dire team section at the bottom
- [ ] Add recommendations panel on the right side
- [ ] Create responsive layout for mobile devices
- [ ] Add draft action buttons (Clear, Save, Share)
- [ ] Implement keyboard shortcuts display

## Phase 6: State Management

### Draft Context
- [ ] Create file app/contexts/DraftContext.tsx
- [ ] Define DraftContext with value type IDraftState
- [ ] Create DraftProvider component with children prop
- [ ] Implement useState for managing draft state
- [ ] Create updateSlot function to update specific draft slot
- [ ] Implement addHero function to add hero to specific slot
- [ ] Create removeHero function to remove hero from slot
- [ ] Implement updateRole function to change role for slot
- [ ] Add clearDraft function to reset all selections
- [ ] Create swapSlots function to swap two heroes
- [ ] Export useDraft custom hook for consuming context

### Hero Data Context
- [ ] Create file app/contexts/HeroDataContext.tsx
- [ ] Define HeroDataContext with heroes array and loading state
- [ ] Create HeroDataProvider component
- [ ] Implement useEffect to fetch heroes on mount
- [ ] Add error state handling for failed API calls
- [ ] Create refresh function to re-fetch hero data
- [ ] Implement search functionality within context
- [ ] Add filtering methods for roles and attributes
- [ ] Export useHeroData custom hook

### Local Storage Persistence
- [ ] Create file app/hooks/useLocalStorage.ts
- [ ] Implement generic useLocalStorage hook with TypeScript
- [ ] Add JSON serialization and deserialization
- [ ] Implement error handling for localStorage access
- [ ] Create draft auto-save functionality using useLocalStorage
- [ ] Add debouncing to prevent excessive writes
- [ ] Implement draft history with max 5 saved drafts
- [ ] Create function to load saved draft
- [ ] Add function to delete saved draft

## Phase 7: Recommendation System (v1 - Random)

### Recommendation Component
- [ ] Create file app/components/draft/RecommendationPanel.tsx
- [ ] Define component props: recommendations (IHero[]), onSelectRecommendation (function)
- [ ] Create panel container with title "Recommended Heroes"
- [ ] Implement vertical layout for 5 recommendation slots
- [ ] Add HeroPortrait for each recommended hero
- [ ] Include role suggestion for each recommendation
- [ ] Add "Refresh" button to get new recommendations
- [ ] Implement click handler to add recommendation to draft
- [ ] Add loading state while generating recommendations
- [ ] Create empty state when no recommendations available

### Random Recommendation Logic
- [ ] Create file app/lib/recommendations.ts
- [ ] Implement function getRandomHeroes that returns 5 random heroes
- [ ] Add logic to exclude already picked heroes from recommendations
- [ ] Create function to ensure role diversity in recommendations
- [ ] Implement weighting based on hero popularity (mock data for v1)
- [ ] Add function to get heroes for specific role
- [ ] Create balanced team composition suggester
- [ ] Implement counter-pick suggestions (random for v1)
- [ ] Add synergy suggestions (random for v1)

## Phase 8: Polish and Styling

### Dark Theme Implementation
- [ ] Update app/globals.css with dark background color
- [ ] Implement consistent text colors across all components
- [ ] Add subtle shadows using rgba black
- [ ] Create hover states with lighter backgrounds
- [ ] Implement focus states with accent color outline
- [ ] Add smooth transitions for all interactive elements
- [ ] Create loading skeletons with animated gradients
- [ ] Implement error states with red accent color

### Responsive Design
- [ ] Add mobile breakpoint styles for DraftLayout
- [ ] Implement stacked layout for teams on mobile
- [ ] Create mobile-optimized hero selection modal
- [ ] Add touch-friendly tap targets (min 44px)
- [ ] Implement swipe gestures for mobile navigation
- [ ] Create hamburger menu for mobile actions
- [ ] Add responsive font sizes using clamp()
- [ ] Test on various screen sizes (320px to 1920px)

### Animations and Transitions
- [ ] Add fade-in animation for initial page load
- [ ] Implement slide-in animation for modal opening
- [ ] Create scale animation for hero selection
- [ ] Add smooth transitions for hover states
- [ ] Implement shake animation for errors
- [ ] Create pulse animation for recommendations
- [ ] Add stagger animation for hero grid loading
- [ ] Implement smooth scroll for navigation

### Performance Optimization
- [ ] Implement React.memo for HeroPortrait component
- [ ] Add useMemo for expensive hero filtering operations
- [ ] Implement useCallback for event handlers
- [ ] Add lazy loading for hero images
- [ ] Implement code splitting for modal component
- [ ] Add service worker for offline hero data
- [ ] Optimize bundle size with dynamic imports
- [ ] Implement virtual scrolling for hero grid

## Phase 9: Testing and Error Handling

### Error Boundaries
- [ ] Create file app/components/ErrorBoundary.tsx
- [ ] Implement error boundary component with componentDidCatch
- [ ] Add fallback UI for error state
- [ ] Create error logging to console
- [ ] Add "Try Again" button to reset state
- [ ] Implement specific error messages for different error types

### Loading States
- [ ] Create file app/components/ui/LoadingSpinner.tsx
- [ ] Implement spinner component with CSS animation
- [ ] Add loading skeleton for hero grid
- [ ] Create loading state for draft slots
- [ ] Implement progressive loading for images
- [ ] Add loading indicator for API calls

### User Feedback
- [ ] Create file app/components/ui/Toast.tsx
- [ ] Implement toast notification system
- [ ] Add success message for hero selection
- [ ] Create error toast for failed API calls
- [ ] Implement warning for duplicate selections
- [ ] Add info toast for tips and hints

### Accessibility
- [ ] Add proper ARIA labels to all interactive elements
- [ ] Implement keyboard navigation for entire app
- [ ] Add focus trap for modal
- [ ] Create skip navigation links
- [ ] Implement proper heading hierarchy
- [ ] Add alt text for all hero images
- [ ] Test with screen reader
- [ ] Ensure color contrast meets WCAG AA standards

## Phase 10: Version 2 Preparation (Database and Auth)

### Supabase Setup
- [ ] Create new Supabase project
- [ ] Copy project URL and anon key to environment variables
- [ ] Install @supabase/supabase-js package
- [ ] Create file app/lib/supabase/client.ts
- [ ] Initialize Supabase client with environment variables
- [ ] Create server-side Supabase client for App Router
- [ ] Set up Row Level Security policies

### Database Schema
- [ ] Create users table with id, email, username, created_at
- [ ] Create drafts table with id, user_id, radiant_picks, dire_picks, created_at, updated_at
- [ ] Create draft_collaborators table for shared drafts
- [ ] Add foreign key constraints between tables
- [ ] Create indexes for frequently queried columns
- [ ] Set up database triggers for updated_at timestamp
- [ ] Create views for commonly accessed data combinations

### Authentication Components
- [ ] Create file app/components/auth/LoginForm.tsx
- [ ] Implement email/password login form
- [ ] Add social login buttons (Google, Discord)
- [ ] Create file app/components/auth/SignupForm.tsx
- [ ] Implement registration form with validation
- [ ] Add email verification flow
- [ ] Create file app/components/auth/ProfileMenu.tsx
- [ ] Implement user profile dropdown menu
- [ ] Add logout functionality

### Draft Persistence
- [ ] Create file app/lib/supabase/drafts.ts
- [ ] Implement saveDraft function to store draft in database
- [ ] Create loadDraft function to retrieve draft by ID
- [ ] Add updateDraft function for existing drafts
- [ ] Implement deleteDraft function
- [ ] Create getUserDrafts function to list user's drafts
- [ ] Add draft sharing functionality with unique URLs
- [ ] Implement draft versioning system

### Real-time Collaboration
- [ ] Create file app/lib/supabase/realtime.ts
- [ ] Set up Supabase real-time subscription for draft changes
- [ ] Implement presence system to show active users
- [ ] Create cursor tracking for collaborative editing
- [ ] Add optimistic updates for better UX
- [ ] Implement conflict resolution for simultaneous edits
- [ ] Create "user is typing" indicators
- [ ] Add connection status indicator

## Phase 11: Deployment to Google Cloud

### Docker Configuration
- [ ] Create Dockerfile in project root
- [ ] Configure multi-stage build for smaller image size
- [ ] Add .dockerignore file with node_modules and .git
- [ ] Create docker-compose.yml for local testing
- [ ] Add health check endpoint to Next.js app
- [ ] Configure environment variables for production

### Cloud Run Setup
- [ ] Install Google Cloud SDK locally
- [ ] Create new GCP project for Dota 2 Draft Tool
- [ ] Enable Cloud Run API in GCP console
- [ ] Enable Container Registry API
- [ ] Configure service account with appropriate permissions
- [ ] Set up billing alerts

### CI/CD Pipeline
- [ ] Create .github/workflows/deploy.yml for GitHub Actions
- [ ] Add build step to create Docker image
- [ ] Configure push to Google Container Registry
- [ ] Add deployment step to Cloud Run
- [ ] Set up environment variables in GitHub Secrets
- [ ] Add staging environment deployment
- [ ] Implement rollback strategy

### Production Configuration
- [ ] Configure custom domain in Cloud Run
- [ ] Set up SSL certificate for HTTPS
- [ ] Configure CDN for static assets
- [ ] Set up monitoring with Google Cloud Monitoring
- [ ] Configure error tracking with Sentry
- [ ] Add Google Analytics for usage tracking
- [ ] Set up backup strategy for database
- [ ] Configure rate limiting and DDoS protection

### Performance Monitoring
- [ ] Set up Lighthouse CI in deployment pipeline
- [ ] Configure Web Vitals tracking
- [ ] Add custom performance metrics
- [ ] Set up alerts for performance degradation
- [ ] Implement A/B testing framework
- [ ] Create performance budget
- [ ] Add bundle size monitoring

## Phase 12: Final Testing and Launch

### End-to-End Testing
- [ ] Test complete draft flow from start to finish
- [ ] Verify hero selection and role assignment works
- [ ] Test recommendation system functionality
- [ ] Verify responsive design on multiple devices
- [ ] Test offline functionality with service worker
- [ ] Verify error handling for API failures
- [ ] Test authentication flow (v2)
- [ ] Verify real-time collaboration (v2)

### Documentation
- [ ] Create README.md with setup instructions
- [ ] Document API endpoints and data structures
- [ ] Create user guide for draft tool features
- [ ] Document deployment process
- [ ] Add contributing guidelines
- [ ] Create architecture diagram
- [ ] Document known issues and limitations

### Launch Checklist
- [ ] Verify all environment variables are set
- [ ] Confirm database backups are configured
- [ ] Test load balancing and auto-scaling
- [ ] Verify SSL certificate is valid
- [ ] Check SEO meta tags are present
- [ ] Confirm analytics tracking is working
- [ ] Test social media sharing previews
- [ ] Create launch announcement content