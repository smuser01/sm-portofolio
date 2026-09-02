import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://nvmchfekhstlvstwsqsb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bWNoZmVraHN0bHZzdHdzcXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDAzNDEsImV4cCI6MjEwMjA3NjM0MX0.XxHIdy5hFV4bKax5-wQO4_uQpkN30zYL9WDQWpi_DCk'

const supabase = createClient(supabaseUrl, supabaseKey)

const proyekContainer = document.querySelector("#proyek-container");

async function tampilkanProyek() {
  proyekContainer.textContent = "Memuat proyek...";

  const { data: proyek, error } = await supabase
    .from("proyek")
    .select("judul, deskripsi, gambar_url")
    .order("id", { ascending: false });

  if (error) {
    console.error("Gagal mengambil proyek:", error);
    proyekContainer.textContent = "Proyek belum dapat dimuat.";
    return;
  }

  proyekContainer.replaceChildren();

  if (!proyek.length) {
    proyekContainer.textContent = "Belum ada proyek.";
    return;
  }

  proyek.forEach((item) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const judul = document.createElement("h3");
    judul.textContent = item.judul || "Tanpa judul";

    const deskripsi = document.createElement("p");
    deskripsi.textContent = item.deskripsi || "Tidak ada deskripsi.";

    card.append(judul, deskripsi);

    if (item.gambar_url) {
      const media = document.createElement("iframe");
      const driveFile = item.gambar_url.match(
        /drive\.google\.com\/file\/d\/([^/]+)/
      );
      const presentation = item.gambar_url.match(
        /docs\.google\.com\/presentation\/d\/([^/]+)/
      );

      media.src = driveFile
        ? `https://drive.google.com/file/d/${driveFile[1]}/preview`
        : presentation
          ? `https://docs.google.com/presentation/d/${presentation[1]}/embed`
          : item.gambar_url;
      media.title = `Pratinjau ${item.judul || "proyek"}`;
      media.width = 300;
      media.height = 300;
      media.loading = "lazy";
      media.allowFullscreen = true;
      card.appendChild(media);
    }

    proyekContainer.appendChild(card);
  });
}

tampilkanProyek();

// 1. Dark / Light Mode Toggle
const btn = document.querySelector("#toggleTheme");

btn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");
  btn.textContent = isLight ? "☀️" : "🌙";
});

// 2. Render Skill Badge dari Array
const skills = ["HTML", "CSS", "JavaScript", "MySQL"];

const skillsContainer = document.querySelector("#skills-container");

skills.forEach((skill) => {
  const badge = document.createElement("span");
  badge.className = "skill-badge";
  badge.textContent = skill;
  skillsContainer.appendChild(badge);
});

// 3. Form Kontak & Validasi
const form = document.querySelector("#formkontak");
const namaInput = document.querySelector("#namainput");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = namaInput.value.trim();

  if (nama === "") {
    alert("Nama wajib diisi!");
    return;
  }

  const { error } = await supabase
    .from("pesan")
    .insert([{ nama }]);

  if (error) {
    console.error("Gagal menyimpan pesan:", error);
    alert("Gagal mengirim pesan. Periksa tabel dan policy Supabase.");
    return;
  }

  alert("Pesan terkirim, " + nama + "!");
  namaInput.value = "";
});