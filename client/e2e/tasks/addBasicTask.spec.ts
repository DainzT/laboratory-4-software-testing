import { test, expect } from '@playwright/test';

test.describe('Add Basic Task', async () => {
    test.beforeEach(async ({ request }) => {
        await request.delete('http://localhost:3002/api/tasks/reset');

        await request.post('http://localhost:3002/api/tasks', {
            data: {
                title: 'Default Task',
                description: 'This appears on page load',
                type: 'basic',
                completed: false
            }
        });
    });

    test('should show the correct static elements', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
        await expect(page.getByText('Manage your daily tasks efficiently')).toBeVisible();
        await expect(page.getByPlaceholder('Search tasks...')).toBeVisible();
        await expect(page.getByLabel('Sort by')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();
    });

    test('should display pre-loaded tasks without interaction', async ({ page }) => {
        await expect(page.getByText('Default Task')).toBeVisible();
        await expect(page.getByText('This appears on page load')).toBeVisible();
    });
});