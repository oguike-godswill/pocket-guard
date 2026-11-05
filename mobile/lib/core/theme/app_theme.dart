import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand color palette
  static const Color primaryBlack = Color(0xFF0A0A0A);
  static const Color pureWhite = Color(0xFFFFFFFF);
  static const Color backgroundLight = Color(0xFFF8FAF9); // Subtle warm mint-tinted neutral
  static const Color surfaceCard = Color(0xFFFFFFFF);
  static const Color borderSubtle = Color(0xFFE5E7EB);

  // Semantic accents
  static const Color positiveGreen = Color(0xFF059669);
  static const Color positiveEmerald = Color(0xFF10B981);
  static const Color positiveSoft = Color(0xFFECFDF5);

  static const Color dangerRed = Color(0xFFDC2626);
  static const Color dangerSoft = Color(0xFFFEF2F2);

  static const Color warningAmber = Color(0xFFD97706);
  static const Color warningSoft = Color(0xFFFFFBEB);

  static const Color textPrimary = Color(0xFF09090B);
  static const Color textMuted = Color(0xFF71717A);
  static const Color textSecondary = Color(0xFF52525B);

  // Category Semantic Styling (Icon, Foreground Color, Background Soft Color)
  static CategoryVisual getCategoryVisual(String category, {bool isIncome = false}) {
    if (isIncome) {
      return const CategoryVisual(
        icon: Icons.south_west_rounded,
        color: Color(0xFF059669),
        bgColor: Color(0xFFECFDF5),
      );
    }

    switch (category.toLowerCase()) {
      case 'food':
      case 'dining':
      case 'groceries':
        return const CategoryVisual(
          icon: Icons.restaurant_rounded,
          color: Color(0xFFEA580C),
          bgColor: Color(0xFFFFF7ED),
        );
      case 'transport':
      case 'fuel':
      case 'transit':
        return const CategoryVisual(
          icon: Icons.directions_car_filled_rounded,
          color: Color(0xFF2563EB),
          bgColor: Color(0xFFEFF6FF),
        );
      case 'housing':
      case 'rent':
        return const CategoryVisual(
          icon: Icons.home_rounded,
          color: Color(0xFF7C3AED),
          bgColor: Color(0xFFF5F3FF),
        );
      case 'bills':
      case 'utilities':
        return const CategoryVisual(
          icon: Icons.bolt_rounded,
          color: Color(0xFFD97706),
          bgColor: Color(0xFFFFFBEB),
        );
      case 'shopping':
      case 'lifestyle':
        return const CategoryVisual(
          icon: Icons.shopping_bag_rounded,
          color: Color(0xFFDB2777),
          bgColor: Color(0xFFFDF2F8),
        );
      case 'health':
      case 'medical':
        return const CategoryVisual(
          icon: Icons.favorite_rounded,
          color: Color(0xFFE11D48),
          bgColor: Color(0xFFFFF1F2),
        );
      case 'entertainment':
        return const CategoryVisual(
          icon: Icons.movie_filter_rounded,
          color: Color(0xFF4F46E5),
          bgColor: Color(0xFFEEF2FF),
        );
      default:
        return const CategoryVisual(
          icon: Icons.receipt_long_rounded,
          color: Color(0xFF3F3F46),
          bgColor: Color(0xFFF4F4F5),
        );
    }
  }

  static const List<String> expenseCategories = [
    'Food',
    'Transport',
    'Housing',
    'Bills',
    'Shopping',
    'Health',
    'Entertainment',
    'General',
  ];

  static const List<String> incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Gift',
    'Investment',
  ];

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: backgroundLight,
    primaryColor: primaryBlack,
    cardColor: surfaceCard,
    dividerColor: borderSubtle,
    fontFamily: GoogleFonts.manrope().fontFamily,
    textTheme: GoogleFonts.manropeTextTheme().copyWith(
      displayLarge: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w800,
        letterSpacing: -1.0,
      ),
      displayMedium: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.6,
      ),
      headlineMedium: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
      ),
      titleLarge: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.3,
      ),
      titleMedium: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w500,
      ),
      bodyMedium: GoogleFonts.manrope(
        color: textSecondary,
        fontWeight: FontWeight.w500,
      ),
      labelLarge: GoogleFonts.manrope(
        color: textPrimary,
        fontWeight: FontWeight.w700,
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: pureWhite,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.manrope(
        color: textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.4,
      ),
      iconTheme: const IconThemeData(color: primaryBlack),
    ),
  );
}

class CategoryVisual {
  final IconData icon;
  final Color color;
  final Color bgColor;

  const CategoryVisual({
    required this.icon,
    required this.color,
    required this.bgColor,
  });
}
