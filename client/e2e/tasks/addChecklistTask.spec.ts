import { test, expect } from '@playwright/test';

test.describe('Add CheckList Task', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    });

    test.afterEach(async ({ request }) => {
        await request.delete('http://localhost:3002/api/tasks/reset');
    });

    test('should add a new Checklist task successfully', async ({ page, request }) => {
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Checklist' }).click();

        await page.getByLabel('Title').fill('New Checklist Task');
        await page.getByLabel('Description').fill('This is a Checklist test task');

        const items = ['First item', 'Second item', 'Third item'];
        for (const [index, item] of items.entries()) {
            await page.getByPlaceholder('Item description').nth(index).fill(item);
            if (index < items.length - 1) {
                await page.getByRole('button', { name: 'Add another item' }).click();
            }
        }

        await page.getByRole('button', { name: 'Add Task' }).click();

        await expect(page.getByText('New Checklist Task')).toBeVisible({ timeout: 5000 });
        for (const item of items) {
            await expect(page.getByText(item)).toBeVisible();
        }


        const tasksResponse = await request.get('http://localhost:3002/api/tasks');
        expect(tasksResponse.status()).toBe(200);

        const tasks = await tasksResponse.json();
        const createdTask = tasks.find(t => t.title === 'New Checklist Task');

        expect(createdTask.description).toBe('This is a Checklist test task');
        expect(createdTask.type).toBe('checklist');
        expect(createdTask.completed).toBe(false);
        expect(createdTask.id).toBeTruthy();

        expect(createdTask.items).toHaveLength(items.length);
        for (const [index, item] of items.entries()) {
            expect(createdTask.items[index].text).toBe(item);
            expect(createdTask.items[index].completed).toBe(false);
            expect(createdTask.items[index].id).toBeTruthy();
        }
    });
});