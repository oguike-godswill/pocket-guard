import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../core/network/api_client.dart';
import '../core/constants/api_endpoints.dart';
import '../models/models.dart';

// Auth State Provider
final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<bool>>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AsyncValue<bool>> {
  AuthNotifier() : super(const AsyncValue.loading()) {
    checkSession();
  }

  final _api = ApiClient();

  Future<void> checkSession() async {
    try {
      final token = await _api.getToken();
      if (token != null && token.isNotEmpty) {
        state = const AsyncValue.data(true);
      } else {
        state = const AsyncValue.data(false);
      }
    } catch (_) {
      state = const AsyncValue.data(false);
    }
  }

  String _formatDioError(DioException e) {
    if (e.response != null && e.response?.data is Map) {
      final data = e.response!.data as Map;
      if (data['fieldErrors'] is Map) {
        final fieldErrors = data['fieldErrors'] as Map;
        final List<String> messages = [];
        fieldErrors.forEach((key, value) {
          if (value is List && value.isNotEmpty) {
            messages.add(value.first.toString());
          }
        });
        if (messages.isNotEmpty) {
          return messages.join('. ');
        }
      }
      if (data['error'] != null && data['error'].toString().isNotEmpty) {
        return data['error'].toString();
      }
    }

    final code = e.response?.statusCode;
    if (code == 401) return 'Invalid email or password.';
    if (code == 409) return 'An account with this email already exists.';
    if (code == 400) return 'Please check your inputs and try again.';
    if (code == 500) return 'Server error. Please try again in a few moments.';

    if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
      return 'Request timed out. Please check your internet connection.';
    }
    if (e.type == DioExceptionType.connectionError) {
      return 'Unable to reach backend at http://localhost:3000. Ensure "npm run dev" is active.';
    }

    return 'Network request failed: ${e.message ?? 'Unknown error'}';
  }

  Future<String?> login(String email, String password) async {
    try {
      final res = await _api.dio.post(
        ApiEndpoints.login,
        data: {'email': email, 'password': password},
      );
      if (res.statusCode == 200 && res.data['token'] != null) {
        await _api.saveToken(res.data['token']);
        state = const AsyncValue.data(true);
        return null;
      }
      return res.data['error'] ?? 'Invalid email or password.';
    } on DioException catch (e) {
      return _formatDioError(e);
    } catch (e) {
      return 'An unexpected error occurred: $e';
    }
  }

  Future<String?> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final res = await _api.dio.post(
        ApiEndpoints.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
        },
      );
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data['token'] != null) {
        await _api.saveToken(res.data['token']);
        state = const AsyncValue.data(true);
        return null;
      }
      return res.data['error'] ?? 'Registration failed. Please try again.';
    } on DioException catch (e) {
      return _formatDioError(e);
    } catch (e) {
      return 'An unexpected error occurred: $e';
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
    state = const AsyncValue.data(false);
  }
}

// Dashboard Provider
final dashboardProvider = FutureProvider.autoDispose<DashboardData>((ref) async {
  final api = ApiClient();
  final res = await api.dio.get(ApiEndpoints.dashboard);
  return DashboardData.fromJson(res.data as Map<String, dynamic>);
});

// All Transactions Provider (for Activity Ledger tab)
final allTransactionsProvider = FutureProvider.autoDispose<List<TransactionModel>>((ref) async {
  final api = ApiClient();
  final res = await api.dio.get('${ApiEndpoints.transactions}?limit=100');
  final list = (res.data['transactions'] as List<dynamic>?) ?? [];
  return list.map((t) => TransactionModel.fromJson(t as Map<String, dynamic>)).toList();
});

// Reconcile/Pay Bill Action
final payBillProvider = Provider((ref) => (String billId) async {
  final api = ApiClient();
  await api.dio.post('${ApiEndpoints.bills}/$billId/pay', data: {'paid': true});
  ref.invalidate(dashboardProvider);
});

// Create Bill Action
final createBillProvider = Provider((ref) => ({
  required String name,
  required double amount,
  required DateTime dueDate,
  required String frequency,
}) async {
  final api = ApiClient();
  await api.dio.post(
    ApiEndpoints.bills,
    data: {
      'name': name,
      'amount': amount,
      'dueDate': dueDate.toIso8601String(),
      'frequency': frequency,
    },
  );
  ref.invalidate(dashboardProvider);
});

// Create Savings Goal Action
final createGoalProvider = Provider((ref) => ({
  required String name,
  required double targetAmount,
  double currentAmount = 0,
  DateTime? targetDate,
}) async {
  final api = ApiClient();
  await api.dio.post(
    ApiEndpoints.savingsGoals,
    data: {
      'name': name,
      'targetAmount': targetAmount,
      'currentAmount': currentAmount,
      if (targetDate != null) 'targetDate': targetDate.toIso8601String(),
    },
  );
  ref.invalidate(dashboardProvider);
});

// Contribute to Savings Goal Action
final contributeGoalProvider = Provider((ref) => ({
  required String goalId,
  required double amount,
}) async {
  final api = ApiClient();
  await api.dio.post(
    '${ApiEndpoints.savingsGoals}/$goalId/contribute',
    data: {'amount': amount},
  );
  ref.invalidate(dashboardProvider);
});

// Save Monthly Plan Action
final savePlanProvider = Provider((ref) => ({
  required int year,
  required int month,
  required List<Map<String, dynamic>> items,
}) async {
  final api = ApiClient();
  await api.dio.post(
    ApiEndpoints.plan,
    data: {
      'year': year,
      'month': month,
      'items': items,
    },
  );
  ref.invalidate(dashboardProvider);
});

// Quick Add Transaction (returns matchedBillName if auto-reconciled)
final addTransactionProvider = Provider((ref) => ({
  required double amount,
  required String type,
  required String category,
  String? note,
}) async {
  final api = ApiClient();
  final res = await api.dio.post(
    ApiEndpoints.transactions,
    data: {
      'amount': amount,
      'type': type,
      'category': category,
      'date': DateTime.now().toIso8601String(),
      'note': note,
    },
  );
  ref.invalidate(dashboardProvider);
  ref.invalidate(allTransactionsProvider);
  return res.data['matchedBillName'] as String?;
});
