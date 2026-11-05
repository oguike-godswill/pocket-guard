import 'package:flutter/material.dart';

class PocketGuardLogo extends StatelessWidget {
  final double size;
  final double borderRadius;
  final bool showGlow;

  const PocketGuardLogo({
    super.key,
    this.size = 40,
    this.borderRadius = 12,
    this.showGlow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: const Color(0xFF09090B),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: showGlow
            ? [
                BoxShadow(
                  color: const Color(0xFF10B981).withOpacity(0.28),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Center(
        child: CustomPaint(
          size: Size(size * 0.58, size * 0.58),
          painter: _PocketGuardMarkPainter(),
        ),
      ),
    );
  }
}

class _PocketGuardMarkPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Draws the exact 24x24 PocketGuard logo mark from src/components/logo.tsx
    final scaleX = size.width / 24.0;
    final scaleY = size.height / 24.0;

    final whiteStroke = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.1 * scaleX
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final emeraldAccent = Paint()
      ..color = const Color(0xFF34D399)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.1 * scaleX
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // <rect x="2" y="9" width="20" height="12" rx="2" />
    final rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(2 * scaleX, 9 * scaleY, 20 * scaleX, 12 * scaleY),
      Radius.circular(2.2 * scaleX),
    );
    canvas.drawRRect(rect, whiteStroke);

    // <path d="M12 6v-2" /> and <path d="M12 20v-2" />
    canvas.drawLine(Offset(12 * scaleX, 6 * scaleY), Offset(12 * scaleX, 4 * scaleY), emeraldAccent);
    canvas.drawLine(Offset(12 * scaleX, 20 * scaleY), Offset(12 * scaleX, 18 * scaleY), emeraldAccent);

    // Currency S-curve (starts top-right, curves left at top, crosses center to right, curves left at bottom)
    final sPath = Path()
      ..moveTo(15.8 * scaleX, 7.5 * scaleY)
      ..cubicTo(15.8 * scaleX, 4.8 * scaleY, 14.0 * scaleX, 4.0 * scaleY, 12.0 * scaleX, 4.0 * scaleY)
      ..cubicTo(9.8 * scaleX, 4.0 * scaleY, 8.2 * scaleX, 5.2 * scaleY, 8.2 * scaleX, 7.4 * scaleY)
      ..cubicTo(8.2 * scaleX, 9.4 * scaleY, 9.8 * scaleX, 10.3 * scaleY, 12.0 * scaleX, 10.8 * scaleY)
      ..cubicTo(14.5 * scaleX, 11.4 * scaleY, 15.8 * scaleX, 12.4 * scaleY, 15.8 * scaleX, 14.4 * scaleY)
      ..cubicTo(15.8 * scaleX, 16.5 * scaleY, 14.2 * scaleX, 17.5 * scaleY, 12.0 * scaleX, 17.5 * scaleY)
      ..cubicTo(9.8 * scaleX, 17.5 * scaleY, 8.2 * scaleX, 16.2 * scaleY, 8.2 * scaleX, 14.0 * scaleY);

    canvas.drawPath(sPath, emeraldAccent);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
