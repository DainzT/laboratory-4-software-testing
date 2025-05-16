import { test, expect } from '@playwright/test';

test.describe('Add CheckList Task', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    });

    test.afterEach(async ({ request }) => {
        await request.delete(`${process.env.VITE_API_BASE_URL}/tasks/reset`);
    });

    test('should add a new Checklist task successfully', async ({ page, request }) => {
        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByRole('button', { name: 'Checklist' }).click();

        await page.getByLabel('Title').fill('New Checklist Task');
        await page.getByLabel('Description').fill('This is a Checklist test task');
        const items = ["First Item"]
        await page.getByPlaceholder('Item description').fill("First Item");
        await page.getByRole('button', { name: 'Add Task' }).click();

        const tasksResponse = await request.get(`${process.env.VITE_API_BASE_URL}/tasks`);
        expect(tasksResponse.status()).toBe(200);
        const tasks = await tasksResponse.json();
        const createdTask = tasks.find(t => t.title === 'New Checklist Task');
        expect(createdTask.type).toBe('checklist');
        expect(createdTask.description).toBe('This is a Checklist test task');
        expect(createdTask.completed).toBe(false);
        expect(createdTask.id).toBeTruthy();
        expect(createdTask.items).toHaveLength(1);
        for (const [index, item] of items.entries()) {
            expect(createdTask.items[index].text).toBe(item);
            expect(createdTask.items[index].completed).toBe(false);
            expect(createdTask.items[index].id).toBeTruthy();
        }

        await expect(page.getByText('New Checklist Task')).toBeVisible({ timeout: 10000 });
        for (const item of items) {
            await expect(page.getByText(item)).toBeVisible();
        }
        await page.waitForTimeout(1000);
    });
});