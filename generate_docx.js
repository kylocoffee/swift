import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip
} from 'docx';

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: '0A5C0A',
        font: 'Arial'
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: '1E3C72',
        font: 'Arial'
      })
    ]
  });
}

function createParagraph(text, isBold = false) {
  return new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({
        text,
        bold: isBold,
        size: 22, // 11pt
        font: 'Arial',
        color: '222222'
      })
    ]
  });
}

function createBullet(text, isBold = false) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 },
    children: [
      new TextRun({
        text,
        bold: isBold,
        size: 22,
        font: 'Arial',
        color: '222222'
      })
    ]
  });
}

function createTable(headers, rows) {
  const tableRows = [];

  // Header row
  tableRows.push(
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })]
        })],
        shading: { fill: '0A5C0A' },
        margins: { top: 120, bottom: 120, left: 140, right: 140 }
      }))
    })
  );

  // Data rows
  rows.forEach((row, idx) => {
    tableRows.push(
      new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 19, font: 'Arial', color: '222222' })]
          })],
          shading: { fill: idx % 2 === 0 ? 'F9FAF9' : 'FFFFFF' },
          margins: { top: 100, bottom: 100, left: 140, right: 140 }
        }))
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

const doc = new Document({
  creator: 'Bank Praktikum Nusantara Core Banking & SWIFT Lab',
  title: 'PANDUAN LENGKAP CORE BANKING SYSTEM (CBS) UNTUK ORANG AWAM & MAHASISWA',
  description: 'Modul Pembelajaran Praktikum Core Banking System dan Jaringan SWIFT',
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1)
          }
        }
      },
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'MODUL PRAKTIKUM LABORATORIUM PERBANKAN',
              bold: true,
              size: 24,
              color: '0A5C0A',
              font: 'Arial'
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'PANDUAN LENGKAP CORE BANKING SYSTEM (CBS)\nUNTUK ORANG AWAM & MAHASISWA',
              bold: true,
              size: 36,
              color: '1E3C72',
              font: 'Arial'
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: 'Memahami Jantung Sistem Perbankan, Logika Akuntansi Debit-Kredit, Rekening Nostro, Neraca Saldo, dan Alur Kerja Operasional Bank Nyata.',
              italics: true,
              size: 22,
              color: '555555',
              font: 'Arial'
            })
          ]
        }),

        // BAB 1
        createHeading1('1. APA ITU CORE BANKING SYSTEM (CBS)?'),
        createParagraph('Core Banking System (CBS) adalah sistem teknologi informasi sentral yang menjadi otak, jantung, dan sistem saraf bagi operasional sebuah bank komersial modern.'),
        createParagraph('Kata CORE merupakan singkatan dari:'),
        createBullet('Centralized (Tersentralisasi) — Seluruh data nasabah dan pembukuan disimpan di satu pusat data terpadu.'),
        createBullet('Online (Terhubung secara langsung) — Setiap cabang terhubung secara online 24/7.'),
        createBullet('Real-time (Diproses seketika) — Mutasi rekening dan saldo dicatat detik itu juga tanpa jeda waktu.'),
        createBullet('Electronic (Elektronik & Digital) — Menggantikan buku kas kertas fisik dengan buku besar digital terenkripsi.'),
        createParagraph('Fungsi utama CBS meliputi: pencatatan rekening nasabah (CIF), pemrosesan mutasi debit dan kredit otomatis (General Ledger), pemantauan kas fisik (Vault Cash) dan valas (Nostro), integrasi jaringan kliring (BI-RTGS, BI-FAST, SWIFT), serta eksekusi tutup buku harian (End of Day / EOD).'),

        // BAB 2
        createHeading1('2. MEMAHAMI LOGIKA DEBIT & KREDIT PERBANKAN (JANGAN SAMPAI TERBALIK!)'),
        createParagraph('Orang awam sering bingung: Mengapa saat kita menyetor uang ke bank, SMS notifikasi bertuliskan "KREDIT (+)", padahal uang kita bertambah?'),
        createParagraph('Jawabannya adalah: Pembukuan perbankan dicatat dari SUDUT PANDANG PIHAK BANK, bukan sudut pandang pribadi nasabah!'),
        createBullet('Uang yang Anda simpan di bank BUKANLAH HARTA MILIK BANK. Uang tersebut adalah titipan nasabah yang wajib dikembalikan oleh bank sewaktu-waktu.'),
        createBullet('Dalam akuntansi, titipan atau simpanan nasabah diklasifikasikan sebagai KEWAJIBAN / UTANG (LIABILITAS) bagi bank.'),
        createBullet('Sesuai hukum dasar akuntansi: Kewajiban yang bertambah dicatat di KREDIT (Cr.). Itulah sebabnya saat Anda menabung, bank mengkredit rekening Anda!'),
        createBullet('Sebaliknya, saat Anda mentransfer uang keluar, kewajiban bank berkurang, sehingga dicatat di DEBIT (Dr.).'),

        createHeading2('Perbandingan Akun Nasabah vs Akun Nostro:'),
        createTable(
          ['Jenis Rekening', 'Klasifikasi Bank', 'Jika Bertambah', 'Jika Berkurang'],
          [
            ['Rekening Nasabah (Giro / Tabungan)', 'Kewajiban / Liabilitas', 'KREDIT (Cr.)', 'DEBIT (Dr.)'],
            ['Rekening Kas Brankas (Vault Cash)', 'Aset / Harta Bank', 'DEBIT (Dr.)', 'KREDIT (Cr.)'],
            ['Rekening Nostro di Luar Negeri', 'Aset / Harta Bank', 'DEBIT (Dr.)', 'KREDIT (Cr.)'],
            ['Pendapatan Komisi / Biaya SWIFT', 'Pendapatan (Revenue)', 'KREDIT (Cr.)', 'DEBIT (Dr.)'],
            ['Beban Bunga Simpanan Nasabah', 'Beban (Expense)', 'DEBIT (Dr.)', 'KREDIT (Cr.)']
          ]
        ),

        // BAB 3
        createHeading1('3. REKENING NOSTRO: BAGAIMANA UANG DITRANSFER KE LUAR NEGERI?'),
        createParagraph('Ketika PT INDO EXPORT TAMA di Jakarta mentransfer USD 50,000.00 ke luar negeri via SWIFT, bank tidak mengirim uang kertas dengan pesawat. Perpindahan dana dilakukan melalui Rekening Nostro.'),
        createBullet('Nostro berasal dari bahasa Latin yang berarti "Milik Kami". Rekening Nostro adalah rekening bank kita di bank koresponden luar negeri (misalnya rekening Bank Praktikum Nusantara di Citibank New York).'),
        createBullet('Saat transaksi transfer dirilis (Released), bank kita mengirimkan pesan sandi SWIFT ke Citibank New York untuk memotong saldo Nostro kita dan meneruskannya ke bank penerima.'),

        createHeading2('Jurnal Double-Entry Transfer Outward SWIFT:'),
        createTable(
          ['No. Akun', 'Nama Akun', 'Posisi', 'Nominal', 'Keterangan'],
          [
            ['210101', 'Giro Nasabah Pengirim', 'DEBIT (Dr.)', '$ 50,030.00', 'Saldo nasabah dipotong pokok transfer + biaya telex.'],
            ['110201', 'Nostro USD Citibank New York', 'KREDIT (Cr.)', '$ 50,000.00', 'Cadangan valas bank kita di luar negeri dikurangi.'],
            ['410502', 'Pendapatan Biaya Telex SWIFT', 'KREDIT (Cr.)', '$ 30.00', 'Bank mengakui pendapatan jasa telex non-bunga.']
          ]
        ),
        createParagraph('Total Debit ($ 50,030.00) = Total Kredit ($ 50,030.00) -> Persamaan Akuntansi Tetap Seimbang Sempurna.'),

        // BAB 4
        createHeading1('4. CHART OF ACCOUNTS (COA) STANDAR PERBANKAN'),
        createTable(
          ['Kode Akun', 'Nama Akun Master', 'Kategori', 'Normal', 'Deskripsi Operasional'],
          [
            ['100101', 'Kas Khasanah Cabang (Vault Cash)', 'Aset', 'Debit', 'Uang fisik tunai di brankas cabang.'],
            ['110101', 'Giro Bank Indonesia (RTGS Settlement)', 'Aset', 'Debit', 'Cadangan wajib untuk kliring antarbank.'],
            ['110201', 'Nostro USD - Citibank N.A. New York', 'Aset', 'Debit', 'Rekening valas utama USD di New York.'],
            ['110202', 'Nostro SGD - DBS Bank Ltd Singapore', 'Aset', 'Debit', 'Rekening valas regional Asia Tenggara.'],
            ['110204', 'Nostro EUR - Bank of America N.A. NY', 'Aset', 'Debit', 'Rekening valas penyelesaian mata uang Euro.'],
            ['210101', 'Giro Nasabah Korporasi', 'Kewajiban', 'Kredit', 'Simpanan giro komersial nasabah.'],
            ['210201', 'Tabungan Valas Nasabah', 'Kewajiban', 'Kredit', 'Simpanan nasabah dalam valuta asing.'],
            ['310101', 'Modal Disetor Bank (Equity)', 'Ekuitas', 'Kredit', 'Modal modal disetor pemegang saham bank.'],
            ['410502', 'Pendapatan Biaya SWIFT Surcharge', 'Pendapatan', 'Kredit', 'Biaya jaringan telex yang ditagihkan.'],
            ['510101', 'Beban Bunga Simpanan Nasabah', 'Beban', 'Debit', 'Beban bunga harian yang dibayarkan ke nasabah.']
          ]
        ),

        // BAB 5
        createHeading1('5. NERACA SALDO & REKENING KORAN'),
        createParagraph('Neraca Saldo (Trial Balance) adalah alat kendali sistem untuk membuktikan bahwa seluruh mutasi debit sama persis dengan seluruh mutasi kredit (Dr = Cr). Pada simulator, menu CORE LEDGER tab TRIAL BALANCE memverifikasi keseimbangan ini secara real-time.'),
        createParagraph('Rekening Koran (Bank Statement) adalah catatan kronologis mutasi rekening nasabah yang menampilkan saldo awal, mutasi kredit (setoran/penerimaan), mutasi debit (penarikan/transfer), dan saldo akhir. Rekening koran dapat diekspor ke CSV atau dicetak resmi melalui tombol PRINT STATEMENT.'),

        // BAB 6
        createHeading1('6. TUTUP BUKU HARIAN (END OF DAY / EOD)'),
        createParagraph('Setiap akhir hari kerja, bank melakukan tutup buku harian untuk:'),
        createBullet('Mengunci seluruh transaksi pada tanggal hari ini.'),
        createBullet('Menghitung akrual bunga simpanan harian nasabah (1.50% p.a. / 365) secara otomatis.'),
        createBullet('Membukukan jurnal beban bunga (Dr. 510101 Beban Bunga, Cr. 210101 Giro Nasabah).'),
        createBullet('Memverifikasi integritas neraca saldo dan memajukan tanggal buku bank ke hari kerja berikutnya.'),

        // BAB 7
        createHeading1('7. PANDUAN SIMULASI LANGKAH DEMI LANGKAH'),
        createBullet('Langkah 1: Klik splash screen, masukkan Akun student01, Password swiftlab, Key LAB-2026. Klik CONNECT USB KEY, pilih operator iqbal (Maker), password 123456.'),
        createBullet('Langkah 2: Buka CORE LEDGER -> Tab CUSTOMER ACCOUNTS. Klik + DEPOSIT pada PT INDO EXPORT TAMA jika perlu menambah saldo.'),
        createBullet('Langkah 3: Buka menu RECORD. Buat transfer pacs.008 senilai USD 25,000 ke CITIUS33XXX. Pilih rekening pengirim PT INDO EXPORT TAMA. Klik SUBMIT (status Pending).'),
        createBullet('Langkah 4: Logout, login sebagai salma (Compliance Officer, pass 123456). Buka SEARCH, klik menu titik tiga (...) -> UPDATE STATUS -> Validated.'),
        createBullet('Langkah 5: Logout, login sebagai dhendy (Head Treasury / Checker, pass 123456). Buka SEARCH, klik UPDATE STATUS -> Released. Saldo nasabah langsung terpotong, saldo Nostro berkurang, dan jurnal GL terbentuk!'),
        createBullet('Langkah 6: Buka CORE LEDGER -> tab TRIAL BALANCE untuk memverifikasi keseimbangan neraca.'),
        createBullet('Langkah 7: Buka tab CUSTOMER ACCOUNTS -> klik 📄 REKENING KORAN untuk melihat mutasi dan mencetak laporan resmi.'),
        createBullet('Langkah 8: Klik tombol merah ⚡ EXECUTE END OF DAY (EOD) untuk menjalankan tutup buku harian.'),

        // BAB 8
        createHeading1('8. AKSES PORTAL SUPER ADMIN (DOSEN / INSTRUKTUR)'),
        createParagraph('Pengaturan laboratorium bank ditempatkan pada halaman terpisah admin.html untuk menjaga keamanan praktikum mahasiswa:'),
        createBullet('URL Portal: Buka /admin.html pada peramban web.'),
        createBullet('Master Key: MASTER-SWIFT-2026'),
        createBullet('Password: supersecret'),
        createParagraph('Instruktur dapat mengubah nama bank simulasi, kode BIC, tarif telex, mencadangkan database ke file JSON, atau mereset seluruh data kembali ke kondisi awal pabrik.')
      ]
    }
  ]
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('./PANDUAN_CORE_BANKING_PEMULA.docx', buffer);
  console.log('Successfully generated PANDUAN_CORE_BANKING_PEMULA.docx');
}

main().catch(console.error);
