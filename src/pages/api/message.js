// File: src/pages/api/message.js

// Fungsi bantuan untuk mem-parsing header Authorization Basic
function parseAuth(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  const base64Credentials = header.substring(6);
  try {
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
    return { username, password };
  } catch (e) {
    return null;
  }
}

export async function POST({ request }) {
  const { API_USERNAME, API_PASSWORD, GO_WHATSAPP_API_URL, GO_WHATSAPP_API_TOKEN } = import.meta.env;

  if (!API_USERNAME || !API_PASSWORD || !GO_WHATSAPP_API_URL || !GO_WHATSAPP_API_TOKEN) {
    return new Response(JSON.stringify({ message: 'Konfigurasi server tidak lengkap.' }), { status: 500 });
  }

  const authHeader = request.headers.get('Authorization');
  const user = parseAuth(authHeader);

  if (!user || user.username !== API_USERNAME || user.password !== API_PASSWORD) {
    return new Response(JSON.stringify({ message: 'Akses ditolak.' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
    });
  }

  try {
    const formData = await request.formData();
    
    // --- PERBAIKAN DI SINI: Hapus 'as string' ---
    const phone = formData.get('phone');
    const message = formData.get('message');

    if (!phone || !message) {
      return new Response(JSON.stringify({ message: 'Properti `phone` dan `message` wajib diisi.' }), { status: 400 });
    }

    const goWhatsappEndpoint = `${GO_WHATSAPP_API_URL}/send/message`;
    
    const goWhatsappBody = {
      phone: phone.toString(), // Konversi ke string untuk keamanan
      message: message.toString(),
    };

    const goWhatsappResponse = await fetch(goWhatsappEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GO_WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(goWhatsappBody)
    });

    const responseData = await goWhatsappResponse.json();
    
    return new Response(JSON.stringify(responseData), { 
      status: goWhatsappResponse.status,
      headers: { 'Content-Type': 'application/json' }
    }); 

  } catch (error) {
    const errorMessage = error instanceof Error ? `Terjadi error: ${error.message}` : 'Terjadi error internal.';
    return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
  }
}