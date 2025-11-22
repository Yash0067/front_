"use client";

import React, { useState } from 'react';
import { ChevronDown, X, Plus, User, Calendar, ListChecks } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    icon: React.ReactNode;
    type: 'text' | 'select' | 'date';
    options?: string[];
}

interface ActiveFilter {
    id: string;
    label: string;
    value: string;
}

interface AdvancedFilterProps {
    onFilterChange: (filters: Record<string, string>) => void;
    filterOptions: FilterOption[];
}

export default function AdvancedFilter({ onFilterChange, filterOptions }: AdvancedFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const addFilter = (option: FilterOption) => {
        const newFilter: ActiveFilter = {
            id: option.id,
            label: option.label,
            value: '',
        };
        setActiveFilters([...activeFilters, newFilter]);
        setIsOpen(false);
    };

    const updateFilter = (index: number, value: string) => {
        const updated = [...activeFilters];
        updated[index].value = value;
        setActiveFilters(updated);

        // Convert to object and notify parent
        const filterObj: Record<string, string> = {};
        updated.forEach(f => {
            if (f.value) filterObj[f.id] = f.value;
        });
        onFilterChange(filterObj);
    };

    const removeFilter = (index: number) => {
        const updated = activeFilters.filter((_, i) => i !== index);
        setActiveFilters(updated);

        const filterObj: Record<string, string> = {};
        updated.forEach(f => {
            if (f.value) filterObj[f.id] = f.value;
        });
        onFilterChange(filterObj);
    };

    const availableOptions = filterOptions.filter(
        opt => !activeFilters.some(f => f.id === opt.id)
    );

    return (
        <div className="relative">
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((filter, index) => {
                    const option = filterOptions.find(o => o.id === filter.id);
                    if (!option) return null;

                    return (
                        <div key={index} className="flex items-center gap-2 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-lg px-3 py-2">
                            <span className="text-sm font-medium">{filter.label}:</span>
                            {option.type === 'text' && (
                                <input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => updateFilter(index, e.target.value)}
                                    placeholder="Enter value..."
                                    className="bg-transparent outline-none text-sm w-32"
                                />
                            )}
                            {option.type === 'select' && (
                                <select
                                    value={filter.value}
                                    onChange={(e) => updateFilter(index, e.target.value)}
                                    className="bg-transparent outline-none text-sm"
                                >
                                    <option value="">Select...</option>
                                    {option.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                            {option.type === 'date' && (
                                <input
                                    type="date"
                                    value={filter.value}
                                    onChange={(e) => updateFilter(index, e.target.value)}
                                    className="bg-transparent outline-none text-sm"
                                />
                            )}
                            <button
                                onClick={() => removeFilter(index)}
                                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}

                {/* Add Filter Button */}
                {availableOptions.length > 0 && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--border)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-500"
                    >
                        <Plus className="w-4 h-4" />
                        Add filter
                    </button>
                )}
            </div>

            {/* Filter Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#202020] border border-[var(--border)] rounded-xl shadow-xl z-20 overflow-hidden">
                        <div className="p-3 border-b border-[var(--border)]">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filter by..."
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none text-sm"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {availableOptions
                                .filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => addFilter(option)}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                    >
                                        <span className="text-gray-500">{option.icon}</span>
                                        <span className="text-sm">{option.label}</span>
                                    </button>
                                ))}
                        </div>
                        <div className="p-3 border-t border-[var(--border)]">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
                                <Plus className="w-4 h-4" />
                                Add advanced filter
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
