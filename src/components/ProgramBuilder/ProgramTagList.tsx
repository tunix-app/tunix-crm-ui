import React from 'react';
import { Badge } from '@/components/ui/badge';

type ProgramTagListProps = {
  tags: string[];
  size?: 'sm' | 'default';
};

export function ProgramTagList({ tags, size = 'default' }: ProgramTagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs'}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
