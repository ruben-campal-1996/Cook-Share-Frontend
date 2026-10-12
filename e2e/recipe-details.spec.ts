import { expect, test } from '@playwright/test';

test('shows the categories that belong to the recipe', async ({ page }) => {
  await page.route('**/api/v1/recipes/7', (route) =>
    route.fulfill({
      json: {
        id: 7,
        name: 'Tortilla',
        description: 'Una tortilla casera.',
        instructions: 'Cocinar y servir.',
        imageUrl: null,
        servings: 4,
        categoryIds: [1, 2],
        authorId: 1,
        statusId: 1,
        totalCalories: 800,
        caloriesPerServing: 200,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        status: 'PUBLISHED',
        publishedAt: '2026-01-01T00:00:00Z',
        reviewedAt: null,
        reviewedBy: null,
      },
    }),
  );
  await page.route('**/api/v1/categories', (route) =>
    route.fulfill({
      json: [
        { id: 1, name: 'Comida casera' },
        { id: 2, name: 'Platos principales' },
        { id: 3, name: 'Postres' },
      ],
    }),
  );

  await page.goto('/recipe-details/7');

  await expect(page.getByRole('heading', { name: 'Tortilla' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Categorías' })).toBeVisible();
  await expect(page.getByText('#Comida casera')).toBeVisible();
  await expect(page.getByText('#Platos principales')).toBeVisible();
  await expect(page.getByText('#Postres')).toHaveCount(0);
});
