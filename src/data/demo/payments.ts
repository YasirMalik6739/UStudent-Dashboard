import type { PaymentTransaction } from '../../types';
export const demoPayments: PaymentTransaction[] = [
  { id: 'TXN-2026-0831', description: 'Semester 5 Tuition Installment', date: '2026-08-12', amount: 48500, method: 'UPI', status: 'Successful', receipt: 'RCP-0831-26' },
  { id: 'TXN-2026-0724', description: 'Student Activity Fee', date: '2026-07-24', amount: 1800, method: 'Net Banking', status: 'Successful', receipt: 'RCP-0724-26' },
  { id: 'TXN-2026-0411', description: 'Laboratory & Examination Fee', date: '2026-04-11', amount: 6200, method: 'Debit Card', status: 'Successful', receipt: 'RCP-0411-26' },
  { id: 'TXN-2025-1220', description: 'Semester 4 Tuition Installment', date: '2025-12-20', amount: 47000, method: 'UPI', status: 'Successful', receipt: 'RCP-1220-25' },
  { id: 'TXN-2025-0905', description: 'Library Deposit', date: '2025-09-05', amount: 1500, method: 'Net Banking', status: 'Successful', receipt: 'RCP-0905-25' },
];
