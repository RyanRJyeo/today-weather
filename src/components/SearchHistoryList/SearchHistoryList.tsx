'use client';

import { useDataContext } from '@/contexts/Data/DataContext';
import { Search, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

const SearchHistoryList: React.FC = () => {
  const { searchHistory, removeSearch } = useDataContext();

  return (
    <div>
      {searchHistory?.length ? (
        <Table className="min-w-[346px]">
          <TableBody>
            {searchHistory.map((item) => {
              const { key, time } = item;

              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>
                    <span className="flex gap-2 items-center justify-end">
                      {time}
                      <Button variant="outline" size="icon">
                        <Search />
                      </Button>
                      <Button
                        aria-label={`delete-${key}`}
                        variant="outline"
                        size="icon"
                        onClick={() => removeSearch?.(key)}
                      >
                        <Trash2 />
                      </Button>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div>No Record</div>
      )}
    </div>
  );
};

export default SearchHistoryList;
