import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Can be overridden via --dart-define=API_BASE_URL=https://your-domain.vercel.app/api
  // Defaults to localhost on Web and your PC's Wi-Fi IP (192.168.100.25) on Android/iOS devices
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get defaultBaseUrl {
    if (_envBaseUrl.isNotEmpty) return _envBaseUrl;
    if (kIsWeb) return 'http://localhost:3000/api';
    return 'http://192.168.100.25:3000/api';
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

