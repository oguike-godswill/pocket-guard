import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_providers.dart';

class ActivityScreen extends ConsumerStatefulWidget {
  final String currency;

  const ActivityScreen({super.key, required this.currency});

  @override
  ConsumerState<ActivityScreen> createState() => _ActivityScreenState();
}

class _ActivityScreenState extends ConsumerState<ActivityScreen> {
  String _searchQuery = '';
  String _filterType = 'all'; // 'all' | 'expense' | 'income'

  String _formatMoney(double amount, String currency) {
    final symbol = currency == 'NGN' ? '₦' : '\$';
    final formatter = NumberFormat('#,##0', 'en_US');
    return '$symbol${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    final txnsAsync = ref.watch(allTransactionsProvider);

    return txnsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.primaryBlack)),
      error: (err, _) => Center(child: Text('Error loading activity: $err')),
      data: (transactions) {
        final filtered = transactions.where((t) {
          if (_filterType != 'all' && t.type != _filterType) return false;
          if (_searchQuery.isNotEmpty) {
            final q = _searchQuery.toLowerCase();
            final matchCat = t.category.toLowerCase().contains(q);
            final matchNote = (t.note ?? '').toLowerCase().contains(q);
            return matchCat || matchNote;
          }
          return true;
        }).toList();

        return SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Bar
              TextField(
                onChanged: (v) => setState(() => _searchQuery = v),
                decoration: InputDecoration(
                  hintText: 'Search category or note...',
                  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13.5),
                  prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppTheme.textMuted),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppTheme.borderSubtle),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppTheme.borderSubtle),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Filter Chips
              Row(
                children: [
                  _buildFilterPill('All Activity', 'all'),
                  const SizedBox(width: 8),
                  _buildFilterPill('Expenses', 'expense'),
                  const SizedBox(width: 8),
                  _buildFilterPill('Income', 'income'),
                ],
              ),

              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Transaction Ledger',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
                  ),
                  Text(
                    '${filtered.length} entries',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (filtered.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderSubtle),
                  ),
                  child: const Center(
                    child: Text('No matching transactions found.', style: TextStyle(color: AppTheme.textMuted)),
                  ),
                )
              else
                ...filtered.map((t) => _buildTransactionRow(t)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilterPill(String label, String value) {
    final active = _filterType == value;
    return GestureDetector(
      onTap: () => setState(() => _filterType = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppTheme.primaryBlack : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: active ? AppTheme.primaryBlack : AppTheme.borderSubtle),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: active ? Colors.white : AppTheme.textPrimary,
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionRow(TransactionModel t) {
    final isIncome = t.type == 'income';
    final visual = AppTheme.getCategoryVisual(t.category, isIncome: isIncome);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: visual.bgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(visual.icon, size: 20, color: visual.color),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        t.note != null && t.note!.isNotEmpty ? t.note! : t.category,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${t.category} · ${DateFormat('MMM dd, yyyy').format(t.date)}',
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 11.5),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${isIncome ? '+' : '-'}${_formatMoney(t.amount, widget.currency)}',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 14.5,
              color: isIncome ? AppTheme.positiveGreen : AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

