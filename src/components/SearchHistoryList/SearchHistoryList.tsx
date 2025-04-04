'use client';

import { useDataContext } from '@/contexts/Data';
import { Search, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

const SearchHistoryList: React.FC = () => {
  const { searchHistory, setSearchValues, removeSearch } = useDataContext();

  return (
    <div>
      {searchHistory?.length ? (
        <Table className="min-w-[346px]">
          <TableBody>
            {searchHistory.map((item, index) => {
              const { key, time, city, country } = item;

              return (
                <TableRow key={key}>
                  <TableCell>
                    {index + 1}. {key}
                  </TableCell>
                  <TableCell>
                    <span className="flex gap-2 items-center justify-end">
                      {time}
                      <Button
                        aria-label={`search-${key}`}
                        size="icon"
                        onClick={() => setSearchValues?.({ city, country })}
                      >
                        <Search />
                      </Button>
                      <Button
                        aria-label={`delete-${key}`}
                        variant="secondary"
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
        <div className="text-center text-muted-foreground">No Record</div>
      )}
    </div>
  );
};

export default SearchHistoryList;
