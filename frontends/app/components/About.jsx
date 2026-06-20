"use client";

import Link from "next/link";
import { MapPin, Clock, Phone, Mail, ArrowRight, Heart, Leaf, Flame } from "lucide-react";

const teamMembers = [
  {
    name: "Ayeni Opeyemi ",
    role: "Head Chef",
    bio: "15 years of culinary experience, trained in Lagos and London. Passionate about bringing authentic Nigerian flavours to every plate.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ngozi Okafor",
    role: "Restaurant Manager",
    bio: "Ensures every customer leaves with a smile. Ngozi brings warmth and professionalism to every dining experience.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Emeka Chukwu",
    role: "Pastry Chef",
    bio: "Our dessert maestro. Emeka crafts every sweet dish with precision and a touch of creativity that keeps customers coming back.",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
];

const hours = [
  { day: "Monday – Friday",  time: "9:00 AM – 10:00 PM" },
  { day: "Saturday",         time: "8:00 AM – 11:00 PM" },
  { day: "Sunday",           time: "10:00 AM – 9:00 PM" },
];

const values = [
  { icon: Leaf,  title: "Fresh Always",     desc: "Every ingredient is sourced fresh daily. No shortcuts, no compromise." },
  { icon: Heart, title: "Made With Love",   desc: "We cook every dish as if it's for family — because our customers are." },
  { icon: Flame, title: "Bold Flavours",    desc: "Authentic Nigerian recipes with a modern twist that excites your palate." },
];

export default function AboutPage() {
  return (
    <main>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative w-full h-72 sm:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
          alt="ChowDesk restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-(family-name:--font-headline) text-3xl sm:text-5xl font-extrabold text-white mb-3">
            Our Story
          </h1>
          <p className="font-(family-name:--font-body) text-white/80 text-sm sm:text-lg max-w-xl">
            Born from a love of food, community, and the belief that great meals bring people together.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-(family-name:--font-body) text-sm text-(--color-primary) font-semibold uppercase tracking-wider mb-3">
              Who We Are
            </p>
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              ChowDesk Started in a Home Kitchen
            </h2>
            <p className="font-(family-name:--font-body) text-gray-500 leading-relaxed mb-4">
              ChowDesk was born in 2022 when our founder, frustrated that Lagos had no easy way to order quality homestyle food online, decided to build a solution — starting with a kitchen, a WhatsApp group, and a handful of loyal customers.
            </p>
            <p className="font-(family-name:--font-body) text-gray-500 leading-relaxed mb-6">
              What started as a passion project quickly became a full restaurant experience. Today we serve hundreds of customers daily, delivering fresh, boldly flavoured meals and drinks to homes and offices across Lagos.
            </p>
            <Link
              href="/foodspage"
              className="inline-flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
            >
              View Our Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80"
              alt="Our kitchen"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────── */}
      <section className="bg-(--color-primary)/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              What We Stand For
            </h2>
            <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
              These arent just words on a wall — they guide every dish we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-(--color-primary)/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-(--color-primary)" />
                  </div>
                  <h3 className="font-(family-name:--font-headline) text-base font-bold text-gray-900 mb-1.5">
                    {v.title}
                  </h3>
                  <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Meet the Team
          </h2>
          <p className="font-(family-name:--font-body) text-gray-500 text-sm sm:text-base">
            The people behind every great meal you enjoy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-(--color-primary)/20 shadow">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-(family-name:--font-headline) text-base font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="font-(family-name:--font-body) text-xs text-(--color-primary) font-semibold mb-2">
                {member.role}
              </p>
              <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              A Taste of What We Do
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIT US ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Info */}
          <div>
            <h2 className="font-(family-name:--font-headline) text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
              Visit Us
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-(--color-primary)" />
                </div>
                <div>
                  <p className="font-(family-name:--font-body) text-sm font-semibold text-gray-900 mb-0.5">Location</p>
                  <p className="font-(family-name:--font-body) text-sm text-gray-500">
                    12 Admiralty Way, Lekki Phase 1<br />Lagos, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-(--color-primary)" />
                </div>
                <div>
                  <p className="font-(family-name:--font-body) text-sm font-semibold text-gray-900 mb-1.5">Opening Hours</p>
                  <div className="flex flex-col gap-1">
                    {hours.map((h) => (
                      <div key={h.day} className="flex items-center justify-between gap-6 text-sm font-(family-name:--font-body)">
                        <span className="text-gray-500">{h.day}</span>
                        <span className="text-gray-900 font-medium">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-(--color-primary)" />
                </div>
                <div>
                  <p className="font-(family-name:--font-body) text-sm font-semibold text-gray-900 mb-0.5">Phone</p>
                  <p className="font-(family-name:--font-body) text-sm text-gray-500">+234 903 338 3479</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-(--color-primary)/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-(--color-primary)" />
                </div>
                <div>
                  <p className="font-(family-name:--font-body) text-sm font-semibold text-gray-900 mb-0.5">Email</p>
                  <p className="font-(family-name:--font-body) text-sm text-gray-500">hello@chowdesk.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-72 sm:h-full min-h-64 bg-gray-100 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.4731!3d6.4316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjUnNTMuOCJOIDPCsDI4JzIzLjIiRQ!5e0!3m2!1sen!2sng!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ChowDesk Location"
            />
          </div>
        </div>
      </section>

    </main>
  );
}