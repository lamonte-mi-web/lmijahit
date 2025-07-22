export const prerender = false;

export async function POST({ request }) {
  const username = 'IDYI1bIy';
  const password = 'Y5tXaRegKDQZ54VQKvzppBZq';
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

    const phone = wa.replace(/\D/g, '').replace(/^0/, '62') + '@s.whatsapp.net';

    const payload = {
      phone,
      message: `Halo ${name}, terima kasih telah mendaftar konsultasi.`,
      is_forwarded: false
    };

    // 🟢 DEBUG: log payload yang dikirim ke gateway
    console.log('\n📤 Payload ke WhatsApp Gateway:\n', JSON.stringify(payload, null, 2));

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
    } catch {
      console.warn('⚠️ Response gateway tidak berupa JSON.');
    }

    // 🟡 DEBUG: log respons dari gateway
    console.log('\n📥 Respons dari WhatsApp Gateway:\n', result);

    if (!res.ok) {
      throw new Error(result?.message || 'Gagal mengirim ke gateway.');
    }

    return new Response(JSON.stringify({ message: 'Pesan berhasil dikirim!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error kirim ke WhatsApp Gateway:', error);
    return new Response(JSON.stringify({
      message: error instanceof Error ? error.message : 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
