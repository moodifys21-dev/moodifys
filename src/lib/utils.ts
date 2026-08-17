import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useCurrencyStore } from '@/stores/currencyStore'

/**
 * Merges Tailwind classes cleanly with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format numeric price dynamically using global currency configuration
 * Supports INR ₹, PKR Rs., USD $, EUR €, GBP £, AED د.إ, etc.
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0'
  }

  const { config } = useCurrencyStore.getState()
  const {
    currencySymbol,
    decimalPlaces,
    symbolPosition,
    thousandsSeparator,
    decimalSeparator,
  } = config

  // Format the numerical portion
  const fixed = amount.toFixed(decimalPlaces)
  const [integerPart, decimalPart] = fixed.split('.')

  // Apply thousands separator to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  // Assemble the number
  const formattedNumber = decimalPlaces > 0 && decimalPart
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger

  // Assemble with symbol position
  if (symbolPosition === 'AFTER') {
    return `${formattedNumber} ${currencySymbol}`
  }

  // Symbol before (e.g. ₹1,499 or Rs. 1,499 or $1,499.00)
  const separatorSpace = currencySymbol.length > 1 ? ' ' : ''
  return `${currencySymbol}${separatorSpace}${formattedNumber}`
}

/**
 * Backward-compatible alias for formatCurrency
 */
export function formatPrice(amount: number | undefined | null): string {
  return formatCurrency(amount)
}

/**
 * Format ISO date to clean uppercase string (e.g. 16 AUG 2026)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date).toUpperCase()
  } catch {
    return dateString
  }
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
