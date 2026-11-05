class DashboardData {
  final double availableToSpend;
  final double effectiveIncome;
  final double plannedExpenses;
  final double savingsCommitments;
  final double upcomingBills;
  final String currency;
  final List<TransactionModel> recentTransactions;
  final List<TransactionModel> monthExpenses;
  final List<BillModel> bills;
  final List<SavingsGoalModel> savingsGoals;
  final List<BudgetItemModel> budgetItems;

  DashboardData({
    required this.availableToSpend,
    required this.effectiveIncome,
    required this.plannedExpenses,
    required this.savingsCommitments,
    required this.upcomingBills,
    required this.currency,
    required this.recentTransactions,
    required this.monthExpenses,
    required this.bills,
    required this.savingsGoals,
    required this.budgetItems,
  });

  static double parseDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is num) return value.toDouble();
    if (value is String) {
      return double.tryParse(value) ?? 0.0;
    }
    return 0.0;
  }

  factory DashboardData.fromJson(Map<String, dynamic> json) {
    final txnsObj = json['transactions'] as Map<String, dynamic>?;
    final expensesList = (txnsObj?['expenses'] as List<dynamic>?)
            ?.map((t) => TransactionModel.fromJson(t as Map<String, dynamic>))
            .toList() ??
        [];

    final planObj = json['plan'] as Map<String, dynamic>?;
    final budgetItemsList = (planObj?['budgetItems'] as List<dynamic>?)
            ?.map((b) => BudgetItemModel.fromJson(b as Map<String, dynamic>))
            .toList() ??
        [];

    return DashboardData(
      availableToSpend: parseDouble(json['availableToSpend']),
      effectiveIncome: parseDouble(json['effectiveIncome'] ?? json['currentMoney']),
      plannedExpenses: parseDouble(json['plannedExpenses']),
      savingsCommitments: parseDouble(json['savingsCommitments']),
      upcomingBills: parseDouble(json['upcomingBills']),
      currency: json['currency'] as String? ?? 'NGN',
      recentTransactions: (json['recentTransactions'] as List<dynamic>?)
              ?.map((t) => TransactionModel.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
      monthExpenses: expensesList,
      bills: (json['bills'] as List<dynamic>?)
              ?.map((b) => BillModel.fromJson(b as Map<String, dynamic>))
              .toList() ??
          [],
      savingsGoals: (json['savingsGoals'] as List<dynamic>?)
              ?.map((g) => SavingsGoalModel.fromJson(g as Map<String, dynamic>))
              .toList() ??
          [],
      budgetItems: budgetItemsList,
    );
  }

  int get remainingDaysInMonth {
    final now = DateTime.now();
    final totalDays = DateTime(now.year, now.month + 1, 0).day;
    final rem = totalDays - now.day + 1;
    return rem > 0 ? rem : 1;
  }

  double get dailyBurnPace {
    if (availableToSpend <= 0) return 0.0;
    return availableToSpend / remainingDaysInMonth;
  }

  /// Total expenses logged strictly today
  double get spentToday {
    final now = DateTime.now();
    double sum = 0.0;
    for (final t in monthExpenses) {
      if (t.type == 'expense' &&
          t.date.year == now.year &&
          t.date.month == now.month &&
          t.date.day == now.day) {
        sum += t.amount;
      }
    }
    return sum;
  }

  /// Map of category -> spent amount this month
  Map<String, double> get spentByCategory {
    final Map<String, double> map = {};
    for (final t in monthExpenses) {
      if (t.type == 'expense') {
        map[t.category] = (map[t.category] ?? 0.0) + t.amount;
      }
    }
    return map;
  }
}

class BudgetItemModel {
  final String category;
  final double plannedAmount;

  BudgetItemModel({
    required this.category,
    required this.plannedAmount,
  });

  factory BudgetItemModel.fromJson(Map<String, dynamic> json) {
    return BudgetItemModel(
      category: json['category'] as String? ?? 'General',
      plannedAmount: DashboardData.parseDouble(json['plannedAmount']),
    );
  }
}

class TransactionModel {
  final String id;
  final double amount;
  final String type; // 'income' | 'expense'
  final String category;
  final DateTime date;
  final String? note;

  TransactionModel({
    required this.id,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
    this.note,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] as String? ?? '',
      amount: DashboardData.parseDouble(json['amount']),
      type: json['type'] as String? ?? 'expense',
      category: json['category'] as String? ?? 'General',
      date: DateTime.tryParse(json['date'] as String? ?? '') ?? DateTime.now(),
      note: json['note'] as String?,
    );
  }
}

class BillModel {
  final String id;
  final String name;
  final double amount;
  final DateTime dueDate;
  final String frequency;
  final bool paid;

  BillModel({
    required this.id,
    required this.name,
    required this.amount,
    required this.dueDate,
    required this.frequency,
    required this.paid,
  });

  factory BillModel.fromJson(Map<String, dynamic> json) {
    return BillModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      amount: DashboardData.parseDouble(json['amount']),
      dueDate: DateTime.tryParse(json['dueDate'] as String? ?? '') ?? DateTime.now(),
      frequency: json['frequency'] as String? ?? 'monthly',
      paid: json['paid'] as bool? ?? false,
    );
  }
}

class SavingsGoalModel {
  final String id;
  final String name;
  final double targetAmount;
  final double currentAmount;
  final DateTime? targetDate;

  SavingsGoalModel({
    required this.id,
    required this.name,
    required this.targetAmount,
    required this.currentAmount,
    this.targetDate,
  });

  factory SavingsGoalModel.fromJson(Map<String, dynamic> json) {
    return SavingsGoalModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      targetAmount: DashboardData.parseDouble(json['targetAmount']),
      currentAmount: DashboardData.parseDouble(json['currentAmount']),
      targetDate: json['targetDate'] != null ? DateTime.tryParse(json['targetDate'] as String) : null,
    );
  }

  double get progressPercentage {
    if (targetAmount <= 0) return 0.0;
    final pct = currentAmount / targetAmount;
    return pct > 1.0 ? 1.0 : pct;
  }
}
