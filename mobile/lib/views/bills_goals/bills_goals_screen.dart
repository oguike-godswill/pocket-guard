import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_providers.dart';

class BillsGoalsScreen extends ConsumerStatefulWidget {
  final DashboardData data;

  const BillsGoalsScreen({super.key, required this.data});

  @override
  ConsumerState<BillsGoalsScreen> createState() => _BillsGoalsScreenState();
}

class _BillsGoalsScreenState extends ConsumerState<BillsGoalsScreen> {
  final Set<String> _payingBillIds = {};

  DashboardData get data => widget.data;

  String _formatMoney(double amount, String currency) {
    final symbol = currency == 'NGN' ? '₦' : '\$';
    final formatter = NumberFormat('#,##0', 'en_US');
    return '$symbol${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Summary Banner
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  title: 'Unpaid Bills',
                  amount: _formatMoney(data.upcomingBills, data.currency),
                  subtitle: '${data.bills.length} due this cycle',
                  icon: Icons.bolt_rounded,
                  accent: AppTheme.warningAmber,
                  bg: AppTheme.warningSoft,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  title: 'Monthly Goal Target',
                  amount: _formatMoney(data.savingsCommitments, data.currency),
                  subtitle: '${data.savingsGoals.length} active goals',
                  icon: Icons.savings_rounded,
                  accent: AppTheme.positiveGreen,
                  bg: AppTheme.positiveSoft,
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Bills Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recurring Bills & Subscriptions',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
              ),
              TextButton.icon(
                onPressed: () => _showAddBillModal(context, ref),
                icon: const Icon(Icons.add_circle_outline, size: 16, color: AppTheme.primaryBlack),
                label: const Text('Add Bill', style: TextStyle(color: AppTheme.primaryBlack, fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 8),

          if (data.bills.isEmpty)
            _buildEmptyCard(
              icon: Icons.event_available_rounded,
              title: 'All bills settled!',
              subtitle: 'You have no unpaid bills due right now.',
            )
          else
            ...data.bills.map((b) => _buildBillCard(context, ref, b, data.currency)),

          const SizedBox(height: 28),

          // Savings Goals Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Savings Goals & Targets',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
              ),
              TextButton.icon(
                onPressed: () => _showAddGoalModal(context, ref),
                icon: const Icon(Icons.add_circle_outline, size: 16, color: AppTheme.positiveGreen),
                label: const Text('New Goal', style: TextStyle(color: AppTheme.positiveGreen, fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 8),

          if (data.savingsGoals.isEmpty)
            _buildEmptyCard(
              icon: Icons.flag_outlined,
              title: 'No savings goals yet',
              subtitle: 'Create a goal with a target date to amortize monthly savings automatically.',
            )
          else
            ...data.savingsGoals.map((g) => _buildGoalCard(context, ref, g, data.currency)),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required String amount,
    required String subtitle,
    required IconData icon,
    required Color accent,
    required Color bg,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, size: 18, color: accent),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(amount, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
        ],
      ),
    );
  }

  Widget _buildBillCard(BuildContext context, WidgetRef ref, BillModel bill, String currency) {
    final daysUntil = bill.dueDate.difference(DateTime.now()).inDays;
    final isUrgent = daysUntil <= 3;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUrgent ? AppTheme.warningAmber.withOpacity(0.5) : AppTheme.borderSubtle,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: isUrgent ? AppTheme.dangerSoft : AppTheme.warningSoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.calendar_today_rounded,
                  size: 18,
                  color: isUrgent ? AppTheme.dangerRed : AppTheme.warningAmber,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(bill.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5)),
                  const SizedBox(height: 2),
                  Text(
                    'Due ${DateFormat('MMM dd').format(bill.dueDate)} · ${bill.frequency.toUpperCase()}',
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: isUrgent ? AppTheme.dangerRed : AppTheme.textMuted,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              Text(
                _formatMoney(bill.amount, currency),
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: _payingBillIds.contains(bill.id)
                    ? null
                    : () async {
                        setState(() => _payingBillIds.add(bill.id));
                        try {
                          await ref.read(payBillProvider)(bill.id);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Marked "${bill.name}" as paid & scheduled next cycle!'),
                                backgroundColor: AppTheme.positiveGreen,
                              ),
                            );
                          }
                        } finally {
                          if (mounted) {
                            setState(() => _payingBillIds.remove(bill.id));
                          }
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.positiveSoft,
                  foregroundColor: AppTheme.positiveGreen,
                  disabledBackgroundColor: AppTheme.positiveSoft.withOpacity(0.6),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  minimumSize: Size.zero,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: _payingBillIds.contains(bill.id)
                    ? const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(color: AppTheme.positiveGreen, strokeWidth: 2),
                      )
                    : const Text('Mark Paid', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGoalCard(BuildContext context, WidgetRef ref, SavingsGoalModel goal, String currency) {
    final pct = (goal.progressPercentage * 100).round();
    final remaining = (goal.targetAmount - goal.currentAmount).clamp(0.0, double.infinity);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderSubtle),
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
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: AppTheme.positiveSoft,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.flag_rounded, size: 18, color: AppTheme.positiveGreen),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(goal.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                      Text(
                        remaining > 0
                            ? '${_formatMoney(remaining, currency)} left to target'
                            : 'Goal achieved! 🎉',
                        style: const TextStyle(fontSize: 11.5, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
              OutlinedButton.icon(
                onPressed: () => _showContributeModal(context, ref, goal, currency),
                icon: const Icon(Icons.add, size: 14),
                label: const Text('Fund', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.primaryBlack,
                  side: const BorderSide(color: AppTheme.borderSubtle),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  minimumSize: Size.zero,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${_formatMoney(goal.currentAmount, currency)} saved',
                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppTheme.positiveGreen),
              ),
              Text(
                '$pct% of ${_formatMoney(goal.targetAmount, currency)}',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: goal.progressPercentage,
              minHeight: 8,
              backgroundColor: const Color(0xFFF3F4F6),
              color: AppTheme.positiveGreen,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyCard({required IconData icon, required String title, required String subtitle}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        children: [
          Icon(icon, size: 32, color: AppTheme.textMuted),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
          const SizedBox(height: 4),
          Text(subtitle, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
        ],
      ),
    );
  }

  void _showAddBillModal(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final amountCtrl = TextEditingController();
    String frequency = 'monthly';
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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Add Recurring Bill', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    enabled: !isSaving,
                    decoration: InputDecoration(
                      labelText: 'Bill Name (e.g. Electricity, Internet)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: amountCtrl,
                    enabled: !isSaving,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Amount',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: frequency,
                    decoration: InputDecoration(
                      labelText: 'Billing Cycle',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'weekly', child: Text('Weekly')),
                      DropdownMenuItem(value: 'monthly', child: Text('Monthly')),
                      DropdownMenuItem(value: 'yearly', child: Text('Yearly')),
                    ],
                    onChanged: isSaving ? null : (v) => setModalState(() => frequency = v ?? 'monthly'),
                  ),
                  const SizedBox(height: 18),
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
                              final amt = double.tryParse(amountCtrl.text.trim()) ?? 0;
                              if (nameCtrl.text.trim().isEmpty || amt <= 0) return;

                              setModalState(() => isSaving = true);
                              try {
                                await ref.read(createBillProvider)(
                                  name: nameCtrl.text.trim(),
                                  amount: amt,
                                  dueDate: DateTime.now().add(const Duration(days: 7)),
                                  frequency: frequency,
                                );
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
                                Text('Saving...', style: TextStyle(fontWeight: FontWeight.w700)),
                              ],
                            )
                          : const Text('Save Bill', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showAddGoalModal(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final targetCtrl = TextEditingController();
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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Create Savings Goal', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    enabled: !isSaving,
                    decoration: InputDecoration(
                      labelText: 'Goal Name (e.g. Emergency Fund, New Laptop)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: targetCtrl,
                    enabled: !isSaving,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Target Amount',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.positiveGreen,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: AppTheme.positiveGreen.withOpacity(0.55),
                        disabledForegroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: isSaving
                          ? null
                          : () async {
                              final target = double.tryParse(targetCtrl.text.trim()) ?? 0;
                              if (nameCtrl.text.trim().isEmpty || target <= 0) return;

                              setModalState(() => isSaving = true);
                              try {
                                await ref.read(createGoalProvider)(
                                  name: nameCtrl.text.trim(),
                                  targetAmount: target,
                                  targetDate: DateTime.now().add(const Duration(days: 180)),
                                );
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
                                Text('Creating...', style: TextStyle(fontWeight: FontWeight.w700)),
                              ],
                            )
                          : const Text('Create Goal', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showContributeModal(BuildContext context, WidgetRef ref, SavingsGoalModel goal, String currency) {
    final amountCtrl = TextEditingController();
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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Fund "${goal.name}"', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 14),
                  TextField(
                    controller: amountCtrl,
                    enabled: !isSaving,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Contribution Amount ($currency)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.positiveGreen,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: AppTheme.positiveGreen.withOpacity(0.55),
                        disabledForegroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: isSaving
                          ? null
                          : () async {
                              final amt = double.tryParse(amountCtrl.text.trim()) ?? 0;
                              if (amt <= 0) return;

                              setModalState(() => isSaving = true);
                              try {
                                await ref.read(contributeGoalProvider)(goalId: goal.id, amount: amt);
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
                                Text('Adding Funds...', style: TextStyle(fontWeight: FontWeight.w700)),
                              ],
                            )
                          : const Text('Add Funds', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

