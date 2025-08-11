import { render, screen, fireEvent } from '@testing-library/react';
import HeroSelectionModal from '../HeroSelectionModal';
import { IHero } from '../../../types/hero';

// Mock child components
jest.mock('../../ui/HeroSearchInput', () => {
  return function MockHeroSearchInput({ value, onChange, placeholder }: any) {
    return (
      <input
        data-testid="hero-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

jest.mock('../../ui/HeroGrid', () => {
  return function MockHeroGrid({ heroes, onHeroSelect, selectedHeroes, bannedHeroes }: any) {
    return (
      <div data-testid="hero-grid">
        {heroes.map((hero: IHero) => (
          <button
            key={hero.id}
            data-testid={`hero-${hero.id}`}
            onClick={() => onHeroSelect(hero)}
            className={selectedHeroes.includes(hero) ? 'selected' : ''}
            disabled={bannedHeroes.includes(hero)}
          >
            {hero.localized_name}
          </button>
        ))}
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
  }
];

describe('HeroSelectionModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSelectHero: jest.fn(),
    excludedHeroes: [],
    bannedHeroes: [],
    heroes: mockHeroes,
    targetTeam: 'my' as const,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<HeroSelectionModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Select Hero for Your Team')).toBeInTheDocument();
  });

  it('displays correct title for my team', () => {
    render(<HeroSelectionModal {...defaultProps} targetTeam="my" />);
    
    expect(screen.getByText('Select Hero for Your Team')).toBeInTheDocument();
  });

  it('displays correct title for enemy team', () => {
    render(<HeroSelectionModal {...defaultProps} targetTeam="enemy" />);
    
    expect(screen.getByText('Select Enemy Hero')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<HeroSelectionModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<HeroSelectionModal {...defaultProps} />);
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<HeroSelectionModal {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders hero search input', () => {
    render(<HeroSelectionModal {...defaultProps} />);
    
    expect(screen.getByTestId('hero-search-input')).toBeInTheDocument();
  });

  it('renders hero grid with heroes', () => {
    render(<HeroSelectionModal {...defaultProps} />);
    
    expect(screen.getByTestId('hero-grid')).toBeInTheDocument();
    expect(screen.getByTestId('hero-1')).toBeInTheDocument();
    expect(screen.getByTestId('hero-2')).toBeInTheDocument();
    expect(screen.getByTestId('hero-3')).toBeInTheDocument();
  });

  it('calls onSelectHero when hero is selected from grid', () => {
    const onSelectHero = jest.fn();
    render(<HeroSelectionModal {...defaultProps} onSelectHero={onSelectHero} />);
    
    fireEvent.click(screen.getByTestId('hero-1'));
    expect(onSelectHero).toHaveBeenCalledWith(mockHeroes[0]);
  });

  it('filters heroes based on search input', () => {
    render(<HeroSelectionModal {...defaultProps} />);
    
    const searchInput = screen.getByTestId('hero-search-input');
    fireEvent.change(searchInput, { target: { value: 'Anti' } });
    
    // This test will pass once we implement the filtering logic
  });

  it('excludes already selected heroes from display', () => {
    render(<HeroSelectionModal {...defaultProps} excludedHeroes={[mockHeroes[0]]} />);
    
    expect(screen.queryByTestId('hero-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-2')).toBeInTheDocument();
  });

  it('shows banned heroes as disabled', () => {
    render(<HeroSelectionModal {...defaultProps} bannedHeroes={[mockHeroes[1]]} />);
    
    const bannedHero = screen.getByTestId('hero-2');
    expect(bannedHero).toBeDisabled();
  });

  it('closes modal on Escape key press', () => {
    const onClose = jest.fn();
    render(<HeroSelectionModal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes modal when clicking outside modal content', () => {
    const onClose = jest.fn();
    render(<HeroSelectionModal {...defaultProps} onClose={onClose} />);
    
    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<HeroSelectionModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});