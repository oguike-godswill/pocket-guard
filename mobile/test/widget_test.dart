import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pocket_guard_mobile/main.dart';

void main() {
  testWidgets('PocketGuardApp builds smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: PocketGuardApp(),
      ),
    );
  });
}
