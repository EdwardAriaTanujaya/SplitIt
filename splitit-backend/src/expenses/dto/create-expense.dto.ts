export class CreateExpenseDto {
  title: string;   // Nama tagihannya (Contoh: "Ayam KFC 2 Bucket")
  amount: number;  // Nominal harganya (Contoh: 250000)
  groupId: string; // ID Grup tempat tagihan ini dicatat
  payerId: string; // ID User yang nalangin/bayar duluan
}