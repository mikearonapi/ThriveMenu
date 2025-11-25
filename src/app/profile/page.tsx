"use client";

import { useState } from "react";
import {
  User,
  Heart,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen pb-24 bg-[var(--cream-100)]">
      {/* Header */}
      <header className="px-5 pt-12 pb-8 bg-gradient-to-b from-[var(--sage-100)] to-[var(--cream-100)]">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-medium text-[var(--forest-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-[var(--sage-600)] font-medium text-sm"
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" />
                Done
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit
              </>
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--sage-300)] to-[var(--forest-400)] flex items-center justify-center text-white text-2xl font-medium">
              CA
            </div>
            <div className="flex-1">
              <h2
                className="text-xl font-medium text-[var(--forest-800)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Christine Aron
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                christine@example.com
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-medium rounded-full">
                  Premium
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Member since Nov 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Health Profile */}
      <section className="px-5 py-4">
        <h2
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Health Profile
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--cream-300)]">
          <HealthConditionRow
            label="Graves' Disease"
            isActive={true}
            description="Thyroid-friendly recipes prioritized"
          />
          <HealthConditionRow
            label="High Cholesterol"
            isActive={true}
            description="Heart-healthy options highlighted"
          />
          <HealthConditionRow
            label="Blood Sugar Balance"
            isActive={true}
            description="Low glycemic meals suggested"
          />
          <HealthConditionRow
            label="Gluten Sensitivity"
            isActive={false}
            description="Filter gluten-containing recipes"
            isLast
          />
        </div>
      </section>

      {/* Family Members */}
      <section className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-medium text-[var(--forest-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Family Members
          </h2>
          <button className="text-sm text-[var(--sage-600)] font-medium">
            + Add
          </button>
        </div>
        <div className="space-y-3">
          <FamilyMemberCard
            name="Mike"
            role="Husband"
            emoji="👨"
            dietary={[]}
          />
          <FamilyMemberCard
            name="Emma"
            role="6 years old"
            emoji="👧"
            dietary={["Picky eater"]}
          />
          <FamilyMemberCard
            name="Liam"
            role="4 years old"
            emoji="👦"
            dietary={["No spicy foods"]}
          />
          <FamilyMemberCard
            name="Baby"
            role="6 months old"
            emoji="👶"
            dietary={["Starting solids"]}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 py-4">
        <h2
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your Journey
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="🍳" value="42" label="Recipes Cooked" />
          <StatCard icon="❤️" value="18" label="Favorites" />
          <StatCard icon="📅" value="6" label="Weeks Planned" />
        </div>
      </section>

      {/* Settings Menu */}
      <section className="px-5 py-4">
        <h2
          className="text-lg font-medium text-[var(--forest-800)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Settings
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--cream-300)]">
          <SettingsRow icon={Bell} label="Notifications" />
          <SettingsRow icon={Settings} label="Preferences" />
          <SettingsRow icon={Shield} label="Privacy" />
          <SettingsRow icon={HelpCircle} label="Help & Support" />
          <SettingsRow
            icon={LogOut}
            label="Sign Out"
            isDestructive
            isLast
          />
        </div>
      </section>

      {/* App Info */}
      <section className="px-5 py-6 text-center">
        <div className="mb-3">
          <span className="text-3xl">🌿</span>
        </div>
        <p
          className="text-xl font-medium text-[var(--forest-800)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ThriveMenu
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Version 1.0.0 • Made with 💚
        </p>
        <p
          className="text-xs text-[var(--sage-600)] mt-4 italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &ldquo;Nourishing your family, one meal at a time&rdquo;
        </p>
      </section>
    </div>
  );
}

function HealthConditionRow({
  label,
  isActive,
  description,
  isLast = false,
}: {
  label: string;
  isActive: boolean;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4",
        !isLast && "border-b border-[var(--cream-200)]"
      )}
    >
      <div>
        <p className="font-medium text-[var(--forest-800)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <div
        className={cn(
          "w-12 h-7 rounded-full p-1 transition-all cursor-pointer",
          isActive ? "bg-[var(--sage-500)]" : "bg-[var(--cream-300)]"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
            isActive && "translate-x-5"
          )}
        />
      </div>
    </div>
  );
}

function FamilyMemberCard({
  name,
  role,
  emoji,
  dietary,
}: {
  name: string;
  role: string;
  emoji: string;
  dietary: string[];
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[var(--cream-300)] flex items-center gap-3">
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1">
        <p className="font-medium text-[var(--forest-800)]">{name}</p>
        <p className="text-sm text-[var(--text-muted)]">{role}</p>
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {dietary.map((d, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-[var(--cream-200)] text-[var(--text-secondary)] rounded-full"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[var(--cream-300)] text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-[var(--forest-800)] mt-1">
        {value}
      </p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  isDestructive = false,
  isLast = false,
}: {
  icon: typeof User;
  label: string;
  isDestructive?: boolean;
  isLast?: boolean;
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between p-4",
        !isLast && "border-b border-[var(--cream-200)]"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "w-5 h-5",
            isDestructive ? "text-[var(--rose-500)]" : "text-[var(--sage-600)]"
          )}
        />
        <span
          className={cn(
            "font-medium",
            isDestructive ? "text-[var(--rose-500)]" : "text-[var(--forest-800)]"
          )}
        >
          {label}
        </span>
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
    </button>
  );
}

