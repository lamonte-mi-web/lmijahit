// src/pages/api/kirim-whatsapp.js

export async function POST({ request }) {
  const fonnteToken = "IDYI1bIy:Y5tXaRegKDQZ54VQKvzppBZq";//import.meta.env.FONNTE_TOKEN;
  //if (!fonnteToken) {
  //  return new Response(JSON.stringify({ message: 'Token Fonnte tidak ditemukan.' }), { status: 500 });
  //}

  try {
    const incomingData = await request.formData();

    // Ambil data 'name' dan 'wa' dari form
    const name = incomingData.get('name');
    const wa = incomingData.get('wa');

    // Validasi input
    if (!name || !wa) {
      return new Response(JSON.stringify({ message: 'Nama dan nomor WhatsApp wajib diisi.' }), { status: 400 });
    }

    // Gabungkan 'wa' dan 'name' sesuai format Fonnte
    const target = `${wa}|${name}`;

    // Siapkan data untuk dikirim ke Fonnte
    const fonnteFormData = new FormData();
    fonnteFormData.append('target', target);
    
    // Anda bisa membuat pesan default di sini
    fonnteFormData.append('message', `Halo {name}, terima kasih telah mendaftar untuk konsultasi. Kami akan segera menghubungi Anda.`);
    // Jika ada file yang diupload, tambahkan juga
    const file = incomingData.get('file');
    if (file) {
      fonnteFormData.append('file', file);
    }

    // Kirim request ke Fonnte
    const fonnteResponse = await fetch('https://gowa-nbztklhaqm8v.caca.sumopod.my.id/send/message', {
      method: 'POST',
      headers: { 'Authorization': fonnteToken },
      body: fonnteFormData
    });

    const responseData = await fonnteResponse.json();

    if (!fonnteResponse.ok) {
      throw new Error(responseData.message || 'Gagal mengirim pesan.');
    }

    // Kirim respons sukses kembali ke form
    return new Response(JSON.stringify({ message: 'Pesan berhasil dikirim!' }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}