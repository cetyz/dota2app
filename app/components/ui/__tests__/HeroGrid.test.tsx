import { render, screen, fireEvent } from '@testing-library/react';
import HeroGrid from '../HeroGrid';
import { IHero } from '../../../types/hero';

// Mock HeroPortrait component
jest.mock('../HeroPortrait', () => {
  return function MockHeroPortrait({ hero, onClick, isSelected, disabled }: any) {
    return (
      <div
        data-testid={`hero-portrait-${hero?.id || 'empty'}`}
        onClick={() => onClick?.(hero)}
        className={`hero-portrait ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      >
        {hero?.localized_name || 'Empty'}
      </div>
    );
  };
});

const mockHeroes: IHero[] = [
  {
    id: 1,
    name: 'npc_dota_hero_antimage',
    localized_name: 'Anti-Mage',
    primary_attr: 'agi',
    attack_type: 'Melee',
    roles: ['Carry']
  },
  {
    id: 2,
    name: 'npc_dota_hero_axe',
    localized_name: 'Axe',
    primary_attr: 'str',
    attack_type: 'Melee',
    roles: ['Initiator']
  },
  {
    id: 3,
    name: 'npc_dota_hero_bane',
    localized_name: 'Bane',
    primary_attr: 'int',
    attack_type: 'Ranged',
    roles: ['Support', 'Disabler']
  },
  {
    id: 4,
    name: 'npc_dota_hero_arc_warden',
    localized_name: 'Arc Warden',
    primary_attr: 'all',
    attack_type: 'Ranged',
    roles: ['Carry', 'Escape']
  }
];

describe('HeroGrid', () => {
  const defaultProps = {
    heroes: mockHeroes,
    onHeroSelect: jest.fn(),
    selectedHeroes: [],
    bannedHeroes: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heroes in a grid layout', () => {
    render(<HeroGrid {...defaultProps} />);
    
    expect(screen.getByTestId('hero-portrait-1')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-2')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-3')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-4')).toBeInTheDocument();
  });

  it('calls onHeroSelect when a hero is clicked', () => {
    const onHeroSelect = jest.fn();
    render(<HeroGrid {...defaultProps} onHeroSelect={onHeroSelect} />);
    
    fireEvent.click(screen.getByTestId('hero-portrait-1'));
    expect(onHeroSelect).toHaveBeenCalledWith(mockHeroes[0]);
  });

  it('shows selected heroes with visual indicator', () => {
    render(<HeroGrid {...defaultProps} selectedHeroes={[mockHeroes[0]]} />);
    
    const selectedHero = screen.getByTestId('hero-portrait-1');
    expect(selectedHero).toHaveClass('selected');
  });

  it('shows banned heroes as disabled', () => {
    render(<HeroGrid {...defaultProps} bannedHeroes={[mockHeroes[1]]} />);
    
    const bannedHero = screen.getByTestId('hero-portrait-2');
    expect(bannedHero).toHaveClass('disabled');
  });

  it('renders attribute filter buttons', () => {
    render(<HeroGrid {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /strength/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agility/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /intelligence/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /universal/i })).toBeInTheDocument();
  });

  it('renders role filter chips', () => {
    render(<HeroGrid {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /carry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /support/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /initiator/i })).toBeInTheDocument();
  });

  it('renders Show All button', () => {
    render(<HeroGrid {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
  });

  it('filters heroes by attribute when filter button is clicked', () => {
    render(<HeroGrid {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /agility/i }));
    
    // Should show only agility hero (Anti-Mage)
    expect(screen.getByTestId('hero-portrait-1')).toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-4')).not.toBeInTheDocument();
  });

  it('filters universal heroes correctly', () => {
    render(<HeroGrid {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /universal/i }));
    
    // Should show only universal hero (Arc Warden)
    expect(screen.queryByTestId('hero-portrait-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-3')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-4')).toBeInTheDocument();
  });

  it('filters heroes by role when role chip is clicked', () => {
    render(<HeroGrid {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /carry/i }));
    
    // Should show carry heroes (Anti-Mage and Arc Warden)
    expect(screen.getByTestId('hero-portrait-1')).toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-portrait-3')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-4')).toBeInTheDocument();
  });

  it('clears filters when Show All button is clicked', () => {
    render(<HeroGrid {...defaultProps} />);
    
    // Apply a filter first
    fireEvent.click(screen.getByRole('button', { name: /agility/i }));
    expect(screen.queryByTestId('hero-portrait-2')).not.toBeInTheDocument();
    
    // Clear filter
    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(screen.getByTestId('hero-portrait-1')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-2')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-3')).toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-4')).toBeInTheDocument();
  });
});