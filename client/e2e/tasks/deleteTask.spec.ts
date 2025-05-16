import { test, expect, request } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:3002/api";

async function createMockTask(apiRequest, overrides = {}) {
  const response = await apiRequest.post(`${API_URL}/tasks`, {
    data: {
      title: "Delete Task",
      description: "Task for delete test",
      type: "basic",
      ...overrides,
    },
  });
  return await response.json();
}

test.describe("Delete Task E2E", () => {
  let apiRequest;
  let createdTask;

  test.beforeAll(async () => {
    apiRequest = await request.newContext();
    createdTask = await createMockTask(apiRequest);
  });

  test("should delete a task from the UI and DB", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(
      page.getByRole("heading", { name: "My To-Do List" }).first()
    ).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { name: "Delete Task" }).first()
    ).toBeVisible();
    const checkButton = page.getByLabel("Delete task").first();
    await checkButton.click();
  });

  test.afterAll(async () => {
    await apiRequest.delete(`${API_URL}/tasks/reset`);
    await apiRequest.dispose();
  });
});
