import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Can be overridden via --dart-define=API_BASE_URL=...
  // Defaults directly to your live production Vercel backend so Android works out-of-the-box anywhere!
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get defaultBaseUrl {
    if (_envBaseUrl.isNotEmpty) return _envBaseUrl;
    if (kIsWeb) return 'http://localhost:3000/api';
    return 'https://pocket-guard-psi.vercel.app/api';
  }

  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String user = '/user';

  // Core Money APIs
  static const String dashboard = '/dashboard';
  static const String transactions = '/transactions';
  static const String bills = '/bills';
  static const String savingsGoals = '/savings-goals';
  static const String plan = '/plan';
  static const String incomeSources = '/income-sources';
}

