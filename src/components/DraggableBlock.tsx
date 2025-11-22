"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableBlockProps {
    id: string;
    children: React.ReactNode;
}

export default function DraggableBlock({ id, children }: DraggableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group flex items-start -ml-8 pl-8 relative">
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-1 p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-gray-200 dark:hover:bg-[#2c2c2c] rounded transition-opacity"
                contentEditable={false}
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Block Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
