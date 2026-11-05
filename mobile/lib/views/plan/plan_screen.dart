import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_providers.dart';

class PlanScreen extends ConsumerStatefulWidget {
  final DashboardData data;

  const PlanScreen({super.key, required this.data});

  @override
  ConsumerState<PlanScreen> createState() => _PlanScreenState();
}

class _PlanScreenState extends ConsumerState<PlanScreen> {
  bool _isApplyingPreset = false;

  DashboardData get data => widget.data;

  String _formatMoney(double amount, String currency) {
    final symbol = currency == 'NGN' ? '₦' : '\$';
    final formatter = NumberFormat('#,##0', 'en_US');
    return '$symbol${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    final spentMap = data.spentByCategory;
    final totalPlanned = data.budgetItems.fold<double>(0, (s, b) => s + b.plannedAmount);
    final totalSpentInPlan = data.budgetItems.fold<double>(
      0,
      (s, b) => s + (spentMap[b.category] ?? 0),
    );
    final remainingInPlan = (totalPlanned - totalSpentInPlan).clamp(0.0, double.infinity);

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Summary Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF09090B), Color(0xFF18181B)],
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'MONTHLY ENVELOPES',
                      style: TextStyle(
                        color: Colors.white60,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.1,
                      ),
                    ),
                    InkWell(
                      onTap: () => _showEditPlanModal(context, ref, data),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppTheme.positiveEmerald.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.positiveEmerald.withOpacity(0.4)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 12, color: Color(0xFF34D399)),
                            SizedBox(width: 4),
                            Text(
                              'Edit Plan',
                              style: TextStyle(
                                color: Color(0xFF34D399),
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  _formatMoney(remainingInPlan, data.currency),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.8,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Remaining across ${data.budgetItems.length} envelopes · Planned ${_formatMoney(totalPlanned, data.currency)}',
                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Smart Auto-Seed Banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.positiveSoft,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppTheme.positiveGreen.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.auto_awesome_rounded, size: 18, color: AppTheme.positiveGreen),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '1-Click Smart Auto-Budget',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          color: Color(0xFF065F46),
                        ),
                      ),
                      Text(
                        'Auto-set realistic envelopes from your spending.',
                        style: TextStyle(fontSize: 11.5, color: Color(0xFF047857)),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: _isApplyingPreset ? null : () => _applySmartPreset(context, ref, data),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.positiveGreen,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: AppTheme.positiveGreen.withOpacity(0.55),
                    disabledForegroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: _isApplyingPreset
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('Apply', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          const Text(
            'Category Envelopes',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 12),

          if (data.budgetItems.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppTheme.borderSubtle),
              ),
              child: Column(
                children: [
                  const Icon(Icons.account_balance_wallet_outlined, size: 36, color: AppTheme.textMuted),
                  const SizedBox(height: 10),
                  const Text(
                    'No envelopes configured yet',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Tap "Apply" on Smart Auto-Budget above or Edit Plan to set category limits.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  ),
                ],
              ),
            )
          else
            ...data.budgetItems.map((item) {
              final spent = spentMap[item.category] ?? 0.0;
              final pct = item.plannedAmount > 0 ? (spent / item.plannedAmount) : 0.0;
              final isOver = spent > item.plannedAmount;
              final visual = AppTheme.getCategoryVisual(item.category);

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isOver ? AppTheme.dangerRed.withOpacity(0.4) : AppTheme.borderSubtle,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: visual.bgColor,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(visual.icon, size: 18, color: visual.color),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.category,
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                                ),
                                Text(
                                  isOver
                                      ? 'Over budget by ${_formatMoney(spent - item.plannedAmount, data.currency)}'
                                      : '${_formatMoney(item.plannedAmount - spent, data.currency)} left',
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w600,
                                    color: isOver ? AppTheme.dangerRed : AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              _formatMoney(spent, data.currency),
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                                color: isOver ? AppTheme.dangerRed : AppTheme.textPrimary,
                              ),
                            ),
                            Text(
                              'of ${_formatMoney(item.plannedAmount, data.currency)}',
                              style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: pct.clamp(0.0, 1.0),
                        minHeight: 7,
                        backgroundColor: const Color(0xFFF3F4F6),
                        color: isOver
                            ? AppTheme.dangerRed
                            : pct > 0.8
                                ? AppTheme.warningAmber
                                : visual.color,
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Future<void> _applySmartPreset(BuildContext context, WidgetRef ref, DashboardData data) async {
    setState(() => _isApplyingPreset = true);
    try {
      final now = DateTime.now();
      final baseIncome = data.effectiveIncome > 0 ? data.effectiveIncome : 300000.0;
      final items = [
        {'category': 'Food', 'plannedAmount': (baseIncome * 0.20).roundToDouble()},
        {'category': 'Transport', 'plannedAmount': (baseIncome * 0.10).roundToDouble()},
        {'category': 'Housing', 'plannedAmount': (baseIncome * 0.25).roundToDouble()},
        {'category': 'Bills', 'plannedAmount': (baseIncome * 0.10).roundToDouble()},
        {'category': 'Shopping', 'plannedAmount': (baseIncome * 0.08).roundToDouble()},
      ];

      await ref.read(savePlanProvider)(
        year: now.year,
        month: now.month,
        items: items,
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Smart envelopes generated and applied!'),
            backgroundColor: AppTheme.positiveGreen,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isApplyingPreset = false);
    }
  }

  void _showEditPlanModal(BuildContext context, WidgetRef ref, DashboardData data) {
    final Map<String, TextEditingController> controllers = {};
    for (final cat in AppTheme.expenseCategories) {
      final existing = data.budgetItems.where((b) => b.category == cat).firstOrNull;
      controllers[cat] = TextEditingController(
        text: existing != null && existing.plannedAmount > 0 ? existing.plannedAmount.toStringAsFixed(0) : '',
      );
    }
    bool isSaving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Configure Monthly Envelopes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: isSaving ? null : () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...AppTheme.expenseCategories.map((cat) {
                      final visual = AppTheme.getCategoryVisual(cat);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            Container(
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(color: visual.bgColor, borderRadius: BorderRadius.circular(8)),
                              child: Icon(visual.icon, size: 16, color: visual.color),
                            ),
                            const SizedBox(width: 10),
                            Expanded(child: Text(cat, style: const TextStyle(fontWeight: FontWeight.w600))),
                            SizedBox(
                              width: 130,
                              child: TextField(
                                controller: controllers[cat],
                                enabled: !isSaving,
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  hintText: '0',
                                  isDense: true,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryBlack,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: AppTheme.primaryBlack.withOpacity(0.55),
                          disabledForegroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: isSaving
                            ? null
                            : () async {
                                setModalState(() => isSaving = true);
                                try {
                                  final now = DateTime.now();
                                  final List<Map<String, dynamic>> items = [];
                                  controllers.forEach((cat, ctrl) {
                                    final val = double.tryParse(ctrl.text.trim()) ?? 0;
                                    if (val > 0) {
                                      items.add({'category': cat, 'plannedAmount': val});
                                    }
                                  });
                                  await ref.read(savePlanProvider)(year: now.year, month: now.month, items: items);
                                  if (context.mounted) Navigator.pop(context);
                                } catch (_) {
                                  if (context.mounted) setModalState(() => isSaving = false);
                                }
                              },
                        child: isSaving
                            ? const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.2),
                                  ),
                                  SizedBox(width: 10),
                                  Text('Saving Plan...', style: TextStyle(fontWeight: FontWeight.w700)),
                                ],
                              )
                            : const Text('Save Monthly Plan', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

