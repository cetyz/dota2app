import React from 'react';
import { HeroRole } from '@/app/types/hero';

interface RoleSelectorProps {
  value: HeroRole | null;
  onChange: (role: HeroRole | null) => void;
  disabled?: boolean;
}

const ROLES: HeroRole[] = ['Carry', 'Mid', 'Offlane', 'Support', 'Hard Support'];

export default function RoleSelector({ value, onChange, disabled = false }: RoleSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue === '' ? null : selectedValue as HeroRole);
  };

  return (
    <select
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
      aria-label="Select hero role"
      className={`
        w-full px-3 py-2 rounded-lg border text-sm font-medium
        bg-background text-textLight border-gray-600
        focus:outline-none focus:ring-2 focus:ring-accentPrimary focus:border-accentPrimary
        hover:border-accentPrimary hover:bg-gray-800
        transition-colors duration-200
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500' 
          : 'cursor-pointer'
        }
      `}
    >
      <option value="" disabled className="text-gray-500">
        Select Role
      </option>
      {ROLES.map((role) => (
        <option key={role} value={role} className="bg-background text-textLight">
          {role}
        </option>
      ))}
    </select>
  );
}