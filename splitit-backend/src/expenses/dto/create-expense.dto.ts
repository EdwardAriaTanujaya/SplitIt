export class CreateExpenseDto {
  title: string;   // Expense title (Example: "KFC Lunch")
  amount: number;  // Total bill amount (Example: 150000)
  groupId: string; // Group ID where this expense is recorded
  payerId: string; // User ID of the person who paid the bill
  splits?: {       // Per-person items (who ordered what)
    userId: string;
    amount: number;
    description?: string; // What they ordered (e.g., "Chicken + Coca Cola")
  }[];
}