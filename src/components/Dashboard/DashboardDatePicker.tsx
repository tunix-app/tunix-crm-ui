import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { DashboardDateFilter } from '@/types/dashboard';

type DashboardDatePickerProps = {
  selectedDate: DashboardDateFilter;
  onChange: (date: DashboardDateFilter) => void;
  dateError?: string | null;
};

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00');
  return !isNaN(date.getTime());
}

export function DashboardDatePicker({ selectedDate, onChange, dateError }: DashboardDatePickerProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const displayedError = dateError ?? localError;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!value) {
      setLocalError(null);
      onChange(undefined);
      return;
    }
    if (!isValidDate(value)) {
      setLocalError('Please enter a valid date.');
      return;
    }
    setLocalError(null);
    onChange(value);
  }

  function handleToday() {
    setLocalError(null);
    onChange(undefined);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={selectedDate ?? getTodayDate()}
          onChange={handleChange}
          className="w-44"
          aria-label="Filter by date"
        />
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>
      {displayedError && (
        <p className="text-sm text-red-600">{displayedError}</p>
      )}
    </div>
  );
}
