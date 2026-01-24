/**
 * Slug Generator - Test Suite
 * 
 * Run this file to test slug generation functionality
 * Usage: node backend/utils/testSlugGenerator.js
 */

const { generateSlug, isValidSlug, generateUniqueSlug } = require('./slugGenerator');

console.log('🧪 Testing Slug Generation\n');

// Test 1: Basic slug generation
console.log('Test 1: Basic Slug Generation');
console.log('================================');
const testCases = [
  { input: 'Anika Sharma', expected: 'anika-sharma' },
  { input: 'John Doe', expected: 'john-doe' },
  { input: "John's Hub!", expected: 'johns-hub' },
  { input: 'User_Name#123', expected: 'user-name-123' },
  { input: '  Spaces  Around  ', expected: 'spaces-around' },
  { input: 'UPPERCASE', expected: 'uppercase' },
  { input: 'Multiple---Hyphens', expected: 'multiple-hyphens' },
  { input: 'Special@#$Characters!', expected: 'specialcharacters' }
];

testCases.forEach(({ input, expected }) => {
  const result = generateSlug(input);
  const pass = result === expected;
  console.log(`${pass ? '✅' : '❌'} "${input}" → "${result}" ${pass ? '' : `(expected: "${expected}")`}`);
});

// Test 2: Slug validation
console.log('\n\nTest 2: Slug Validation');
console.log('================================');
const validSlugs = [
  'anika-sharma',
  'john-doe-123',
  'user-name',
  'hello-world-2024',
  'a',
  'my-awesome-hub'
];

const invalidSlugs = [
  'Anika-Sharma',  // uppercase
  'anika_sharma',  // underscores
  'anika sharma',  // spaces
  'anika@sharma',  // special chars
  '-anika',        // leading hyphen
  'anika-',        // trailing hyphen
  'anika--sharma'  // double hyphen
];

console.log('Valid slugs:');
validSlugs.forEach(slug => {
  const result = isValidSlug(slug);
  console.log(`${result ? '✅' : '❌'} "${slug}"`);
});

console.log('\nInvalid slugs:');
invalidSlugs.forEach(slug => {
  const result = isValidSlug(slug);
  console.log(`${!result ? '✅' : '❌'} "${slug}" (should be invalid)`);
});

// Test 3: Edge cases
console.log('\n\nTest 3: Edge Cases');
console.log('================================');
try {
  generateSlug('');
  console.log('❌ Empty string should throw error');
} catch (err) {
  console.log('✅ Empty string correctly throws error:', err.message);
}

try {
  generateSlug(null);
  console.log('❌ Null should throw error');
} catch (err) {
  console.log('✅ Null correctly throws error:', err.message);
}

try {
  generateSlug(123);
  console.log('❌ Number should throw error');
} catch (err) {
  console.log('✅ Number correctly throws error:', err.message);
}

console.log('\n\n✨ Basic tests complete!');
console.log('📝 Note: Database-dependent tests (generateUniqueSlug, slugExists) require MongoDB connection.');
console.log('   Test those by signing up new users through the API.\n');
