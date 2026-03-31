export class CreateExpenseDto {
  title: string;   // Expense title (Example: "KFC Bucket for 2")
  amount: number;  // Amount in cents or smallest currency unit (Example: 250000)
  groupId: string; // Group ID where this expense is recorded
  payerId: string; // User ID of the person who paid first
}