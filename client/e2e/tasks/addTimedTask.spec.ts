import { test, expect } from '@playwright/test';

test.describe('Add Timed Task', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    });

    test.afterEach(async ({ request }) => {
        await request.delete('http://localhost:3002/api/tasks/reset');
    });

    test('should add a new Timed task successfully', async ({ page, request }) => {
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Timed' }).click();

        await page.getByLabel('Title').fill('New Timed Task');
        await page.getByLabel('Description').fill('This is a Timed test task');

        const futureDate = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16);
        await page.getByLabel(/Due Date/i).fill(futureDate);

        await page.getByRole('button', { name: 'Add Task' }).click();

        await expect(page.getByText('New Task')).toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(1000);

        const tasksResponse = await request.get('http://localhost:3002/api/tasks');
        expect(tasksResponse.status()).toBe(200);

        const tasks = await tasksResponse.json();
        const createdTask = tasks.find(t => t.title === 'New Timed Task');

        expect(createdTask.description).toBe('This is a Timed test task');
        expect(createdTask.type).toBe('timed');
        expect(createdTask.completed).toBe(false);

        expect(createdTask.dueDate).toBeTruthy();
        expect(createdTask.id).toBeTruthy();
    });
});