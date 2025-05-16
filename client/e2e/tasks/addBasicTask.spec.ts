import { test, expect } from '@playwright/test';

test.describe('Add Basic Task', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    });

    test.afterEach(async ({ request }) => {
        await request.delete(`${process.env.VITE_API_BASE_URL}/tasks/reset`);
    });

    test('should add a new basic task successfully', async ({ page, request }) => {
        
        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByLabel('Title').fill('New Basic Task');
        await page.getByLabel('Description').fill('This is a basic test task');
        await page.getByRole('button', { name: 'Add Task' }).click();

        const tasksResponse = await request.get(`${process.env.VITE_API_BASE_URL}/tasks`);
        expect(tasksResponse.status()).toBe(200);
        const tasks = await tasksResponse.json();
        const createdTask = tasks.find(t => t.title === 'New Basic Task');
        expect(createdTask.description).toBe('This is a basic test task');
        expect(createdTask.type).toBe('basic');
        expect(createdTask.completed).toBe(false);
        expect(createdTask.id).toBeTruthy();

        
        await expect(page.getByText('New Task')).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(1000);
    });
});
