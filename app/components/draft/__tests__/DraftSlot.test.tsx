import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DraftSlot from '../DraftSlot';
import { IDraftSlot } from '../../../types/draft';
import { IHero } from '../../../types/hero';

// Mock the child components
jest.mock('../../ui/HeroPortrait', () => {
  return function MockHeroPortrait({ hero, onClick, isSelected, size }: any) {
    return (
      <div
        data-testid={`hero-portrait-${hero?.id || 'empty'}`}
        onClick={() => onClick?.(hero)}
        className={`hero-portrait ${isSelected ? 'selected' : ''} ${size}`}
      >
        {hero?.localized_name || 'Empty Slot'}
      </div>
    );
  };
});

jest.mock('../../ui/RoleSelector', () => {
  return function MockRoleSelector({ value, onChange, disabled }: any) {
    return (
      <select
        data-testid="role-selector"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
      >
        <option value="">Select Role</option>
        <option value="Carry">Carry</option>
        <option value="Mid">Mid</option>
        <option value="Offlane">Offlane</option>
        <option value="Support">Support</option>
        <option value="Hard Support">Hard Support</option>
      </select>
    );
  };
});

const mockHero: IHero = {
  id: 1,
  name: 'npc_dota_hero_antimage',
  localized_name: 'Anti-Mage',
  primary_attr: 'agi',
  attack_type: 'Melee',
  roles: ['Carry']
};

const createMockSlot = (overrides: Partial<IDraftSlot> = {}): IDraftSlot => ({
  hero: null,
  role: null,
  team: 'radiant',
  position: null,
  ...overrides
});

describe('DraftSlot', () => {
  const defaultProps = {
    slot: createMockSlot(),
    onHeroClick: jest.fn(),
    onRoleChange: jest.fn(),
    slotIndex: 0,
    isActive: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders empty slot with position number', () => {
      render(<DraftSlot {...defaultProps} slotIndex={2} />);
      
      // Position number should be slotIndex + 1
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByTestId('role-selector')).toBeInTheDocument();
    });

    it('renders slot with hero', () => {
      const slotWithHero = createMockSlot({ hero: mockHero, role: 'Carry' });
      render(<DraftSlot {...defaultProps} slot={slotWithHero} />);
      
      expect(screen.getByTestId('hero-portrait-1')).toBeInTheDocument();
      expect(screen.getAllByText('Anti-Mage')).toHaveLength(2); // Once in mock portrait, once in component
      expect(screen.getByDisplayValue('Carry')).toBeInTheDocument();
    });

    it('displays position number from slot.position when available', () => {
      const slotWithPosition = createMockSlot({ position: 3 });
      render(<DraftSlot {...defaultProps} slot={slotWithPosition} slotIndex={0} />);
      
      // Should show slot.position (3) instead of slotIndex + 1 (1)
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('Team Color Indicators', () => {
    it('applies radiant team styling', () => {
      const radiantSlot = createMockSlot({ team: 'radiant' });
      const { container } = render(<DraftSlot {...defaultProps} slot={radiantSlot} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      expect(slotContainer).toHaveClass('bg-green-900/20');
      expect(slotContainer).toHaveClass('border-green-600');
      
      const positionIndicator = screen.getByText('1');
      expect(positionIndicator).toHaveClass('bg-green-500');
    });

    it('applies dire team styling', () => {
      const direSlot = createMockSlot({ team: 'dire' });
      const { container } = render(<DraftSlot {...defaultProps} slot={direSlot} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      expect(slotContainer).toHaveClass('bg-red-900/20');
      expect(slotContainer).toHaveClass('border-red-600');
      
      const positionIndicator = screen.getByText('1');
      expect(positionIndicator).toHaveClass('bg-red-500');
    });

    it('applies active state styling', () => {
      const { container } = render(<DraftSlot {...defaultProps} isActive={true} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      expect(slotContainer).toHaveClass('border-green-500');
      expect(slotContainer).toHaveClass('shadow-lg');
    });

    it('applies active dire state styling', () => {
      const direSlot = createMockSlot({ team: 'dire' });
      const { container } = render(<DraftSlot {...defaultProps} slot={direSlot} isActive={true} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      expect(slotContainer).toHaveClass('border-red-500');
    });
  });

  describe('User Interactions', () => {
    it('calls onHeroClick when hero portrait is clicked', async () => {
      const onHeroClick = jest.fn();
      const user = userEvent.setup();
      
      render(<DraftSlot {...defaultProps} onHeroClick={onHeroClick} />);
      
      // Click on the empty slot div (the + icon area)
      await user.click(screen.getByText('+'));
      expect(onHeroClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRoleChange when role is selected', async () => {
      const onRoleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<DraftSlot {...defaultProps} onRoleChange={onRoleChange} />);
      
      await user.selectOptions(screen.getByTestId('role-selector'), 'Carry');
      expect(onRoleChange).toHaveBeenCalledWith('Carry');
    });

    it('calls onRoleChange with null when role is cleared', async () => {
      const onRoleChange = jest.fn();
      const user = userEvent.setup();
      const slotWithRole = createMockSlot({ role: 'Carry' });
      
      render(<DraftSlot {...defaultProps} slot={slotWithRole} onRoleChange={onRoleChange} />);
      
      await user.selectOptions(screen.getByTestId('role-selector'), '');
      expect(onRoleChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Remove Hero Functionality', () => {
    it('does not show remove button when no hero is selected', () => {
      render(<DraftSlot {...defaultProps} />);
      
      expect(screen.queryByTitle('Remove hero')).not.toBeInTheDocument();
    });

    it('shows remove button on hover when hero is selected', async () => {
      const slotWithHero = createMockSlot({ hero: mockHero });
      const { container } = render(<DraftSlot {...defaultProps} slot={slotWithHero} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(slotContainer);
      
      await waitFor(() => {
        expect(screen.getByTitle('Remove hero')).toBeInTheDocument();
      });
    });

    it('calls onRoleChange with null when remove button is clicked', async () => {
      const onRoleChange = jest.fn();
      const user = userEvent.setup();
      const slotWithHero = createMockSlot({ hero: mockHero });
      const { container } = render(
        <DraftSlot {...defaultProps} slot={slotWithHero} onRoleChange={onRoleChange} />
      );
      
      const slotContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(slotContainer);
      
      await waitFor(async () => {
        const removeButton = screen.getByTitle('Remove hero');
        await user.click(removeButton);
        expect(onRoleChange).toHaveBeenCalledWith(null);
      });
    });

    it('prevents event propagation when remove button is clicked', async () => {
      const onHeroClick = jest.fn();
      const onRoleChange = jest.fn();
      const user = userEvent.setup();
      const slotWithHero = createMockSlot({ hero: mockHero });
      const { container } = render(
        <DraftSlot 
          {...defaultProps} 
          slot={slotWithHero} 
          onHeroClick={onHeroClick}
          onRoleChange={onRoleChange} 
        />
      );
      
      const slotContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(slotContainer);
      
      await waitFor(async () => {
        const removeButton = screen.getByTitle('Remove hero');
        await user.click(removeButton);
        expect(onRoleChange).toHaveBeenCalledWith(null);
        expect(onHeroClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('renders dashed border for empty slot', () => {
      render(<DraftSlot {...defaultProps} />);
      
      const emptySlot = screen.getByText('+').parentElement;
      expect(emptySlot).toHaveClass('border-dashed');
    });

    it('shows plus icon in empty slot', () => {
      render(<DraftSlot {...defaultProps} />);
      
      expect(screen.getByText('+')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper hover states', () => {
      const { container } = render(<DraftSlot {...defaultProps} />);
      
      const slotContainer = container.firstChild as HTMLElement;
      expect(slotContainer).toHaveClass('hover:scale-105');
      expect(slotContainer).toHaveClass('hover:shadow-md');
    });

    it('shows hero name when hero is selected', () => {
      const slotWithHero = createMockSlot({ hero: mockHero });
      render(<DraftSlot {...defaultProps} slot={slotWithHero} />);
      
      expect(screen.getAllByText('Anti-Mage')).toHaveLength(2); // Once in mock portrait, once in component
    });

    it('truncates long hero names', () => {
      const heroWithLongName = { ...mockHero, localized_name: 'Very Long Hero Name That Should Be Truncated' };
      const slotWithHero = createMockSlot({ hero: heroWithLongName });
      const { container } = render(<DraftSlot {...defaultProps} slot={slotWithHero} />);
      
      // Find the hero name in the component (not the mock)
      const heroNameElements = screen.getAllByText('Very Long Hero Name That Should Be Truncated');
      expect(heroNameElements).toHaveLength(2);
      
      // Check that at least one has truncate class (the real component one)
      const componentHeroName = heroNameElements.find(el => el.tagName === 'P');
      expect(componentHeroName).toHaveClass('truncate');
    });
  });

  describe('Component Props Validation', () => {
    it('handles null hero gracefully', () => {
      const slotWithNullHero = createMockSlot({ hero: null });
      
      expect(() => {
        render(<DraftSlot {...defaultProps} slot={slotWithNullHero} />);
      }).not.toThrow();
      
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('handles null role gracefully', () => {
      const slotWithNullRole = createMockSlot({ role: null });
      
      expect(() => {
        render(<DraftSlot {...defaultProps} slot={slotWithNullRole} />);
      }).not.toThrow();
      
      const roleSelector = screen.getByTestId('role-selector');
      expect(roleSelector).toHaveValue('');
    });

    it('handles different slotIndex values correctly', () => {
      render(<DraftSlot {...defaultProps} slotIndex={4} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});