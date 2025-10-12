import Link from "next/link";
import Image from 'next/image';
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { assetUrl } from "@/lib/utils";
import {
  CalendarDaysIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  HeartIcon,
  GiftTopIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Events",
  description: "Discover all the special events for Incia & Arvin's wedding celebration - Mehndi, Wedding Ceremony, Reception, and After-party in Vietnam.",
  openGraph: {
    title: "Wedding Events | Incia & Arvin's Wedding",
    description: "Discover all the special events for Incia & Arvin's wedding celebration",
    images: ['/images/event/Reception.jpeg'],
  },
};

export default function EventsPage() {
  type EventItem = {
    id: number;
    title: string;
    date: string;
    time?: string;
    venue: string;
    address?: string[];
    location?: string;
    description?: string;
    dressCode?: string;
    type: 'holud' | 'akdh' | 'reception';
  };
  // Helpers: build address string, maps URL, and ICS calendar content safely on the server
  const addressString = (venue?: string, address?: string[] | undefined) => {
    const parts = [venue, ...(address || [])].filter(Boolean) as string[];
    return parts.join(", ");
  };

  // Helper: convert strings to Title Case for improved readability
  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/\b([a-z])(\w*)/g, (_, f: string, r: string) => f.toUpperCase() + r)
      // preserve common connectors in lowercase (e.g., of, and, to) except at start
      .replace(/\b(Of|And|To|On|At|In|By|For|With)\b/g, (m) => m.toLowerCase());

  const toIcsDateTime = (date: string, time?: string): { start: string; end?: string } => {
    // time examples: "4:00 PM onwards", "7:00 PM"
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    const base = date.replaceAll("-", ""); // YYYYMMDD
    if (!time) return { start: `${base}T090000` }; // default 9 AM

    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return { start: `${base}T090000` };
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    const startH = pad(hour);
    const startM = pad(minute);
    const start = `${base}T${startH}${startM}00`;

    // Provide an end time (2h after start) if not "onwards"
    if (/onwards/i.test(time)) {
      return { start };
    }
    let endHour = hour + 2;
    let endDate = base;
    if (endHour >= 24) {
      endHour -= 24;
      // naive day rollover; sufficient for these single-day events
      const d = new Date(`${date}T00:00:00`);
      d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      endDate = `${yyyy}${mm}${dd}`;
    }
    const end = `${endDate}T${pad(endHour)}${startM}00`;
    return { start, end };
  };

  const buildIcsDataUri = (title: string, date: string, time: string | undefined, venue?: string, address?: string[]) => {
    const times = toIcsDateTime(date, time);
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    const dtstamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const loc = addressString(venue, address).replace(/\n/g, ", ");
    const uid = `${title.replace(/\s+/g, '-')}-${date}@inciaandarvins.wedding`;
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sharothee Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${times.start}`,
      ...(times.end ? [`DTEND:${times.end}`] : []),
      `SUMMARY:${title}`,
      `LOCATION:${loc}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    const ics = lines.join('\r\n');
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  };
  const events: EventItem[] = [
    {
      id: 1,
      title: "Holud",
      date: "2025-12-16",
      time: "4:00 PM onwards",
      venue: "FORTIS PLATINUM LOUNGE",
      address: [
        "NEAR TO ADAMJEE CANTONMENT PUBLIC SCHOOL & COLLEGE",
        "JOLSHIRI, PURBACHAL, DHAKA-1216"
      ],
      description: "",
      dressCode: "",
      type: "holud"
    },
    {
      id: 2,
      title: "Akdh",
      date: "2025-12-17",
      time: "7:00 PM",
      venue: "SHERATON DHAKA — Sheraton Grand Ballroom (Level 12)",
      address: [
        "44 KEMAL ATATURK AVENUE, BANANI",
        "DHAKA 1213, BANGLADESH"
      ],
      description: "",
      dressCode: "",
      type: "akdh"
    },
    {
      id: 3,
      title: "Grand Reception",
      date: "2025-12-18",
      time: "7:00 PM",
      venue: "BANGLADESH-CHINA FRIENDSHIP CONFERENCE CENTRE (BCFCC)",
      address: [
        "AGARGAON, SHER-E-BANGLA NAGAR",
        "DHAKA-1209"
      ],
      description: "",
      dressCode: "",
      type: "reception"
    }
  ];

  const getEventIcon = (type: string): React.ElementType => {
    switch (type) {
      case 'holud': return SparklesIcon;
      case 'akdh': return HeartIcon;
      case 'reception': return GiftTopIcon;
      default: return SparklesIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wedding">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-secondary mb-4 sm:mb-6">
            Wedding Events
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Join us for a series of beautiful celebrations as we begin our journey together as husband and wife.
          </p>
        </div>
      </section>


      {/* Events Timeline */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {events.map((event, index) => (
              <div key={event.id} id={`event-${event.type}`} className="relative" data-testid="event-timeline-item">
                {/* Timeline Line */}
                {index < events.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 top-32 w-0.5 h-24 bg-primary/30"></div>
                )}
                
                <div className={`grid lg:grid-cols-2 gap-6 lg:gap-8 items-center ${
                  index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  {/* Event Details */}
                  <div className={`${index % 2 === 0 ? '' : 'lg:col-start-2'}`}>
                    <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-black/5 hover:ring-primary/20 focus-within:ring-primary/30" data-testid="event-card">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 gap-3">
                        <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden data-testid="event-icon">
                          {(() => { const Icon = getEventIcon(event.type); return <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />; })()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-secondary mb-2 truncate">
                            {event.title}
                          </h3>
                          <div className="flex items-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                              <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
                              {/* Mobile: short date + time */}
                              <span className="sm:hidden">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {event.time ? ` · ${event.time}` : ''}
                              </span>
                              {/* Desktop: full date + time with proper semantics */}
                              <span className="hidden sm:inline">
                                <time dateTime={event.date}>
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </time>
                                {event.time ? (
                                  <>
                                    {' '}·{' '}
                                    <time dateTime={(() => { const m = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i); if(!m) return ''; const hh = parseInt(m[1],10) % 12 + (m[3].toUpperCase()==='PM'?12:0); return `${String(hh).padStart(2,'0')}:${m[2]}`; })()}>{event.time}</time>
                                  </>
                                ) : null}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="flex items-start">
                          <span className="text-primary mr-3 flex-shrink-0" aria-hidden>
                            <MapPinIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="font-semibold text-secondary tracking-wide uppercase text-base sm:text-lg leading-snug">{event.venue}</p>
                            <address className="not-italic space-y-0.5 mt-0.5">
                              {Array.isArray(event.address) && event.address.length > 0 ? (
                                event.address.map((line, i) => (
                                  <p key={i} className="text-gray-700 text-sm sm:text-base leading-relaxed">{toTitleCase(line)}</p>
                                ))
                              ) : event.location ? (
                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{toTitleCase(event.location)}</p>
                              ) : null}
                            </address>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString(event.venue, event.address))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${event.venue} in Google Maps`}
                                className="inline-flex items-center gap-1.5 text-primary text-xs sm:text-sm font-medium rounded-full border border-primary/30 px-3 py-1.5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
                              >
                                <MapPinIcon className="h-4 w-4" aria-hidden="true" /> Get Directions <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                              </a>
                              <a
                                href={buildIcsDataUri(event.title, event.date, event.time, event.venue, event.address)}
                                download={`${event.title.replace(/\s+/g,'-')}-${event.date}.ics`}
                                aria-label={`Add ${event.title} on ${new Date(event.date).toLocaleDateString('en-US')} to your calendar`}
                                className="inline-flex items-center gap-1.5 text-primary text-xs sm:text-sm font-medium rounded-full border border-primary/30 px-3 py-1.5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
                              >
                                <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" /> Add to Calendar (.ics)
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          {/* Dress code removed as requested */}
                        </div>
                      </div>
                      
                      <p className="text-muted leading-relaxed mb-0 text-sm sm:text-base">
                        {/* Description removed as requested */}
                      </p>
                      
                    </div>
                  </div>
                  
                  {/* Event Image (use provided photos for Holud & Akdh; fallback to placeholder) */}
                  <div className={`${index % 2 === 0 ? '' : 'lg:col-start-1'} order-first lg:order-none`}>
                    {(() => {
                      const mapping: Record<string, string | null> = {
                        holud: 'Holud.jpeg',
                        akdh: 'Akdh.jpeg',
                        reception: 'Reception.jpeg',
                      };
                      const img = mapping[event.type];
                      if (img) {
                        return (
                          <div className="relative rounded-xl overflow-hidden h-48 sm:h-56 lg:h-64 shadow-lg">
                            <Image
                              src={assetUrl(`/images/event/${img}`)}
                              alt={`${event.title} photo`}
                              fill
                              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                              style={{ objectFit: 'cover' }}
                              className="rounded-xl will-change-transform"
                            />
                          </div>
                        );
                      }

                      return (
                        <div className="bg-gradient-to-br from-accent to-cream-200 rounded-xl h-48 sm:h-56 lg:h-64 flex items-center justify-center shadow-lg">
                          <div className="text-center text-primary">
                            {(() => { const Icon = getEventIcon(event.type); return <Icon className="h-10 w-10 sm:h-12 sm:w-12 inline-block mb-2 sm:mb-4" aria-hidden="true" />; })()}
                            <p className="text-muted font-medium text-sm sm:text-base">{event.title} Photo</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streaming Info */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-secondary mb-4 sm:mb-6">
            Can&apos;t Make It? Join Us Online
          </h2>
          <p className="text-muted mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We understand not everyone can travel to be with us in person. We&apos;ll be live streaming key moments 
            so you can still be part of our special day.
          </p>
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl max-w-sm sm:max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="mb-3 sm:mb-4 flex justify-center">
              <TvIcon className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg sm:text-xl">Live Stream Available</h3>
            <p className="text-xs sm:text-sm text-muted mb-4 sm:mb-6">Wedding ceremony and reception will be broadcast live</p>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
              Get Stream Link
            </button>
          </div>
        </div>
      </section>

      {/* RSVP CTA */}
      <section className="py-12 sm:py-16 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-secondary mb-4 sm:mb-6">
            Ready to Celebrate With Us?
          </h2>
          <p className="text-muted mb-6 sm:mb-8 text-sm sm:text-base">
            Let us know which events you&apos;ll be attending so we can plan accordingly.
          </p>
          <Link 
            href="/rsvp"
            className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block text-sm sm:text-base"
          >
            RSVP Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}