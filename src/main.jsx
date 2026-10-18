import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown, ArrowRight, CalendarDays, Check, Clock3, Heart, MapPin,
  Menu, Music2, Pause, Play, Sparkles, Volume2, VolumeX, X
} from "lucide-react";
import "./styles.css";

const event = {
  partnerOne: "Aarav",
  partnerTwo: "Meera",
  date: "December 15, 2026",
  dateISO: "2026-12-15T10:30:00+05:30",
  ceremony: "Wedding Ceremony",
  time: "10:30 AM onwards",
  venue: "The Vizag convention Hall",
  city: "Vishakapatnam, Andhra pradesh",
  address: "",
  message: "Two hearts, one beautiful journey. We'd be delighted to celebrate this new chapter with you."
};

// Add the translations dictionary here
const translations = {
  en: {
    language: "Language",
    openInvitation: "OPEN INVITATION",
    navStory: "Our story",
    navDay: "The day",
    navGallery: "Gallery",
    navLocation: "Location",
    guestName: "Your name",
    namePlaceholder: "Enter your name",
    accepts: "Joyfully accepts",
    declines: "Regretfully declines",
    sendResponse: "SEND RESPONSE",
    thankYou: "Thank you"
  },

  te: {
    language: "భాష",
    openInvitation: "ఆహ్వానాన్ని తెరవండి",
    navStory: "మా ప్రేమకథ",
    navDay: "వేడుక రోజు",
    navGallery: "చిత్రాలు",
    navLocation: "వేదిక",
    guestName: "మీ పేరు",
    namePlaceholder: "మీ పేరును నమోదు చేయండి",
    accepts: "తప్పకుండా వస్తాను",
    declines: "రాలేకపోతున్నాను",
    sendResponse: "సమాధానం పంపండి",
    thankYou: "ధన్యవాదాలు"
  },

  hi: {
    language: "भाषा",
    openInvitation: "निमंत्रण खोलें",
    navStory: "हमारी कहानी",
    navDay: "समारोह का दिन",
    navGallery: "तस्वीरें",
    navLocation: "स्थान",
    guestName: "आपका नाम",
    namePlaceholder: "अपना नाम लिखें",
    accepts: "खुशी से आएँगे",
    declines: "आना संभव नहीं है",
    sendResponse: "जवाब भेजें",
    thankYou: "धन्यवाद"
  }
};

const photos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85"
];
const audio = {

}

function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const distance = Math.max(0, new Date(event.dateISO).getTime() - now);
  const units = [
    ["Days", Math.floor(distance / 86400000)],
    ["Hours", Math.floor((distance / 3600000) % 24)],
    ["Minutes", Math.floor((distance / 60000) % 60)],
    ["Seconds", Math.floor((distance / 1000) % 60)]
  ];
  return <div className="countdown">{units.map(([label, value]) =>
    <div className="count-unit" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
  )}</div>;
}

function Envelope({ onOpen }) {
  return (
    <motion.div className="envelope-scene" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <div className="envelope-glow" />
      <motion.button className="envelope" onClick={onOpen} aria-label="Open the invitation" whileHover={{ scale: 1.035, y: -5 }} whileTap={{ scale: 0.98 }}>
        <div className="envelope-back" />
        <div className="envelope-letter"><span className="letter-monogram">A <i>&</i> M</span><span className="letter-line" /><span className="letter-small">YOU ARE INVITED</span></div>
        <div className="envelope-left" />
        <div className="envelope-right" />
        <div className="envelope-bottom" />
        <div className="envelope-flap" />
        <div className="wax-seal"><Heart size={21} strokeWidth={1.3} /></div>
      </motion.button>
      <motion.p className="open-hint" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: Infinity }}>A little something, just for you</motion.p>
      <button className="text-button" onClick={onOpen}>OPEN INVITATION <ArrowRight size={14} /></button>
    </motion.div>
  );
}

function Invitation({ onReset, t, languageSelector }) {
  const [rsvp, setRsvp] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [galleryPhoto, setGalleryPhoto] = useState(null);
  const [musicOn, setMusicOn] = useState(false);
  const [audioElement] = useState(
    () => new Audio("/bg2.mp3")
  );

  useEffect(() => {
    audioElement.loop = true;
    audioElement.volume = 0.35;

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, [audioElement]);

  const share = async () => {
    const shareData = { title: `${event.partnerOne} & ${event.partnerTwo} — Wedding Invitation`, text: event.message, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied!");
    } else {
      alert("Copy this page URL to share the invitation.");
    }
  };

  const saveDate = () => {
    const start = "20261215T050000Z";
    const end = "20261215T090000Z";
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EverAfter//Invitation//EN\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${event.partnerOne} & ${event.partnerTwo} — Wedding\nLOCATION:${event.venue}, ${event.city}\nDESCRIPTION:${event.message}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "everafter-wedding.ics"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.main className="invitation-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }}>
      <nav className="site-nav">
        <a className="brand" href="#top" aria-label="EverAfter home"><span className="brand-mark"><Heart size={20} /></span><span>EverAfter<small>DIGITAL INVITATIONS</small></span></a>
        <div className="opening-language">
  {languageSelector}
</div>
        <div className="nav-links"><a href="#story">Our story</a><a href="#details">The day</a><a href="#gallery">Gallery</a><a href="#location">Location</a></div>
        <button className="outline-button nav-save" onClick={saveDate}>Save the date <CalendarDays size={14} /></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>TOGETHER WITH OUR FAMILIES</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: 1 }}>{event.partnerOne} <span>&</span><br />{event.partnerTwo}</motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}>INVITE YOU TO CELEBRATE OUR WEDDING</motion.p>
          <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <span><CalendarDays size={15} />{event.date}</span><span><MapPin size={15} />{event.city}</span>
          </motion.div>
          <motion.a className="scroll-cue" href="#story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}><span><ArrowDown size={15} /></span> SCROLL TO EXPLORE</motion.a>
        </div>

        <button
          className={`music-toggle ${musicOn ? "is-on" : ""}`}
          onClick={async () => {
            if (musicOn) {
              audioElement.pause();
              setMusicOn(false);
            } else {
              try {
                await audioElement.play();
                setMusicOn(true);
              } catch (error) {
                console.error("Unable to play music:", error);
                alert("Music could not play. Check that public/bg2.mp3 exists and is a valid audio file.");
              }
            }
          }}
          aria-label={musicOn ? "Turn music off" : "Turn music on"}
        >
          {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{musicOn ? "Music on" : "Music off"}</span>
        </button>

        {musicOn && (
          <div className="music-note">
            <Music2 size={13} />
          </div>
        )}

      </section>

      <section className="story-section section-wrap" id="story">
        <p className="eyebrow dark-eyebrow">A NOTE FROM OUR HEARTS</p>
        <h2>Every love story is beautiful.<br /><em>Ours is our favourite.</em></h2>
        <p className="section-copy">{event.message}</p>
        <div className="ornament"><span /><Heart size={15} /><span /></div>
        <div className="count-label">THE COUNTDOWN TO OUR FOREVER</div>
        <Countdown />
      </section>

      <section className="details-section" id="details">
        <div className="section-wrap">
          <p className="eyebrow dark-eyebrow">PLEASE JOIN US</p>
          <h2>The day we've been <em>dreaming of</em></h2>
          <div className="event-card">
            <div className="event-card-top"><span className="event-icon"><Heart size={22} /></span><p className="eyebrow dark-eyebrow">THE CELEBRATION</p><h3>{event.ceremony}</h3><p className="event-date">{event.date}</p></div>
            <div className="event-info">
              <div><CalendarDays size={18} /><span><small>DATE</small>{event.date}</span></div>
              <div><Clock3 size={18} /><span><small>TIME</small>{event.time}</span></div>
              <div><MapPin size={18} /><span><small>VENUE</small>{event.venue}<small>{event.city}</small></span></div>
            </div>
            <a className="gold-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ", " + event.city)}`} target="_blank" rel="noreferrer">GET DIRECTIONS <ArrowRight size={15} /></a>
          </div>
          <button className="text-button dark-text-button" onClick={saveDate}>ADD TO CALENDAR <CalendarDays size={14} /></button>
        </div>
      </section>

      <section className="gallery-section section-wrap" id="gallery">
        <p className="eyebrow dark-eyebrow">LITTLE MOMENTS, BIG MEMORIES</p>
        <h2>A glimpse into <em>our world</em></h2>
        <div className="gallery-grid">{photos.map((src, i) => <button className={`gallery-item gallery-item-${i + 1}`} key={src} onClick={() => setGalleryPhoto(src)} aria-label={`View photo ${i + 1}`}><img src={src} alt={`Couple memory ${i + 1}`} loading="lazy" /><span><Play size={16} fill="currentColor" /></span></button>)}</div>
      </section>

      <section className="location-section" id="location">
        <div className="location-copy"><p className="eyebrow">WE CAN'T WAIT TO SEE YOU</p><h2>Meet us where<br /><em>the magic happens.</em></h2><p>{event.venue}<br />{event.city}</p><p className="muted-address">{event.address}</p><a className="gold-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ", " + event.city)}`} target="_blank" rel="noreferrer">OPEN IN MAPS <MapPin size={15} /></a></div>
        <div className="map-panel"><div className="map-grid" /><div className="map-pin"><MapPin size={24} /></div><div className="map-caption"><strong>{event.venue}</strong><span>{event.city}</span></div></div>
      </section>

      <section className="rsvp-section section-wrap" id="rsvp">
        <p className="eyebrow dark-eyebrow">YOUR PRESENCE IS OUR PRESENT</p>
        <h2>Will you join <em>our celebration?</em></h2>
        {submitted ? <div className="rsvp-success"><Check size={24} /><h3>Thank you{guestName ? `, ${guestName}` : ""}!</h3><p>Your response has been recorded in this demo only.</p><button className="text-button dark-text-button" onClick={() => { setSubmitted(false); setRsvp(""); }}>CHANGE RESPONSE</button></div> :
          <form className="rsvp-form" onSubmit={e => { e.preventDefault(); if (rsvp) setSubmitted(true); }}>
            <label>Your name<input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Enter your name" /></label>
            <fieldset><legend>Can you make it?</legend><label className={`rsvp-option ${rsvp === "yes" ? "selected" : ""}`}><input type="radio" name="rsvp" value="yes" checked={rsvp === "yes"} onChange={e => setRsvp(e.target.value)} /> Joyfully accepts</label><label className={`rsvp-option ${rsvp === "no" ? "selected" : ""}`}><input type="radio" name="rsvp" value="no" checked={rsvp === "no"} onChange={e => setRsvp(e.target.value)} /> Regretfully declines</label></fieldset>
            <button className="gold-button" type="submit">SEND RESPONSE <ArrowRight size={15} /></button>
            <p className="form-note">Demo only: responses are not stored or sent to the hosts yet.</p>
          </form>}
      </section>

      <footer className="footer"><Heart size={17} /><p>Made with love, for a day to remember.</p><span>EVERAFTER · DIGITAL INVITATIONS</span><button className="footer-reset" onClick={onReset}>Replay the opening</button></footer>

      <AnimatePresence>{galleryPhoto && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGalleryPhoto(null)}><button aria-label="Close photo" className="lightbox-close"><X /></button><motion.img src={galleryPhoto} alt="Expanded couple memory" initial={{ scale: .94 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} /></motion.div>}</AnimatePresence>
    </motion.main>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [language, setLanguage] = useState(
  () => localStorage.getItem("everafter-language") || "en"
);

const t = translations[language] || translations.en;

useEffect(() => {
  localStorage.setItem("everafter-language", language);
  document.documentElement.lang = language;
}, [language]);

const languageSelector = (
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    aria-label={t.language}
    className="language-select"
  >
    <option value="en">English</option>
    <option value="te">తెలుగు</option>
    <option value="hi">हिन्दी</option>
  </select>
);
  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="grain" />
      <AnimatePresence mode="wait">
        {!opened ? <motion.section className="opening-screen" key="opening" exit={{ opacity: 0, scale: 1.025, filter: "blur(8px)" }} transition={{ duration: .7 }}>
          <header className="opening-brand"><span className="brand-mark"><Heart size={20} /></span><span>EverAfter<small>DIGITAL INVITATIONS</small></span></header>
          <div className="opening-language">
  {languageSelector}
</div>
          <div className="opening-copy"><p className="eyebrow">A MOMENT MADE JUST FOR YOU</p><h1>Some moments<br />deserve <em>their own story.</em></h1><p>A beautiful little surprise is waiting for you.</p></div>
          <Envelope onOpen={() => setOpened(true)} t={t} />
          <div className="opening-footer"><span>AN INVITATION TO REMEMBER</span><span>SCROLL LESS. FEEL MORE.</span></div>
        </motion.section> : <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7 }}><Invitation
  onReset={() => {
    setOpened(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  t={t}
  languageSelector={languageSelector}
/></motion.div>}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
