import { test, expect, request } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:3002/api";

async function createChecklistTask(apiRequest, overrides = {}) {
  const response = await apiRequest.post(`${API_URL}/tasks`, {
    data: {
      title: "Checklist Task",
      description: "Checklist for update test",
      type: "checklist",
      items: [
        { text: "Item 1", completed: false },
        { text: "Item 2", completed: false },
      ],
      ...overrides,
    },
  });
  return await response.json();
}

test.describe("Update Checklist Task E2E", () => {
  let apiRequest;
  let checklistTask;

  test.beforeAll(async () => {
    apiRequest = await request.newContext();
    checklistTask = await createChecklistTask(apiRequest);
  });

  test("should update a checklist item via UI", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(
      page.getByRole("heading", { name: "My To-Do List" }).first()
    ).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { name: "Checklist Task" }).first()
    ).toBeVisible();
    const checkButton1 = page.getByRole("checkbox").first();
    const checkButton2 = page.getByRole("checkbox").nth(1);
    await checkButton1.click();
    await checkButton2.click();
    const checkButton = page.getByLabel("Mark as complete").first();
    await checkButton.click();
    await expect(page.getByLabel("Mark as incomplete").first()).toBeVisible();
  });

  test.afterAll(async () => {
    await apiRequest.delete(`${API_URL}/tasks/reset`);
    await apiRequest.dispose();
  });
});
