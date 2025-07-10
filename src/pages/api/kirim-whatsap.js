export async function POST({ request }) {
  const username = 'username';
  const password = 'password';
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const body = await request.json();
    const name = body.name?.trim();
    const wa = body.wa?.trim();

    if (!name || !wa) {
      return new Response(JSON.stringify({ message: 'Nama dan WA wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format nomor WA
    const phone = wa.replace(/\D/g, '').replace(/^0/, '62') + '@s.whatsapp.net';

    // Payload HARUS seperti yang gateway harapkan
    const payload = {
      phone,
      message: `Halo ${name}, terima kasih telah mendaftar konsultasi.`,
      reply_message_id: "",     // atau bisa undefined jika tidak perlu
      is_forwarded: false
    };
    console.log('Payload ke gateway:', payload); // 👈 debug

    const res = await fetch('https://gowa-nbztklhaqm8v.caca.sumopod.my.id/send/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    let result = {};
    try {
      result = await res.json();
    } catch (e) {
      // Kosong tidak apa
    }

    if (!res.ok) {
      throw new Error(result?.message || 'Gagal kirim pesan ke WhatsApp Gateway.');
    }

    return new Response(JSON.stringify({ message: 'Pesan berhasil dikirim!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      message: error instanceof Error ? error.message : 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
