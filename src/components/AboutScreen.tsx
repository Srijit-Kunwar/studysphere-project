import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  ShieldCheck,
  Zap,
  Wifi,
  Users,
  Target,
  Heart,
} from 'lucide-react';
import { StudySphereLogo } from './StudySphereLogo';

interface AboutScreenProps {
  onBack: () => void;
  onShowToast?: (title: string, desc?: string) => void;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Sapiya Subba',
    role: 'CEO',
    initials: 'SS',
    bio: 'Leading strategic expansion & workspace partnerships across Eastern Nepal.',
  },
  {
    name: 'Srijit Kunwar',
    role: 'CTO',
    initials: 'SK',
    bio: 'Architecting real-time desk availability, IoT power monitoring & web platform.',
  },
  {
    name: 'Sandesh Sitoula',
    role: 'CFO',
    initials: 'SS',
    bio: 'Managing regional finance, digital wallet integrations, and hub unit economics.',
  },
  {
    name: 'Sandeep Bhattarai',
    role: 'CPO',
    initials: 'SB',
    bio: 'Designing peaceful acoustic pods, ergonomic furniture standards, and product UX.',
  },
  {
    name: 'Suman Darnal',
    role: 'Marketing Lead',
    initials: 'SD',
    bio: 'Building student ambassador networks and university outreach in Jhapa district.',
  },
  {
    name: 'Shahil Dungamali',
    role: 'Operations & Community Lead',
    initials: 'SD',
    bio: 'Overseeing venue verification, host standards, and student community events.',
  },
];

export function AboutScreen({ onBack, onShowToast }: AboutScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 md:pb-16 text-[#1B2A22] font-['Poppins',sans-serif]">
      {/* Sticky Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E5E1] py-3.5 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            id="about-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1B4332] p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-[#1B4332]">StudySphere Nepal</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E5E1] shadow-sm text-center relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/40 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B4332] text-white shadow-md ring-4 ring-emerald-900/10 mb-2 p-3">
              <StudySphereLogo className="w-full h-full" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1B4332] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                About StudySphere
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1B4332] tracking-tight font-serif pt-1">
                Your Space. Your Focus.
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
                Affordable, technology-enabled study hubs for students, freelancers, and professionals in Nepal.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Founded in Birtamode, Jhapa</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>100% Solar & Inverter Backed</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dual Optical Fiber</span>
              </span>
            </div>
          </div>
        </div>

        {/* Our Purpose & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E5E1] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B4332] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Distraction-Free Sanctuary</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Designed specifically for exam prep, deep programming, research, and remote work without coffee shop noise or home disruptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E5E1] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Verified Quality & Safety</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every partner venue undergoes strict audit checks for acoustic isolation, power backup, CCTV security, and ergonomic seating.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E5E1] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Student-First Accessibility</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Transparent hourly pricing, verified 20% student subsidies, and instant digital payments via eSewa and Khalti.
            </p>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Leadership & Creators
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B4332] font-serif">
                Meet the Team
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              The passionate minds building Nepal's premier focus network
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={member.name}
                id={`team-card-${idx}`}
                className="bg-white p-5 rounded-2xl border border-[#E5E5E1] shadow-xs hover:border-[#1B4332] hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  {/* Initial-only Avatar Circle in Forest Green */}
                  <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs ring-2 ring-emerald-900/10 group-hover:scale-105 group-hover:bg-[#2D6A4F] transition-all">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#1B4332] transition-colors">
                      {member.name}
                    </h3>
                    <span className="inline-block text-[11px] font-semibold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {member.role}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Contact Footer Box */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332]">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Built with pride in Birtamode, Jhapa, Nepal</span>
          </div>
          <p className="text-xs text-stone-500">
            Have questions, feedback, or want to list your space? Reach us at{' '}
            <span className="font-semibold text-stone-800">team@studysphere.app</span>
          </p>
        </div>
      </div>
    </div>
  );
}
