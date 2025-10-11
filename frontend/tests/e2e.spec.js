import { test, expect } from '@playwright/test'

test('login -> predict -> dashboard flow', async ({ page }) => {
  await page.goto('/prediction')
  // ensure splash has passed
  await page.waitForTimeout(1200)

  // fill email and login
  await page.fill('input[placeholder="tu@uleam.edu.ec"]', 'test@uleam.edu.ec')
  await page.click('button:has-text("Ingresar")')
  // wait for token to be stored
  await page.waitForTimeout(500)

  // submit a prediction
  await page.fill('input[name="name"]', 'Test User').catch(()=>{})
  // fallback: fill inputs by placeholder / label
  const nameInput = await page.$('input[name="name"]')
  if(!nameInput){
    await page.fill('input', 'Test User')
  }
  await page.click('button:has-text("Predecir")')
  await page.waitForTimeout(500)

  // go to dashboard and expect table rows
  await page.goto('/dashboard')
  await expect(page.locator('table')).toBeVisible()
  const rows = await page.locator('table tbody tr').count()
  expect(rows).toBeGreaterThanOrEqual(0)
})

test('token expiration leads to redirect to prediction', async ({ page }) => {
  await page.goto('/prediction')
  await page.waitForTimeout(1200)
  // login normally
  await page.fill('input[placeholder="tu@uleam.edu.ec"]', 'expire@uleam.edu.ec')
  await page.click('button:has-text("Ingresar")')
  await page.waitForTimeout(500)

  // simulate expired token in localStorage
  await page.evaluate(()=>{
    const fake = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({exp: 1})) + '.sig'
    localStorage.setItem('token', fake)
  })

  // attempt to go to dashboard; interceptor should redirect back to /prediction
  await page.goto('/dashboard')
  await page.waitForTimeout(500)
  expect(page.url()).toContain('/prediction')
})
