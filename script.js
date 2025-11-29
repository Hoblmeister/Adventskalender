const TESTMODE = false; // auf false setzen, wenn es live gehen soll, true für Test

// Adventssprüche + Bilder
const entries = [
    {img:"img/1.jpg",  text:"Ein Lichtlein brennt – möge es Wärme in dein Herz bringen."},
    {img:"img/2.jpg",  text:"Der Winter flüstert: Kuschel dich warm ein! ❄️"},
    {img:"img/3.jpg",  text:"Heute ist ein guter Tag für Kekse und Gemütlichkeit."},
    {img:"img/4.jpg",  text:"Advent heißt: den Zauber wiederfinden. ✨"},
    {img:"img/5.jpg",  text:"Fünf Kerzen? Nein – aber fünf Gründe zum Lächeln."},
    {img:"img/6.jpg",  text:"Wenn’s draußen kalt wird, wird’s drinnen warm. ❤️"},
    {img:"img/7.jpg",  text:"Eine Woche Advent – Zeit für Wunder!"},
    {img:"img/8.jpg",  text:"Glühwein hilft nicht gegen alles – aber es ist ein Anfang."},
    {img:"img/9.jpg",  text:"Heute nur positive Schneeflocken zulassen."},
    {img:"img/10.jpg", text:"Ein warmes Herz ist das schönste Weihnachtsgeschenk."},
    {img:"img/11.jpg", text:"Die besten Momente sind oft die stillsten."},
    {img:"img/12.jpg", text:"Halbzeit! Zeit für Schokolade."},
    {img:"img/13.jpg", text:"Freitag der 13.? Heute Glück im Advent!"},
    {img:"img/14.jpg", text:"Eine Tasse Tee und die Welt sieht besser aus."},
    {img:"img/15.jpg", text:"Nur noch 9 Tage – fühlst du’s schon? 🎄"},
    {img:"img/16.jpg", text:"Lass die Funken heute besonders hell fliegen!"},
    {img:"img/17.jpg", text:"Advent ist, wenn die Welt ein bisschen langsamer wird."},
    {img:"img/18.jpg", text:"Drei Dinge: Kekse, Decke, Lieblingsfilm."},
    {img:"img/19.jpg", text:"19 – na los, du darfst langsam hibbelig werden."},
    {img:"img/20.jpg", text:"Weihnachten rückt näher – und du bist bereit!"},
    {img:"img/21.jpg", text:"Wintersonnenwende – ab jetzt wird’s heller!"},
    {img:"img/22.jpg", text:"Zeit für das letzte Einkaufschaos. Viel Glück! 😂"},
    {img:"img/23.jpg", text:"Der Zauber liegt in der Vorfreude."},
    {img:"img/24.jpg", text:"Frohe Weihnachten! 🎄❤️"},
];

// Helper: Array mischen (Fisher-Yates)
function shuffleArray(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Kalender & Lightbox Referenzen
const calendar = document.querySelector(".calendar");
const lightbox = document.getElementById("lightbox");
const closeBtn = document.getElementById("closeBtn");
const lbMedia = document.getElementById("lightbox-media");
const lbText = document.getElementById("lightbox-text");
const openSound = document.getElementById("openSound");

// Zufällige Reihenfolge
const shuffledEntries = shuffleArray(entries);

// Türchen rendern
shuffledEntries.forEach((entry, index) => {
    // Fester Tag für LocalStorage
    const day = entries.indexOf(entry) + 1;

    const door = document.createElement("div");
    door.classList.add("door");

    const inner = document.createElement("div");
    inner.classList.add("door-inner");

    const front = document.createElement("div");
    front.classList.add("door-front");
    front.textContent = day;

    const back = document.createElement("div");
    back.classList.add("door-back");
    back.textContent = day;
    // Bild als Hintergrund
    back.style.backgroundImage = `url(${entry.img})`;
    back.style.backgroundSize = "cover";
    back.style.backgroundPosition = "center";

    // Datumsperre
    //const today = new Date(); //Deaktivieren für Testdatum
    //const currentDay = today.getMonth() === 11 ? today.getDate() : 0; //Deaktivieren für Testdatum

    // Simuliertes Datum: 11. Dezember
    const simulatedDate = new Date(); //Testdatum aktivieren
    simulatedDate.setMonth(11); // Dezember (0-basiert!)
    simulatedDate.setDate(11);  // Tag = 11

    const currentDay = simulatedDate.getDate();
    if (!TESTMODE && day > currentDay) door.classList.add("locked");

    // Bereits geöffnet? LocalStorage prüfen
    if (localStorage.getItem("door" + day) === "open") {
        door.classList.add("open");
    }

    // Tür öffnen
    door.addEventListener("click", () => {
        if (!TESTMODE && day > currentDay) {
            door.classList.add("shake");
            setTimeout(() => door.classList.remove("shake"), 400);
            return;
        }

        door.classList.add("open");
        localStorage.setItem("door" + day, "open");
        openSound.play();
        // Verzögerung Lightbox öffnen
        setTimeout(() => {
        openLightbox(entry);
    }, 300); // 300ms warten, bis Tür aufgeklappt ist
    });

    inner.appendChild(front);
    inner.appendChild(back);
    door.appendChild(inner);
    calendar.appendChild(door);

    // Pop-in Animation beim Laden
    door.style.opacity = "0";
    door.style.transform = "scale(0.5)";
    setTimeout(() => {
        door.style.transition = "all 0.5s ease";
        door.style.opacity = "1";
        door.style.transform = "scale(1)";
    }, 100 * index); // gestaffelt
});

// Lightbox öffnen mit Animation und responsiv
function openLightbox(entry) {
    lbMedia.innerHTML = "";

    // Bild oder Video einfügen
    if (entry.img.endsWith(".mp4")) {
        lbMedia.innerHTML = `<video src="${entry.img}" controls autoplay></video>`;
    } else {
        lbMedia.innerHTML = `<a href="${entry.img}" target="_blank"><img src="${entry.img}" alt=""></a>`;
    }
    lbText.textContent = entry.text;

    // Initiale Skalierung & Opazität
    lightbox.style.opacity = "0";
    lightbox.style.transform = "scale(0.9)";
    lightbox.classList.remove("hidden");

    // Animation mit requestAnimationFrame
    requestAnimationFrame(() => {
        lightbox.style.transition = "all 0.4s ease";
        lightbox.style.opacity = "1";
        lightbox.style.transform = "scale(1)";
    });

    // Größe dynamisch anpassen (Responsive)
    adjustLightboxSize();
}

// Lightbox schließen mit Animation
function closeLightbox() {
    lightbox.style.transition = "all 0.3s ease";
    lightbox.style.opacity = "0";
    lightbox.style.transform = "scale(0.9)";
    setTimeout(() => lightbox.classList.add("hidden"), 300);
}

// Dynamische Anpassung bei Resize
function adjustLightboxSize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxWidth = Math.min(600, vw * 0.9);  // max 600px oder 90% Viewport
    const maxHeight = vh * 0.9;                // max 90% Höhe
    const media = lbMedia.querySelector("img, video");
    if (media) {
        media.style.maxHeight = (vh * 0.6) + "px"; // max 60% Viewport-Höhe
    }
    const content = document.querySelector(".lightbox-content");
    content.style.width = maxWidth + "px";
    content.style.maxHeight = maxHeight + "px";
}

// Resize Event listener
window.addEventListener("resize", adjustLightboxSize);
window.addEventListener("orientationchange", adjustLightboxSize);

// Lightbox schließen
function closeLightbox() {
    lightbox.style.transition = "all 0.3s ease";
    lightbox.style.opacity = "0";
    lightbox.style.transform = "scale(0.9)";
    setTimeout(() => lightbox.classList.add("hidden"), 300);
}

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });

// Anpassung bei Resize
function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);
setVh();

// Reset Button

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
    if (confirm("Alle Türchen werden zurückgesetzt. Bist du sicher?")) {
        localStorage.clear();
        location.reload(); // Seite neu laden
    }
});
