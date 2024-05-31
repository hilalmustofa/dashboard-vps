export const values = [
    {
      name: "Perumahan",
      options: [
        {
          key: "rumah",
          question: "1. Status kepemilikan rumah/tempat tinggal",
          options: [
            { value: "1", label: "Sewa / Kontrak" },
            { value: "2", label: "Milik Orang Tua" },
            { value: "3", label: "Milik Sendiri" },
          ],
        },
        {
          key: "luas",
          question: "2. Luas bangunan tempat tinggal",
          options: [
            { value: "1", label: "6 x 6 m / tipe 36" },
            { value: "2", label: "6 x 9 m / tipe 54" },
            { value: "3", label: "7 x 10 m / tipe 70" },
          ],
        },
        {
          key: "lantai",
          question: "3. Jenis lantai rumah utama (rumah utama bukan dapur)",
          options: [
            { value: "1", label: "Tanah" },
            { value: "2", label: "Ubin/Tegel/Plester" },
            { value: "3", label: "Keramik/Marmer/Granit" },
          ],
        },
        {
          key: "dinding",
          question: "4. Jenis dinding rumah utama terluas",
          options: [
            { value: "1", label: "Kayu Berkualitas Rendah/Sedang" },
            { value: "2", label: "Bata Merah/Batako/Hebel/Plester Kasar" },
            { value: "3", label: "Plester Halus/Keramik/Kayu kualitas tinggi" },
          ],
        },
        {
          key: "atap",
          question: "5. Jenis atap rumah utama terluas",
          options: [
            { value: "1", label: "Seng/asbes/genteng kualitas rendah sedang" },
            { value: "2", label: "Genteng kualitas tinggi/Cor/Genteng Baja Ringan" },
          ],
        },
        {
          key: "kondisi",
          question: "6. Kondisi rumah utama secara keseluruhan",
          options: [
            { value: "1", label: "Rusak Berat (kerusakan di atas 50%)" },
            { value: "2", label: "Rusak Sedang (kerusakan antara 30 s.d. 50 %)" },
            { value: "3", label: "Rusak Ringan (kerusakan di bawah 30%)" },
          ],
        },
        {
          key: "air",
          question: "7. Sumber air utama terbanyak yang digunakan untuk memasak atau MCK",
          options: [
            { value: "1", label: "Sumur Gali" },
            { value: "2", label: "Sumur Bor" },
            { value: "3", label: "PAM" },
          ],
        },
        {
          key: "penerangan",
          question: "8. Sumber penerangan utama",
          options: [
            { value: "1", label: "Gabung Listrik Tetangga" },
            { value: "2", label: "Listrik 450" },
            { value: "3", label: "Listrik 900" },
            { value: "4", label: "Listrik 3000" },
            { value: "5", label: "Diatas 3000" },
          ],
        },
        {
          key: "energi",
          question: "9. Sumber energi utama untuk memasak yang digunakan",
          options: [
            { value: "1", label: "Kayu Bakar" },
            { value: "2", label: "Gas 3Kg (subsidi)" },
            { value: "3", label: "Gas Non Subsidi" },
          ],
        },
        {
          key: "mck",
          question: "10. Kepemilikan Fasilitas MCK",
          options: [
            { value: "1", label: "MCK umum/bersama" },
            { value: "2", label: "MCK sendiri" },
          ],
        },
        {
          key: "jamban",
          question: "11. Jenis jamban utama yang digunakan",
          options: [
            { value: "1", label: "Jamban cemplung" },
            { value: "2", label: "Jamban Leher Angsa" },
            { value: "3", label: "Toilet Duduk" },
          ],
        },
        {
          key: "limbah",
          question: "12. Tempat pembuangan limbah cair sisa mandi/cuci",
          options: [
            { value: "1", label: "Pekarangan terbuka" },
            { value: "2", label: "Lobang di tanah" },
            { value: "3", label: "Selokan/aliran sungai" },
            { value: "4", label: "Septic Tank" },
          ],
        },
      ],
    },
    {
      name: "Sandang dan Pangan",
      options: [
        {
          key: "anggaran_makan",
          question: "13. Kesulitan untuk memenuhi anggaran makan minimal 3x sehari seluruh anggota keluarga?",
          options: [
            { value: "1", label: "Ya, Kesulitan" },
            { value: "2", label: "Kadang Tidak terpenuhi" },
            { value: "3", label: "Tidak ada masalah dalam hal pemenuhan konsumsi keluarga" },
          ],
        },
        {
          key: "anggaran_pakaian",
          question: "14. Kesulitan untuk memenuhi anggaran pembelian pakaian seluruh anggota keluarga untuk 6 bulan sekali?",
          options: [
            { value: "1", label: "Ya, Kesulitan" },
            { value: "2", label: "Kadang Tidak terpenuhi" },
            { value: "3", label: "Tidak ada masalah dalam hal pemenuhan kebutuhan sandang keluarga" },
          ],
        },
        {
          key: "anggaran_daging",
          question: "15. Kesulitan untuk memenuhi anggaran pembelian daging/protein hewani seluruh anggota keluarga untuk seminggu sekali?",
          options: [
            { value: "1", label: "Ya, Kesulitan" },
            { value: "2", label: "Kadang Tidak terpenuhi" },
            { value: "3", label: "Tidak ada masalah dalam hal pemenuhan kebutuhan gizi keluarga" },
          ],
        },
      ],
    },
    {
      name: "Kesehatan dan Pendidikan",
      options: [
        {
          key: "terdaftar_kis",
          question: "16. Anggota Keluarga terdaftar KIS?",
          options: [
            { value: "1", label: "Tidak ada yang terdaftar" },
            { value: "2", label: "Beberapa terdaftar" },
            { value: "3", label: "Terdaftar semua" },
          ],
        },
        {
          key: "jaminan_kesehatan",
          question: "17. Jenis jaminan Kesehatan?",
          options: [
            { value: "1", label: "Tidak mempunyai jaminan kesehatan" },
            { value: "2", label: "PBI (bantuan pemerintah)" },
            { value: "3", label: "Non PBI (swasta atau pegawai pemerintah)" },
          ],
        },
        {
          key: "disabilitas",
          question: "18. Anggota Keluarga dengan disabilitas?",
          options: [
            { value: "1", label: "Ada" },
            { value: "2", label: "Tidak Ada" },
          ],
        },
        {
          key: "penyakit",
          question: "19. Anggota keluarga dengan penyakit kronis/menahun?",
          options: [
            { value: "1", label: "Ada" },
            { value: "2", label: "Tidak Ada" },
          ],
        },
        {
          key: "ijazah_tertinggi",
          question: "20. Ijazah tertinggi yang dimiliki anggota keluarga?",
          options: [
            { value: "1", label: "Tidak Ada Ijazah" },
            { value: "2", label: "Ijazah SD sederajat" },
            { value: "3", label: "Ijazah SMP sederajat" },
            { value: "4", label: "Ijazah SMA sederajat" },
            { value: "5", label: "Ijazah Diploma, Sarjana, Magister" },
          ],
        },
        {
          key: "tanggungan",
          question: "21. Jumlah anggota keluarga yang masih menjadi tanggungan Kepala Keluarga/penanggung jawab dengan rentang usia 6 s.d. 19 tahun",
          options: [
            { value: "1", label: "Di atas 3 orang" },
            { value: "2", label: "Kurang dari 3 orang" },
            { value: "3", label: "Tidak ada tanggungan" },
          ],
        },
      ],
    },
    {
      name: "Sumber Penghasilan",
      options: [
        {
          key: "pekerjaan_utama",
          question: "22. Pekerjaan utama Kepala Keluarga/Penanggung Jawab Keluarga?",
          options: [
            { value: "1", label: "Tidak Bekerja" },
            { value: "2", label: "Buruh / Serabutan (tidak menentu)" },
            { value: "3", label: "Pemilik Lahan/Pemodal, Pegawai Swasta, BUMN/ ASN" },
          ],
        },
        {
          key: "jumlah_berpenghasilan",
          question: "23. Jumlah total anggota keluarga termasuk kepala keluarga/penanggung jawab keluarga yang berpenghasilan?",
          options: [
            { value: "1", label: "Tidak Bekerja dan Tidak ada yang menanggung (hanya mengandalkan pemberian)" },
            { value: "2", label: "1 Orang" },
            { value: "3", label: "Lebih dari 1 orang" },
          ],
        },
        {
          key: "jumlah_pendapatan",
          question: "24. Jumlah total Pendapatan Kepala Keluarga/Penanggung jawab keluarga dan anggota keluarga dibagi jumlah seluruh anggota keluarga selama 6 bulan terakhir?",
          options: [
            { value: "1", label: "Tidak Ada penghasilan pasti (hanya mengandalkan pemberian)" },
            { value: "2", label: "Kurang dari atau sama dengan 300 ribu" },
            { value: "3", label: "300 ribu s.d. 500 ribu" },
            { value: "4", label: "500 ribu s.d. 1 juta rupiah" },
            { value: "5", label: "1 juta atau lebih dari 1 juta" },
          ],
        },
      ],
    },
    {
      name: "Kepemilikan Asset",
      options: [
        {
          key: "aset_elektronik",
          question: "25. Rumah tangga memiliki aset elektronik (TV Flat di atas 20 inch, kulkas, mesin cuci, laptop/komputer, AC)?",
          options: [
            { value: "1", label: "Tidak ada" },
            { value: "2", label: "Ada 1 sampai 2" },
            { value: "3", label: "Ada lebih dari 2" },
            { value: "4", label: "Ada semua" },
          ],
        },
        {
          key: "aset_kendaraan",
          question: "26. Kepemilikan transportasi bermotor/bermesin dalam satu rumah?",
          options: [
            { value: "1", label: "Tidak Ada" },
            { value: "2", label: "Ada 1 s.d. 2 buah" },
            { value: "3", label: "Lebih dari 2 buah" },
          ],
        },
        {
          key: "jenis_kendaraan",
          question: "27. Jenis alat transportasi (Motor) dengan volume kubikasi tertinggi dalam satu rumah?",
          options: [
            { value: "1", label: "Tidak Punya" },
            { value: "2", label: "Sepeda motor 100 s.d. 125 cc" },
            { value: "3", label: "Sepeda motor 125 s.d. 250 cc" },
            { value: "4", label: "Sepeda motor di atas 250 cc" },
          ],
        },
        {
          key: "jumlah_kendaraan",
          question: "28. Kepemilikan alat transportasi (Mobil/Truck/PickUp dll)?",
          options: [
            { value: "1", label: "Tidak Punya" },
            { value: "2", label: "Ada 1 s.d. 2 buah" },
            { value: "3", label: "Lebih dari 2 buah" },
          ],
        },
        {
          key: "aset_lain",
          question: "29. Kepemilikan Asset tidak bergerak di tempat lain (tidak termasuk lahan/bangunan yang sekarang ditempati)?",
          options: [
            { value: "1", label: "Tidak Ada" },
            { value: "2", label: "Ada" },
          ],
        },
        {
          key: "hewan_ternak",
          question: "30. Kepemilikan Hewan ternak (hitung seluruh harga jual ternak yang dimiliki)",
          options: [
            { value: "1", label: "Harga Jual kurang dari 1 juta rupiah" },
            { value: "2", label: "Harga jual 1 s.d 5 Juta rupiah" },
            { value: "3", label: "Harga Jual di atas 5 s.d. 10 Juta Rupiah" },
            { value: "4", label: "Harga Jual di atas 10 juta rupiah" },
          ],
        },

      ],
    }
  ];