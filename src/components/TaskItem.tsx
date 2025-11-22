import React from 'react';
import { Check, Calendar, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
    block: any;
    onUpdate: (updates: any) => void;
    onSelect: () => void;
    isSelected: boolean;
}

export default function TaskItem({ block, onUpdate, onSelect, isSelected }: TaskItemProps) {
    const handleCheck = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate({ checked: !block.checked, status: !block.checked ? 'Done' : 'Not started' });
    };

    return (
        <div
            className={cn(
                "group flex items-center gap-2 py-1 px-2 -mx-2 rounded hover:bg-[var(--sidebar-hover)] cursor-pointer transition-colors",
                isSelected && "bg-[var(--sidebar-hover)]"
            )}
            onClick={onSelect}
        >
            <div
                className={cn(
                    "w-5 h-5 border rounded flex items-center justify-center transition-colors",
                    block.checked
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-400 hover:bg-gray-100"
                )}
                onClick={handleCheck}
            >
                {block.checked && <Check className="w-3 h-3" />}
            </div>

            <input
                type="text"
                value={block.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className={cn(
                    "flex-1 bg-transparent outline-none text-[var(--foreground)]",
                    block.checked && "text-gray-400 line-through"
                )}
                placeholder="New task"
            />

            <div className="flex items-center gap-4 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {block.dueDate && (
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(block.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
                {block.status && (
                    <div className="flex items-center gap-1">
                        <Circle className={cn("w-2 h-2 fill-current",
                            block.status === 'Done' ? 'text-green-500' :
                                block.status === 'In progress' ? 'text-blue-500' : 'text-gray-300'
                        )} />
                        <span>{block.status}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
