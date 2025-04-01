'use client';

import { useDataContext } from '@/contexts/Data/DataContext';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

const SearchHistoryList: React.FC = () => {
  const { searchHistory } = useDataContext();

  return (
    <div>
      {searchHistory?.length ? (
        <Table className="min-w-[450px]">
          <TableBody>
            {searchHistory.map((item) => {
              const { key, date } = item;

              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{date}</TableCell>
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
