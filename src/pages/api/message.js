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
  // Ambil variabel dari Vercel
  const { API_USERNAME, API_PASSWORD, GO_WHATSAPP_API_URL, GO_WHATSAPP_API_TOKEN } = import.meta.env;

  // Validasi konfigurasi server
  if (!API_USERNAME || !API_PASSWORD || !GO_WHATSAPP_API_URL || !GO_WHATSAPP_API_TOKEN) {
    return new Response(JSON.stringify({ message: 'Konfigurasi Environment Variables di Vercel tidak lengkap.' }), { status: 500 });
  }

  // Otentikasi request yang masuk ke API ini
  const authHeader = request.headers.get('Authorization');
  const user = parseAuth(authHeader);
  if (!user || user.username !== API_USERNAME || user.password !== API_PASSWORD) {
    return new Response(JSON.stringify({ message: 'Akses ditolak (Username/Password salah).' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
    });
  }

  try {
    // Membaca data sebagai FormData
    const formData = await request.formData();
    const phone = formData.get('phone');
    const message = formData.get('message');

    if (!phone || !message) {
      return new Response(JSON.stringify({ message: 'Data "phone" dan "message" tidak boleh kosong.' }), { status: 400 });
    }

    const goWhatsappEndpoint = `${GO_WHATSAPP_API_URL}/send/message`;
    
    // Siapkan body untuk Go WhatsApp API dalam format JSON
    const goWhatsappBody = {
      phone: phone.toString(),
      message: message.toString(),
    };

    // Kirim request ke Go WhatsApp API
    const goWhatsappResponse = await fetch(goWhatsappEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GO_WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(goWhatsappBody)
    });

    // Teruskan response dari Go WhatsApp API ke client
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