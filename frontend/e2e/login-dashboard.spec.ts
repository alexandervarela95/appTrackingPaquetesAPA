import { expect, test } from '@playwright/test';

test('usuario demo inicia sesion y accede al dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('usuario').fill('Sistemas');
  await page.getByPlaceholder('Ingresa tu contrasena').fill('Sistemas*2026');
  await page.getByRole('button', { name: 'Iniciar sesion' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Paquetes activos')).toBeVisible();
});
