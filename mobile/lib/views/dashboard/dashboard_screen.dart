import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_providers.dart';
import '../../models/models.dart';
import '../plan/plan_screen.dart';
import '../bills_goals/bills_goals_screen.dart';
import '../activity/activity_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedIndex = 0;

  String _formatMoney(double amount, String currency) {
    final symbol = currency == 'NGN' ? '₦' : '\$';
    final formatter = NumberFormat('#,##0', 'en_US');
    return '$symbol${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    final dashboardAsync = ref.watch(dashboardProvider);

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: AppTheme.primaryBlack,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.shield_outlined, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 10),
            const Text('PocketGuard'),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Can I Afford This?',
            icon: const Icon(Icons.calculate_outlined, size: 21),
            onPressed: () {
              final data = dashboardAsync.valueOrNull;
              if (data != null) {
                _showAffordabilitySimulator(context, data);
              }
            },
          ),
          IconButton(
            tooltip: 'Refresh',
            icon: const Icon(Icons.refresh_rounded, size: 20),
            onPressed: () {
              ref.invalidate(dashboardProvider);
              ref.invalidate(allTransactionsProvider);
            },
          ),
          IconButton(
            tooltip: 'Sign out',
            icon: const Icon(Icons.logout_rounded, size: 20),
            onPressed: () => ref.read(authProvider.notifier).logout(),
          ),
        ],
      ),
      body: dashboardAsync.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.primaryBlack)),
        error: (err, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.warning_amber_rounded, size: 48, color: AppTheme.dangerRed),
                const SizedBox(height: 12),
                Text('Failed to load dashboard data', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 6),
                Text(err.toString(), textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.invalidate(dashboardProvider),
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryBlack, foregroundColor: Colors.white),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
        data: (data) {
          switch (_selectedIndex) {
            case 0:
              return _buildHomeTab(context, data);
            case 1:
              return PlanScreen(data: data);
            case 2:
              return BillsGoalsScreen(data: data);
            case 3:
              return ActivityScreen(currency: data.currency);
            default:
              return _buildHomeTab(context, data);
          }
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryBlack,
        foregroundColor: Colors.white,
        elevation: 6,
        onPressed: () => _showAddTransactionModal(context, ref),
        icon: const Icon(Icons.add_rounded, size: 20),
        label: const Text('Log Money', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5)),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppTheme.borderSubtle)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.grid_view_rounded, 'Pulse'),
                _buildNavItem(1, Icons.pie_chart_outline_rounded, 'Plan'),
                _buildNavItem(2, Icons.event_repeat_rounded, 'Bills & Goals'),
                _buildNavItem(3, Icons.receipt_long_rounded, 'Activity'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final selected = _selectedIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppTheme.positiveSoft : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: selected ? AppTheme.positiveGreen : AppTheme.textMuted,
            ),
            if (selected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.positiveGreen,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHomeTab(BuildContext context, DashboardData data) {
    return RefreshIndicator(
      color: AppTheme.primaryBlack,
      onRefresh: () async => ref.invalidate(dashboardProvider),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Dynamic Mood Safe-to-Spend Hero Card
            _buildHeroCard(context, data),

            const SizedBox(height: 16),

            // "Today's Burn vs Daily Limit" Live Meter
            _buildTodayBurnCard(context, data),

            const SizedBox(height: 16),

            // Quick Simulator Callout Card
            _buildSimulatorBanner(context, data),

            const SizedBox(height: 16),

            // 2x2 Financial Pillar Grid
            _buildStatGrid(context, data),

            const SizedBox(height: 24),

            // Recent Activity Preview
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Recent Activity',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
                ),
                GestureDetector(
                  onTap: () => setState(() => _selectedIndex = 3),
                  child: const Text(
                    'See all →',
                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppTheme.positiveGreen),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            if (data.recentTransactions.isEmpty)
              _buildEmptyBox('Tap "Log Money" below to add your first income or expense.')
            else
              ...data.recentTransactions.take(4).map((t) => _buildTransactionTile(context, t, data.currency)),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context, DashboardData data) {
    final isNegative = data.availableToSpend < 0;
    final isTight = !isNegative && data.availableToSpend < (data.effectiveIncome * 0.15);

    final Color glowColor = isNegative
        ? AppTheme.dangerRed
        : isTight
            ? AppTheme.warningAmber
            : AppTheme.positiveEmerald;

    final String statusLabel = isNegative
        ? 'OVER COMMITTED'
        : isTight
            ? 'TIGHT BUFFER'
            : 'SAFE-TO-SPEND PULSE';

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppTheme.primaryBlack,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: glowColor.withOpacity(0.18),
            blurRadius: 28,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Radial mood glow inside hero card
          Positioned(
            top: -50,
            right: -40,
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    glowColor.withOpacity(0.32),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: glowColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          statusLabel,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 11,
                            letterSpacing: 1.2,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.local_fire_department_rounded, size: 14, color: glowColor),
                          const SizedBox(width: 4),
                          Text(
                            '${_formatMoney(data.dailyBurnPace, data.currency)}/day',
                            style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Text(
                  _formatMoney(data.availableToSpend, data.currency),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 36,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -1.0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  isNegative
                      ? 'Commitments exceed inflow — review your envelopes or bills.'
                      : 'Guaranteed safe after bills, category envelopes & monthly goals.',
                  style: const TextStyle(color: Colors.white60, fontSize: 12, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTodayBurnCard(BuildContext context, DashboardData data) {
    final spentToday = data.spentToday;
    final dailyLimit = data.dailyBurnPace;
    final isZeroSpendDay = spentToday == 0;
    final pct = dailyLimit > 0 ? (spentToday / dailyLimit).clamp(0.0, 1.0) : 0.0;
    final overDaily = dailyLimit > 0 && spentToday > dailyLimit;

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: isZeroSpendDay
                          ? AppTheme.positiveSoft
                          : overDaily
                              ? AppTheme.dangerSoft
                              : AppTheme.warningSoft,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      isZeroSpendDay
                          ? Icons.celebration_rounded
                          : overDaily
                              ? Icons.trending_up_rounded
                              : Icons.today_rounded,
                      size: 16,
                      color: isZeroSpendDay
                          ? AppTheme.positiveGreen
                          : overDaily
                              ? AppTheme.dangerRed
                              : AppTheme.warningAmber,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Today's Spending Pace",
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                      ),
                      Text(
                        isZeroSpendDay
                            ? 'Zero-spend day so far! Keep it up 🌟'
                            : overDaily
                                ? 'Above daily pace by ${_formatMoney(spentToday - dailyLimit, data.currency)}'
                                : '${_formatMoney((dailyLimit - spentToday).clamp(0, double.infinity), data.currency)} left for today',
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w600,
                          color: isZeroSpendDay
                              ? AppTheme.positiveGreen
                              : overDaily
                                  ? AppTheme.dangerRed
                                  : AppTheme.textMuted,
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
                    _formatMoney(spentToday, data.currency),
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                  ),
                  Text(
                    'of ${_formatMoney(dailyLimit, data.currency)}',
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
              value: pct,
              minHeight: 6,
              backgroundColor: const Color(0xFFF3F4F6),
              color: overDaily ? AppTheme.dangerRed : AppTheme.positiveGreen,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSimulatorBanner(BuildContext context, DashboardData data) {
    return GestureDetector(
      onTap: () => _showAffordabilitySimulator(context, data),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                color: AppTheme.positiveGreen,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '"Can I Afford This?" Simulator',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF065F46)),
                  ),
                  Text(
                    'Test how a purchase impacts your daily pace before buying.',
                    style: TextStyle(fontSize: 11.5, color: Color(0xFF047857)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFF047857)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatGrid(BuildContext context, DashboardData data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildMiniStat(
                'Effective Inflow',
                _formatMoney(data.effectiveIncome, data.currency),
                Icons.south_west_rounded,
                AppTheme.positiveGreen,
                AppTheme.positiveSoft,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildMiniStat(
                'Unpaid Bills',
                _formatMoney(data.upcomingBills, data.currency),
                Icons.bolt_rounded,
                AppTheme.warningAmber,
                AppTheme.warningSoft,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildMiniStat(
                'Planned Envelopes',
                _formatMoney(data.plannedExpenses, data.currency),
                Icons.pie_chart_rounded,
                const Color(0xFF7C3AED),
                const Color(0xFFF5F3FF),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildMiniStat(
                'Monthly Goals',
                _formatMoney(data.savingsCommitments, data.currency),
                Icons.flag_rounded,
                const Color(0xFF2563EB),
                const Color(0xFFEFF6FF),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMiniStat(String label, String value, IconData icon, Color color, Color bgColor) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(7)),
                child: Icon(icon, size: 14, color: color),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 11.5, fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildTransactionTile(BuildContext context, TransactionModel t, String currency) {
    final isIncome = t.type == 'income';
    final visual = AppTheme.getCategoryVisual(t.category, isIncome: isIncome);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceCard,
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
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: visual.bgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(visual.icon, size: 18, color: visual.color),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        t.note != null && t.note!.isNotEmpty ? t.note! : t.category,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        '${t.category} · ${DateFormat('MMM dd').format(t.date)}',
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 11.5),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${isIncome ? '+' : '-'}${_formatMoney(t.amount, currency)}',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 14,
              color: isIncome ? AppTheme.positiveGreen : AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyBox(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppTheme.surfaceCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Center(
        child: Text(text, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12.5)),
      ),
    );
  }

  void _showAffordabilitySimulator(BuildContext context, DashboardData data) {
    double simulatedPrice = 0.0;
    final ctrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final newAvailable = data.availableToSpend - simulatedPrice;
            final newDailyPace = newAvailable > 0 ? newAvailable / data.remainingDaysInMonth : 0.0;
            final isSafe = newAvailable >= 0;

            return Padding(
              padding: EdgeInsets.only(
                left: 22,
                right: 22,
                top: 22,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        '"Can I Afford This?" Simulator',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                      ),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
                    ],
                  ),
                  const Text(
                    'Enter an item price to see how it affects your Safe-to-Spend & Daily Pace.',
                    style: TextStyle(fontSize: 12.5, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: ctrl,
                    autofocus: true,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) {
                      setModalState(() {
                        simulatedPrice = double.tryParse(v) ?? 0.0;
                      });
                    },
                    decoration: InputDecoration(
                      labelText: 'Purchase Amount (${data.currency})',
                      hintText: 'e.g. 25000',
                      prefixIcon: const Icon(Icons.shopping_bag_outlined),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isSafe ? AppTheme.positiveSoft : AppTheme.dangerSoft,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSafe ? const Color(0xFFA7F3D0) : const Color(0xFFFCA5A5),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isSafe ? Icons.check_circle_rounded : Icons.warning_rounded,
                              size: 18,
                              color: isSafe ? AppTheme.positiveGreen : AppTheme.dangerRed,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              isSafe ? 'Yes! You can safely afford this.' : 'Warning: Exceeds Safe-to-Spend!',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                                color: isSafe ? const Color(0xFF065F46) : AppTheme.dangerRed,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('New Safe-to-Spend:', style: TextStyle(fontSize: 12.5, color: AppTheme.textSecondary)),
                            Text(
                              _formatMoney(newAvailable, data.currency),
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('New Daily Pace:', style: TextStyle(fontSize: 12.5, color: AppTheme.textSecondary)),
                            Text(
                              '${_formatMoney(data.dailyBurnPace, data.currency)} → ${_formatMoney(newDailyPace, data.currency)}/day',
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                            ),
                          ],
                        ),
                      ],
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

  void _showAddTransactionModal(BuildContext context, WidgetRef ref) {
    final amountController = TextEditingController();
    final noteController = TextEditingController();
    String type = 'expense';
    String category = 'Food';
    bool isSaving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final categories = type == 'expense' ? AppTheme.expenseCategories : AppTheme.incomeCategories;
            if (!categories.contains(category)) {
              category = categories.first;
            }

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
                        const Text('Log Money Entry', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                        IconButton(
                          icon: const Icon(Icons.close, size: 20),
                          onPressed: isSaving ? null : () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Type Switcher
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: isSaving
                                ? null
                                : () => setModalState(() {
                                      type = 'expense';
                                      category = AppTheme.expenseCategories.first;
                                    }),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 11),
                              decoration: BoxDecoration(
                                color: type == 'expense' ? AppTheme.primaryBlack : const Color(0xFFF4F4F5),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Center(
                                child: Text(
                                  'Expense',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    color: type == 'expense' ? Colors.white : AppTheme.textPrimary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: GestureDetector(
                            onTap: isSaving
                                ? null
                                : () => setModalState(() {
                                      type = 'income';
                                      category = AppTheme.incomeCategories.first;
                                    }),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 11),
                              decoration: BoxDecoration(
                                color: type == 'income' ? AppTheme.positiveGreen : const Color(0xFFF4F4F5),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Center(
                                child: Text(
                                  'Income',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    color: type == 'income' ? Colors.white : AppTheme.textPrimary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Category Chip Grid
                    const Text('Select Category', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: categories.map((cat) {
                        final isSelected = category == cat;
                        final visual = AppTheme.getCategoryVisual(cat, isIncome: type == 'income');
                        return GestureDetector(
                          onTap: isSaving ? null : () => setModalState(() => category = cat),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSelected ? visual.color : visual.bgColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(visual.icon, size: 15, color: isSelected ? Colors.white : visual.color),
                                const SizedBox(width: 6),
                                Text(
                                  cat,
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w700,
                                    color: isSelected ? Colors.white : visual.color,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 16),

                    TextField(
                      controller: amountController,
                      enabled: !isSaving,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: InputDecoration(
                        labelText: 'Amount',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: noteController,
                      enabled: !isSaving,
                      decoration: InputDecoration(
                        labelText: 'Note or Bill Name (auto-matches unpaid bills!)',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
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
                                final amt = double.tryParse(amountController.text.trim());
                                if (amt == null || amt <= 0) return;

                                setModalState(() => isSaving = true);
                                try {
                                  final matchedBill = await ref.read(addTransactionProvider)(
                                    amount: amt,
                                    type: type,
                                    category: category,
                                    note: noteController.text.trim(),
                                  );
                                  if (context.mounted) {
                                    Navigator.pop(context);
                                    if (matchedBill != null) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('Logged & auto-reconciled bill "$matchedBill" as paid! ⚡'),
                                          backgroundColor: AppTheme.positiveGreen,
                                        ),
                                      );
                                    }
                                  }
                                } catch (_) {
                                  if (context.mounted) {
                                    setModalState(() => isSaving = false);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Could not save entry. Please try again.'),
                                        backgroundColor: AppTheme.dangerRed,
                                      ),
                                    );
                                  }
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
                                  Text('Saving...', style: TextStyle(fontWeight: FontWeight.w800)),
                                ],
                              )
                            : const Text('Save Entry', style: TextStyle(fontWeight: FontWeight.w800)),
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
