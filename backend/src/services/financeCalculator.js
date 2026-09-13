/**
 * Menghitung rincian keuangan 2 orang, split bill, dan settlement
 */
function calculateFinanceSummary(expenses = [], settings = {}) {
  const p1Name = settings.p1Name || 'Orang 1';
  const p2Name = settings.p2Name || 'Orang 2';

  let totalAllExpenses = 0;
  let totalUnsettled = 0;
  let totalSettled = 0;

  let paidByP1Total = 0;
  let paidByP2Total = 0;

  let activePaidByP1 = 0;
  let activePaidByP2 = 0;

  let activeShareP1 = 0;
  let activeShareP2 = 0;

  const categoryTotals = {};

  expenses.forEach(exp => {
    const amount = Number(exp.amount) || 0;
    totalAllExpenses += amount;

    // Category aggregation
    const cat = exp.category || 'Lainnya';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;

    // Split calculations
    let p1Share = 0;
    let p2Share = 0;

    if (exp.splitType === '50-50') {
      p1Share = amount / 2;
      p2Share = amount / 2;
    } else if (exp.splitType === '100-p1') {
      p1Share = amount;
      p2Share = 0;
    } else if (exp.splitType === '100-p2') {
      p1Share = 0;
      p2Share = amount;
    } else if (exp.splitType === 'custom') {
      p1Share = Number(exp.splitP1) || 0;
      p2Share = Number(exp.splitP2) || (amount - p1Share);
    } else {
      p1Share = amount / 2;
      p2Share = amount / 2;
    }

    if (exp.paidBy === 'p1') {
      paidByP1Total += amount;
      if (!exp.isSettled) activePaidByP1 += amount;
    } else if (exp.paidBy === 'p2') {
      paidByP2Total += amount;
      if (!exp.isSettled) activePaidByP2 += amount;
    }

    if (exp.isSettled) {
      totalSettled += amount;
    } else {
      totalUnsettled += amount;
      activeShareP1 += p1Share;
      activeShareP2 += p2Share;
    }
  });

  // Net Balance for Active (Unsettled) Expenses:
  // Net P1 = (Paid by P1) - (P1's fair share)
  // Net P2 = (Paid by P2) - (P2's fair share)
  const netP1 = activePaidByP1 - activeShareP1;
  const netP2 = activePaidByP2 - activeShareP2;

  let settlement = {
    isBalanced: Math.abs(netP1) < 1,
    debtor: null,      // Who owes
    debtorName: '',
    creditor: null,    // Who is owed
    creditorName: '',
    amount: 0,
    message: 'Semua pengeluaran aktif sudah impas / seimbang!'
  };

  if (netP1 > 0.5) {
    // P1 paid more than their share -> P2 owes P1
    settlement = {
      isBalanced: false,
      debtor: 'p2',
      debtorName: p2Name,
      creditor: 'p1',
      creditorName: p1Name,
      amount: Math.round(netP1),
      message: `${p2Name} perlu mentransfer Rp ${Math.round(netP1).toLocaleString('id-ID')} ke ${p1Name}`
    };
  } else if (netP2 > 0.5) {
    // P2 paid more than their share -> P1 owes P2
    settlement = {
      isBalanced: false,
      debtor: 'p1',
      debtorName: p1Name,
      creditor: 'p2',
      creditorName: p2Name,
      amount: Math.round(netP2),
      message: `${p1Name} perlu mentransfer Rp ${Math.round(netP2).toLocaleString('id-ID')} ke ${p2Name}`
    };
  }

  // Format category array for charts
  const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  return {
    totalAllExpenses,
    totalUnsettled,
    totalSettled,
    paidByP1Total,
    paidByP2Total,
    activePaidByP1,
    activePaidByP2,
    activeShareP1,
    activeShareP2,
    netP1,
    netP2,
    settlement,
    categoryChartData
  };
}

module.exports = { calculateFinanceSummary };
