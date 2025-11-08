"use client";
import { useEffect, useRef, useState } from "react";

export default function StickySectionTabs({ sections }) {
  const [activeSection, setActiveSection] = useState(sections?.[0]?.id || "");
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const clickingRef = useRef(false); // prevent scroll handler race after click

  // --- Horizontal drag (desktop only) ---
  const onMouseDown = (e) => {
    if (e.button !== 0 || window.innerWidth < 640) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current.scrollLeft;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollStartX.current - dx;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // --- Click a tab -> scroll page to its section ---
  const handleClick = (sectionId) => {
    setActiveSection(sectionId);
    clickingRef.current = true;

    const el =
  document.getElementById(`section-${sectionId}`) ||
  document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!el) return;

    requestAnimationFrame(() => {
      const header = document.querySelector("header");
      const tabs = document.querySelector(".tabs-sticky");
      const totalOffset = (header?.offsetHeight || 0) + (tabs?.offsetHeight || 0) + 15;

      const y = el.getBoundingClientRect().top + window.scrollY - totalOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Re-enable IO after smooth scroll
      setTimeout(() => {
        clickingRef.current = false;
      }, 500);
    });
  };

  // --- Observe sections while scrolling and update active tab ---
useEffect(() => {
  if (!sections?.length) return;

  const header = document.querySelector("header");
  const tabs = document.querySelector(".tabs-sticky");
  const offset = (header?.offsetHeight || 0) + (tabs?.offsetHeight || 0) + 16;

const bottomSlackPx = 120; // allows last section to trigger even at the bottom
const observer = new IntersectionObserver(
  (entries) => {
    if (clickingRef.current) return;

    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (visible) {
      const el = visible.target;
      const idFromData = el.dataset.sectionId;
      const id =
        idFromData ||
        (el.id && el.id.startsWith("section-") ? el.id.replace("section-", "") : "");
      if (id) setActiveSection(String(id));
    }
  },
  {
    root: null,
    rootMargin: `-${offset}px 0px -${bottomSlackPx}px 0px`,
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }
);




  // Try to bind immediately; if headers aren't in the DOM yet, wait for them.
  const bindIfReady = () => {
    const found = sections
      .map(
        (s) =>
          document.getElementById(`section-${s.id}`) ||
          document.querySelector(`[data-section-id="${s.id}"]`)
      )
      .filter(Boolean);

   found.forEach((el) => observer.observe(el)); 
    return found.length > 0; // at least some sections present
  };

  let mo;
  if (!bindIfReady()) {
    mo = new MutationObserver(() => {
      if (bindIfReady()) {
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

return () => {
  observer.disconnect(); // ✅ fix variable name
  if (mo) mo.disconnect();
};
}, [sections]);


  // --- Keep the active tab centered in the horizontal scroller ---
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(".sticky-tab.active");
    if (activeBtn?.scrollIntoView) {
      activeBtn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <div className="sticky max-w-7xl mx-auto sm:px-4 z-40 top-[75px] md:top-[60px] lg:top-[65px]">
      <nav className="tabs-sticky max-w-7xl mx-auto bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-sm rounded-lg py-3">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar lg:px-12 px-4 gap-4 lg:justify-center"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging.current ? "grabbing" : "grab", userSelect: "none" }}
        >
          <div className="shrink-0 lg:w-115 xl:w-240" aria-hidden="true" />
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`px-3 py-2 whitespace-nowrap sticky-tab ${
                String(activeSection) === String(section.id) ? "active" : ""
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
