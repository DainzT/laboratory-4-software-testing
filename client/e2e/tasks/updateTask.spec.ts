import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:3002/api";

async function createBasicTask(apiRequest, overrides = {}) {
  const response = await apiRequest.post(`${API_URL}/tasks`, {
    data: {
      title: "Update Task",
      description: "Task for update test",
      type: "basic",
      ...overrides,
    },
  });
  return await response.json();
}

test.describe("Update Task E2E", () => {
  let apiRequest;
  let basicTask;

  test.beforeAll(async () => {
    apiRequest = await request.newContext();
    basicTask = await createBasicTask(apiRequest);
  });

  test("should update a task via UI", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(
      page.getByRole("heading", { name: "My To-Do List" }).first()
    ).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { name: "Update Task" }).first()
    ).toBeVisible();
    const checkButton = page.getByLabel("Mark as complete").first();
    await checkButton.click();
    await expect(page.getByLabel("Mark as incomplete").first()).toBeVisible();
  });

  test.afterAll(async () => {
    await apiRequest.delete(`${API_URL}/tasks/reset`);
    await apiRequest.dispose();
  });
});
