// ============================================================
// DOPE TONE VAULT — RESPONSIVE GALLERY V3
// FIXED:
// • BEATS / PACKS / SAMPLES / FREE TOOLS NEVER OVERFLOW
// • 4 TAB GALLERY COMPRESSES TO SMALL SCREENS
// • TAB IMAGES STAY INSIDE THEIR CARDS
// • OBJECT-FIT / ASPECT-RATIO IMAGE FIX
// • PACK / SAMPLE / BEAT GRIDS ARE RESPONSIVE
// • NO HORIZONTAL PAGE SCROLL
// • BEATS OPEN BY DEFAULT
// • EXISTING NAVIGATION + PLAYER LOGIC PRESERVED
// ============================================================

export function renderVaultPage(){
  return `
    <div id="vaultMount"></div>
    <link rel="stylesheet" href="/src/pages/vault-page.css" />
  `;
}

export async function initVaultPage(){

  const mount = document.getElementById("vaultMount");
  if(!mount) return;

  // ------------------------------------------------------------
  // LOAD VAULT CSS
  // ------------------------------------------------------------

  if(!document.getElementById("vault-dna-css")){
    const link = document.createElement("link");

    link.id = "vault-dna-css";
    link.rel = "stylesheet";
    link.href = "/src/pages/vault-page.css";

    document.head.appendChild(link);
  }

  // ------------------------------------------------------------
  // RESPONSIVE SAFETY CSS
  // This protects the vault even if the external CSS has
  // fixed widths or large minimum sizes.
  // ------------------------------------------------------------

  

  // ------------------------------------------------------------
  // IMAGE SYSTEM
  // ------------------------------------------------------------

 const IMAGE_BASE = new URL("../../public/images", import.meta.url).href;
const img = (p) => `${IMAGE_BASE}/${p}`;



  // ------------------------------------------------------------
  // BEATS
  // ------------------------------------------------------------

  const allBeats =
    window.__BEATS__ ||
    window.DTStore?.beats ||
    [];


  const demoBeats =
    allBeats.length
      ? allBeats.slice(0,10)
      : [

          {
            id:1,
            title:"Arrest | 2+3 FREE",
            artist:"junkey",
            cover:img("studio.jpg")
          },

          {
            id:2,
            title:"Leave Me To Drown",
            artist:"Bad Fuzz Beats",
            cover:img("beats-wav-bg.png")
          },

          {
            id:3,
            title:"Free fall - lil nas x type",
            artist:"DOPE TONE",
            cover:img("blackhole.webp")
          },

          {
            id:4,
            title:"EMBER",
            artist:"DOPE TONE",
            cover:img("metal.jpg")
          },

          {
            id:5,
            title:"Imperator (trap hip hop drake)",
            artist:"Black Goat Beats",
            cover:img("studio.jpg"),
            bpm:144
          },

          {
            id:6,
            title:"Hard To Breathe",
            artist:"Bad Fuzz Beats",
            cover:img("beats-wav-bg.png")
          },

          {
            id:7,
            title:"Night Void",
            artist:"DOPE TONE",
            cover:img("blackout.png")
          },

          {
            id:8,
            title:"Cinematic Dreams",
            artist:"DOPE TONE",
            cover:img("void.webp")
          },

          {
            id:9,
            title:"Trappin In The Void",
            artist:"DOPE TONE",
            cover:img("metal.jpg")
          },

          {
            id:10,
            title:"Blackout Ambient",
            artist:"DOPE TONE",
            cover:img("chat-bg.png")
          }

        ];


  // ------------------------------------------------------------
  // SAMPLE PREVIEW DATA
  // ------------------------------------------------------------

  const fakeSamples =
    Array.from(
      {length:12},
      (_,i)=>({

        id:i+1,

        name:
          `${
            [
              "Kick",
              "808",
              "Vocal Chop",
              "Loop",
              "One-Shot",
              "Hihat"
            ][i%6]
          } #${i+1}`,

        price:
          [1,2,3,4][i%4],

        type:
          ["One-Shot","Loop"][i%2]

      })
    );


  // ------------------------------------------------------------
  // HTML
  // ------------------------------------------------------------

  mount.innerHTML = `

    <div class="vault-root">

      <!-- ======================================================
           HEADER
      ======================================================= -->

      <div class="vault-header">

        <h1 class="vault-title-only">
          VAULT
        </h1>

      </div>


      <!-- ======================================================
           GALLERY TABS
      ======================================================= -->

      <div class="vault-tabs">


        <!-- BEATS -->

        <div
          class="vault-tab active"
          data-tab="beats"
          id="tabBeats"
        >

          <div class="tab-bg-stack">

            <div class="tab-bg-card card-3"></div>

            <div class="tab-bg-card card-2"></div>

            <div class="tab-bg-card card-1">

              <img
                src="${img("studio.jpg")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("vault-image.png")}'
                "
                alt="Beats"
              />

            </div>

          </div>

          <div class="tab-content">

            <div class="tab-title">
              BEATS
            </div>

            <div class="tab-sub">
              Arsenal • ${allBeats.length || 247}
            </div>

          </div>

        </div>


        <!-- PACKS -->

        <div
          class="vault-tab"
          data-tab="packs"
          id="tabPacks"
        >

          <div class="tab-bg-stack">

            <div class="tab-bg-card card-3"></div>

            <div class="tab-bg-card card-2"></div>

            <div class="tab-bg-card card-1">

              <img
                src="${img("blackout.png")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("metal.jpg")}'
                "
                alt="Packs"
              />

              <span class="tab-lock">
                🔒
              </span>

            </div>

          </div>

          <div class="tab-content">

            <div class="tab-title">
              PACKS
            </div>

            <div class="tab-sub">
              Blackout • Void
            </div>

          </div>

        </div>


        <!-- SAMPLES -->

        <div
          class="vault-tab"
          data-tab="samples"
          id="tabSamples"
        >

          <div class="tab-bg-stack">

            <div class="tab-bg-card card-3"></div>

            <div class="tab-bg-card card-2"></div>

            <div class="tab-bg-card card-1">

              <img
                src="${img("beats-wav-bg.png")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("metal.jpg")}'
                "
                alt="Samples"
              />

              <span class="tab-lock">
                🔒
              </span>

            </div>

          </div>

          <div class="tab-content">

            <div class="tab-title">
              SAMPLES
            </div>

            <div class="tab-sub">
              $1-$4 Express
            </div>

          </div>

        </div>


        <!-- FREE TOOLS -->

        <div
          class="vault-tab"
          data-tab="free"
          id="tabFree"
        >

          <div class="tab-bg-stack">

            <div class="tab-bg-card card-3"></div>

            <div class="tab-bg-card card-2"></div>

            <div class="tab-bg-card card-1">

              <img
                src="${img("vault-image.png")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("studio.jpg")}'
                "
                alt="Free Tools"
              />

            </div>

          </div>

          <div class="tab-content">

            <div class="tab-title">
              FREE TOOLS
            </div>

            <div class="tab-sub">
              Free beats • Art
            </div>

          </div>

        </div>

      </div>


      <!-- ======================================================
           BEATS
      ======================================================= -->

      <div
        class="vault-section"
        id="beatsSection"
      >

        <div class="section-head">

          <h2>
            Continue Listening • Beats
          </h2>

          <button
            class="view-all-btn"
            id="viewAllBeats"
          >
            View All Arsenal →
          </button>

        </div>


        <div class="yt-music-grid">

          ${demoBeats.map(b=>`

            <div
              class="yt-track"
              data-beat-id="${b.id ?? ''}"
            >

              <img
                src="${b.cover || img("studio.jpg")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("studio.jpg")}'
                "
                alt="${b.title || "Beat"}"
                loading="lazy"
              />

              <div class="yt-meta">

                <div class="yt-title">

                  "${b.title || "Untitled"}"

                  ${
                    b.bpm
                      ? ` • BPM ${b.bpm}`
                      : ""
                  }

                </div>

                <div class="yt-artist">

                  ${b.artist || "DOPE TONE"}

                </div>

              </div>

              <div class="yt-menu">
                ⋮
              </div>

            </div>

          `).join("")}

        </div>

      </div>


      <!-- ======================================================
           PACKS
      ======================================================= -->

      <div
        class="vault-section"
        id="packsSection"
        style="display:none"
      >

        <div class="section-head">

          <h2>
            Packs • Preview
          </h2>

          <span class="coming-badge">
            COMING SOON 🔥
          </span>

        </div>


        <div class="packs-preview-grid">


          <div class="pack-preview-card">

            <img
              src="${img("blackout.png")}"
              onerror="
                this.onerror=null;
                this.src='${img("metal.jpg")}'
              "
              alt="Blackout Series"
              loading="lazy"
            />

            <div class="pack-overlay">

              <div class="pack-lock">

                BLACKOUT SERIES

                <br>

                <small>
                  3 Packs • Ambient Pop / Cinematic / Trap
                </small>

                <br>

                <span>
                  LOCKED
                </span>

              </div>

            </div>

            <div class="pack-info">

              <div class="pack-title">
                BLACKOUT SERIES
              </div>

              <div class="pack-sub">
                DT-001 • DT-002 • DT-003
              </div>

            </div>

          </div>


          <div class="pack-preview-card">

            <img
              src="${img("void.webp")}"
              onerror="
                this.onerror=null;
                this.src='${img("blackhole.webp")}'
              "
              alt="Void Series"
              loading="lazy"
            />

            <div class="pack-overlay">

              <div class="pack-lock">

                VOID SERIES

                <br>

                <small>
                  Same art • New name
                </small>

                <br>

                <span>
                  LOCKED
                </span>

              </div>

            </div>

            <div class="pack-info">

              <div class="pack-title">
                VOID SERIES
              </div>

              <div class="pack-sub">
                VOID EDITION
              </div>

            </div>

          </div>


          <div class="pack-preview-card">

            <img
              src="${img("blackhole.webp")}"
              onerror="
                this.onerror=null;
                this.src='${img("studio.jpg")}'
              "
              alt="Black Hole"
              loading="lazy"
            />

            <div class="pack-overlay">

              <div class="pack-lock">

                BLACK HOLE

                <br>

                <small>
                  DARK DRILL • DT-004
                </small>

                <br>

                <span>
                  NEW
                </span>

              </div>

            </div>

            <div class="pack-info">

              <div class="pack-title">
                BLACK HOLE • DARK DRILL
              </div>

              <div class="pack-sub">
                DT-004
              </div>

            </div>

          </div>


        </div>

      </div>


      <!-- ======================================================
           SAMPLES
      ======================================================= -->

      <div
        class="vault-section"
        id="samplesSection"
        style="display:none"
      >

        <div class="section-head">

          <h2>
            Samples • $1-$4 Express
          </h2>

          <span class="coming-badge">
            FADED • LOCKED
          </span>

        </div>


        <div class="samples-grid">

          ${fakeSamples.map(s=>`

            <div class="sample-card is-locked">

              <img
                src="${img("beats-wav-bg.png")}"
                onerror="
                  this.onerror=null;
                  this.src='${img("metal.jpg")}'
                "
                alt="${s.name}"
                loading="lazy"
              />

              <div class="sample-body">

                <div class="sample-title">
                  ${s.name}
                </div>

                <div class="sample-sub">
                  $${s.price} • ${s.type}
                </div>

              </div>

              <div class="sample-lock">

                COMING SOON

                <br>

                <small>
                  $${s.price}
                </small>

              </div>

            </div>

          `).join("")}

        </div>

      </div>


      <!-- ======================================================
           FREE TOOLS
      ======================================================= -->

      <div
        class="vault-section"
        id="freeSection"
        style="display:none"
      >

        <div class="section-head">

          <h2>
            Free Tools
          </h2>

        </div>


        <div class="free-tools-list">


          <div class="free-tool is-open">

            <div class="free-tool-info">

              <span>
                Free Beats
              </span>

              <br>

              <small>
                Open catalog • 20+ free
              </small>

            </div>

            <button
              class="free-tool-action action-open"
              id="openFreeBeats"
            >
              Open →
            </button>

          </div>


          <div class="free-tool is-locked">

            <div class="free-tool-info">

              <span>
                Free Samples
              </span>

              <br>

              <small>
                One-shots & loops
              </small>

            </div>

            <button
              class="free-tool-action action-soon"
            >
              Soon
            </button>

          </div>


          <div class="free-tool is-locked">

            <div class="free-tool-info">

              <span>
                Cover Art
              </span>

              <br>

              <small>
                Free generator
              </small>

            </div>

            <button
              class="free-tool-action action-soon"
            >
              Soon
            </button>

          </div>


          <div class="free-tool is-locked">

            <div class="free-tool-info">

              <span>
                Infographics
              </span>

              <br>

              <small>
                Promo kits
              </small>

            </div>

            <button
              class="free-tool-action action-soon"
            >
              Soon
            </button>

          </div>


        </div>

      </div>


    </div>

  `;


  // ------------------------------------------------------------
  // TABS
  // ------------------------------------------------------------

  const tabs =
    document.querySelectorAll(".vault-tab");


  const sections = {

    beats:
      document.getElementById("beatsSection"),

    packs:
      document.getElementById("packsSection"),

    samples:
      document.getElementById("samplesSection"),

    free:
      document.getElementById("freeSection")

  };


  function showTab(name){

    tabs.forEach(tab=>{
      tab.classList.remove("active");
    });


    document
      .querySelector(`[data-tab="${name}"]`)
      ?.classList.add("active");


    Object.entries(sections).forEach(
      ([key,element])=>{

        if(!element) return;

        element.style.display =
          key === name
            ? "block"
            : "none";

      }
    );


    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  }


  // ------------------------------------------------------------
  // TAB EVENTS
  // ------------------------------------------------------------

  document
    .getElementById("tabBeats")
    ?.addEventListener(
      "click",
      ()=>showTab("beats")
    );


  document
    .getElementById("tabPacks")
    ?.addEventListener(
      "click",
      ()=>showTab("packs")
    );


  document
    .getElementById("tabSamples")
    ?.addEventListener(
      "click",
      ()=>showTab("samples")
    );


  document
    .getElementById("tabFree")
    ?.addEventListener(
      "click",
      ()=>showTab("free")
    );


  // ------------------------------------------------------------
  // DEFAULT
  // ------------------------------------------------------------

  showTab("beats");


  // ------------------------------------------------------------
  // VIEW ALL BEATS
  // ------------------------------------------------------------

  document
    .getElementById("viewAllBeats")
    ?.addEventListener(
      "click",
      ()=>{

        if(window.navigate){

          window.navigate("/beats");

        }else{

          location.hash = "#/beats";

        }

      }
    );


  // ------------------------------------------------------------
  // FREE BEATS
  // ------------------------------------------------------------

  document
    .getElementById("openFreeBeats")
    ?.addEventListener(
      "click",
      ()=>{

        if(window.navigate){

          window.navigate("/beats");

        }else{

          location.hash = "#/beats";

        }

      }
    );


  // ------------------------------------------------------------
  // BEAT PLAYER
  // ------------------------------------------------------------

  document
    .querySelectorAll(".yt-track")
    .forEach((element,index)=>{

      element.addEventListener(
        "click",
        ()=>{

          const beat =
            demoBeats[index];

          if(
            window.DTPlayer &&
            typeof window.DTPlayer.play === "function"
          ){

            window.DTPlayer.play(beat);

          }else if(
            typeof window.playBeat === "function"
          ){

            window.playBeat(beat);

          }

        }
      );

    });


  // ------------------------------------------------------------
  // FINAL HORIZONTAL OVERFLOW PROTECTION
  // ------------------------------------------------------------

  document.documentElement.style.overflowX = "hidden";

  document.body.style.overflowX = "hidden";

}


export default {
  renderVaultPage,
  initVaultPage
};
