'use client';

import React, { useState } from 'react';
import RoleSelector from '@/app/components/ui/RoleSelector';
import { HeroRole } from '@/app/types/hero';

export default function RoleTestPage() {
  const [role1, setRole1] = useState<HeroRole | null>(null);
  const [role2, setRole2] = useState<HeroRole | null>('Carry');
  const [role3, setRole3] = useState<HeroRole | null>(null);
  const [hoverTestRole, setHoverTestRole] = useState<HeroRole | null>(null);
  const [focusTestRole, setFocusTestRole] = useState<HeroRole | null>(null);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-textLight mb-8">Role Selector Test Page</h1>
        
        <div className="space-y-8">
          {/* Test Case 1: Empty State */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-textLight mb-4">Test Case 1: Empty State</h2>
            <div className="w-64">
              <RoleSelector 
                value={role1} 
                onChange={setRole1} 
              />
            </div>
            <p className="text-textSecondary mt-2">
              Selected: <span className="text-accentPrimary">{role1 || 'None'}</span>
            </p>
          </div>

          {/* Test Case 2: Pre-selected Value */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-textLight mb-4">Test Case 2: Pre-selected Value</h2>
            <div className="w-64">
              <RoleSelector 
                value={role2} 
                onChange={setRole2} 
              />
            </div>
            <p className="text-textSecondary mt-2">
              Selected: <span className="text-accentPrimary">{role2 || 'None'}</span>
            </p>
          </div>

          {/* Test Case 3: Disabled State */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-textLight mb-4">Test Case 3: Disabled State</h2>
            <div className="w-64">
              <RoleSelector 
                value={role3} 
                onChange={setRole3} 
                disabled={true}
              />
            </div>
            <p className="text-textSecondary mt-2">
              Selected: <span className="text-accentPrimary">{role3 || 'None'}</span>
            </p>
          </div>

          {/* Test Case 4: Multiple Selectors */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-textLight mb-4">Test Case 4: Team Composition</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((position) => {
                const [teamRole, setTeamRole] = useState<HeroRole | null>(null);
                return (
                  <div key={position} className="text-center">
                    <div className="text-textLight font-medium mb-2">Position {position}</div>
                    <RoleSelector 
                      value={teamRole} 
                      onChange={setTeamRole} 
                    />
                    <div className="text-xs text-textSecondary mt-1">
                      {teamRole || 'Unassigned'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Style Verification */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-textLight mb-4">Style Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-textLight text-sm font-medium mb-2">
                  Hover over this selector to test hover states:
                </label>
                <div className="w-64">
                  <RoleSelector 
                    value={hoverTestRole} 
                    onChange={setHoverTestRole} 
                  />
                </div>
                <p className="text-textSecondary mt-2">
                  Selected: <span className="text-accentPrimary">{hoverTestRole || 'None'}</span>
                </p>
              </div>
              <div>
                <label className="block text-textLight text-sm font-medium mb-2">
                  Click to test focus states:
                </label>
                <div className="w-64">
                  <RoleSelector 
                    value={focusTestRole} 
                    onChange={setFocusTestRole} 
                  />
                </div>
                <p className="text-textSecondary mt-2">
                  Selected: <span className="text-accentPrimary">{focusTestRole || 'None'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-textLight mb-4">Test Instructions</h2>
            <ul className="text-textSecondary space-y-2 list-disc list-inside">
              <li>Test selecting different roles in the dropdowns</li>
              <li>Verify the selected value displays correctly below each selector</li>
              <li>Try hovering over selectors to see hover effects</li>
              <li>Click on selectors to test focus states with accent color</li>
              <li>Notice the disabled selector cannot be interacted with</li>
              <li>Test keyboard navigation (Tab, Enter, Arrow keys)</li>
              <li>Verify accessibility with screen reader if available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}