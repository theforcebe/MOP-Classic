const BASE_URL = 'https://script.google.com/macros/s/AKfycbwYL_SY65sGPIwlV4dWovEqZAIjm10qBImGphw-VPzVNbm8qoBgn259jVBez7lrydx8/exec';

export async function getSheet(sheet) {
  const res = await fetch(`${BASE_URL}?sheet=${sheet}`);
  return res.json();
}

export async function appendToSheet(sheet, row) {
  const res = await fetch(`${BASE_URL}?sheet=${sheet}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  });
  return res.json();
}

// Optionally, you can add update/delete logic if you extend your Apps Script. 