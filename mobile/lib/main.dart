import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'providers/app_providers.dart';
import 'views/auth/login_screen.dart';
import 'views/dashboard/dashboard_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: PocketGuardApp(),
    ),
  );
}

class PocketGuardApp extends ConsumerWidget {
  const PocketGuardApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      title: 'PocketGuard',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: authState.when(
        data: (isAuthenticated) {
          if (isAuthenticated) {
            return const DashboardScreen();
          }
          return const LoginScreen();
        },
        loading: () => const Scaffold(
          body: Center(
            child: CircularProgressIndicator(color: AppTheme.primaryBlack),
          ),
        ),
        error: (_, __) => const LoginScreen(),
      ),
    );
  }
}

