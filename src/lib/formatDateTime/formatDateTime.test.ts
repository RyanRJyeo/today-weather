import { formatDateTime } from './formatDateTime';

const cases = [
  {
    id: 1,
    input: { dateString: '4/1/2025, 6:05:52 PM' },
    output: {
      date: '2025-04-01',
      dateTime: '2025-04-01, 6:05 PM',
      time: '6:05 PM',
    },
  },
  {
    id: 2,
    input: { dateString: '12/24/1994, 11:05:00 AM' },
    output: {
      date: '1994-12-24',
      dateTime: '1994-12-24, 11:05 AM',
      time: '11:05 AM',
    },
  },
  {
    id: 3,
    input: { dateString: '1743501914742' },
    output: {
      date: '1994-12-24',
      dateTime: '1994-12-24, 11:05 AM',
      time: '11:05 AM',
    },
  },
  {
    id: 4,
    input: {
      dateString: 'Tue Apr 01 2025 18:23:48 GMT+0800 (Singapore Standard Time)',
    },
    output: {
      date: '2025-04-01',
      dateTime: '2025-04-01, 6:23 PM',
      time: '6:23 PM',
    },
  },
];
describe('formatDateTime', () => {
  test.each(cases)('test id $id gives $output', ({ input, output }) => {
    const { dateString } = input;

    try {
      const formattedDate = formatDateTime(dateString);
      expect(formattedDate).toStrictEqual(output);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error(`Invalid date provided: ${dateString}`),
      );
    }
  });
});
