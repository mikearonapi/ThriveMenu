"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Calendar,
  Utensils,
  Baby,
  Smile,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'var(--cream-100)' }}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-sage-500" />
          </div>
          <h1
            className="text-2xl font-medium text-forest-900 mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Sign in to your account
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to save favorites, plan meals, and track your health journey.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl bg-sage-500 text-white font-medium hover:bg-sage-600 transition-colors"
          >
            Sign In
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-sage-600 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Get initials from user name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Header */}
      <header className="px-5 pt-12 pb-8 bg-gradient-to-b from-sage-50 border-b border-gray-200" style={{ background: 'linear-gradient(to bottom, var(--sage-50), var(--cream-100))' }}>
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-3xl font-medium text-forest-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-sage-600 font-medium text-sm border border-gray-200"
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
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-300 to-forest-400 flex items-center justify-center text-white text-2xl font-serif">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1">
              <h2
                className="text-xl font-medium text-forest-900"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {user?.name || "ThriveMenu User"}
              </h2>
              <p className="text-gray-600 text-sm">
                {user?.email || ""}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-1 bg-sage-50 text-sage-700 text-xs font-medium rounded-full border border-sage-100">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Health Profile */}
      <section className="px-5 py-6">
        <h2
          className="text-lg font-medium text-forest-900 mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <Heart className="w-5 h-5 text-rose-400" />
          Health Profile
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
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
      <section className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-medium text-forest-900 flex items-center gap-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <User className="w-5 h-5 text-sage-600" />
            Family Members
          </h2>
          <button className="text-sm text-sage-600 font-medium hover:text-sage-800">
            + Add Member
          </button>
        </div>
        <div className="space-y-3">
          <FamilyMemberCard
            name="Mike"
            role="Husband"
            icon={User}
            dietary={[]}
          />
          <FamilyMemberCard
            name="Emma"
            role="6 years old"
            icon={Smile}
            dietary={["Picky eater"]}
          />
          <FamilyMemberCard
            name="Liam"
            role="4 years old"
            icon={Star}
            dietary={["No spicy foods"]}
          />
          <FamilyMemberCard
            name="Baby"
            role="6 months old"
            icon={Baby}
            dietary={["Starting solids"]}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 pb-6">
        <h2
          className="text-lg font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your Journey
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Utensils} value="42" label="Recipes Cooked" />
          <StatCard icon={Heart} value="18" label="Favorites" />
          <StatCard icon={Calendar} value="6" label="Weeks Planned" />
        </div>
      </section>

      {/* Settings Menu */}
      <section className="px-5 pb-8">
        <h2
          className="text-lg font-medium text-forest-900 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Settings
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <SettingsRow icon={Bell} label="Notifications" />
          <SettingsRow icon={Settings} label="Preferences" />
          <SettingsRow icon={Shield} label="Privacy" />
          <SettingsRow icon={HelpCircle} label="Help & Support" />
          <SettingsRow
            icon={LogOut}
            label="Sign Out"
            isDestructive
            isLast
            onClick={handleSignOut}
          />
        </div>
      </section>

      {/* App Info */}
      <section className="px-5 pb-8 text-center">
        <p
          className="text-xl font-medium text-forest-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ThriveMenu
        </p>
        <p className="text-sm text-gray-500">
          Version 1.0.0
        </p>
        <p
          className="text-xs text-sage-600 mt-4 italic"
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
        "flex items-center justify-between p-4 hover:bg-gray-50 transition-colors",
        !isLast && "border-b border-gray-100"
      )}
    >
      <div>
        <p className="font-medium text-forest-900 text-sm">{label}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
      <div
        className={cn(
          "w-11 h-6 rounded-full p-1 transition-all cursor-pointer",
          isActive ? "bg-sage-500" : "bg-gray-300"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
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
  icon: Icon,
  dietary,
}: {
  name: string;
  role: string;
  icon: any;
  dietary: string[];
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-full style={{ backgroundColor: 'var(--cream-100)' }} flex items-center justify-center text-sage-600">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-forest-900">{name}</p>
        <p className="text-xs text-gray-600">{role}</p>
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {dietary.map((d, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 style={{ backgroundColor: 'var(--cream-100)' }} text-gray-600 rounded-full border border-gray-200"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500" />
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 text-sage-600">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-forest-900 mb-0.5 font-serif">
        {value}
      </p>
      <p className="text-[10px] text-gray-600 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  isDestructive = false,
  isLast = false,
  onClick,
}: {
  icon: any;
  label: string;
  isDestructive?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors",
        !isLast && "border-b border-gray-100"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "w-5 h-5",
            isDestructive ? "text-rose-500" : "text-sage-500"
          )}
        />
        <span
          className={cn(
            "font-medium text-sm",
            isDestructive ? "text-rose-500" : "text-forest-900"
          )}
        >
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500" />
    </button>
  );
}
