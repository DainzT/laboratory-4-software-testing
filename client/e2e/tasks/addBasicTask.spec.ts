import { test, expect } from '@playwright/test';

test.describe('Add Basic Task', async () => {
    test.beforeAll(async ({ request }) => {
        const initialTasks = await request.get('http://localhost:3002/api/tasks');
        expect(await initialTasks.json()).toHaveLength(0);
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    });

    test('should show the correct static elements', async ({ page }) => {
        await expect(page.locator('div').filter({
            hasText: /^My To-Do ListManage your daily tasks efficiently$/
        }).getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
        await expect(page.locator('h1.text-4xl').getByText('My To-Do List')).toBeVisible();
        
        await expect(page.getByPlaceholder('Search tasks...')).toBeVisible();
        await expect(page.getByLabel('Sort by')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();
    });

    test('should display pre-loaded tasks without interaction', async ({ page }) => {
        await expect(page.getByText('Default Task')).toBeVisible();
        await expect(page.getByText('This appears on page')).toBeVisible();
    });
});