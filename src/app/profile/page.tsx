"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Trash2,
  Check,
  Calendar,
  Utensils,
  Baby,
  Smile,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Loader2 } from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  birthDate: string | null;
  ageGroup: string;
  isVegetarian: boolean;
  allergies: string[];
  dislikes: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Fetch family members
  useEffect(() => {
    if (isAuthenticated) {
      fetchFamilyMembers();
    }
  }, [isAuthenticated]);

  async function fetchFamilyMembers() {
    setIsLoadingFamily(true);
    try {
      const response = await fetch("/api/family-members");
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data.familyMembers || []);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
    } finally {
      setIsLoadingFamily(false);
    }
  }

  async function handleAddFamilyMember(memberData: Partial<FamilyMember>) {
    try {
      const response = await fetch("/api/family-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        await fetchFamilyMembers();
        setShowAddMember(false);
      }
    } catch (error) {
      console.error("Error adding family member:", error);
    }
  }

  async function handleDeleteFamilyMember(id: string) {
    if (!confirm("Are you sure you want to remove this family member?")) return;

    try {
      const response = await fetch(`/api/family-members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchFamilyMembers();
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
    }
  }

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
    <div className="min-h-screen pb-24 md:pb-8" style={{ backgroundColor: 'var(--cream-100)' }}>
      {/* Header */}
      <header className="px-5 sm:px-6 md:px-8 lg:px-12 pt-12 pb-8 bg-gradient-to-b from-sage-50 border-b border-gray-200 max-w-7xl mx-auto" style={{ background: 'linear-gradient(to bottom, var(--sage-50), var(--cream-100))' }}>
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
      <section className="px-5 sm:px-6 md:px-8 lg:px-12 py-6 max-w-7xl mx-auto">
        <h2
          className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900 mb-4 md:mb-6 flex items-center gap-2"
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
            link="/health/graves"
          />
          <HealthConditionRow
            label="High Cholesterol"
            isActive={true}
            description="Heart-healthy options highlighted"
            link="/health/cholesterol"
          />
          <HealthConditionRow
            label="Blood Sugar Balance"
            isActive={true}
            description="Low glycemic meals suggested"
            link="/health/blood-sugar"
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
      <section className="px-5 sm:px-6 md:px-8 lg:px-12 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900 flex items-center gap-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <User className="w-5 h-5 text-sage-600" />
            Family Members
          </h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="text-sm text-sage-600 font-medium hover:text-sage-800"
          >
            + Add Member
          </button>
        </div>

        {isLoadingFamily ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-sage-600 animate-spin" />
          </div>
        ) : familyMembers.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No family members added yet</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-primary"
            >
              Add Family Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {familyMembers.map((member) => {
              const getIcon = () => {
                switch (member.ageGroup) {
                  case "INFANT":
                    return Baby;
                  case "PRESCHOOL":
                  case "CHILD":
                    return Star;
                  default:
                    return User;
                }
              };
              const Icon = getIcon();
              const getAgeLabel = () => {
                switch (member.ageGroup) {
                  case "INFANT":
                    return "Infant";
                  case "TODDLER":
                    return "Toddler";
                  case "PRESCHOOL":
                    return "Preschool";
                  case "CHILD":
                    return "Child";
                  case "TEEN":
                    return "Teen";
                  case "ADULT":
                    return "Adult";
                  default:
                    return member.ageGroup;
                }
              };

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4 relative group hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-sage-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-forest-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{getAgeLabel()}</p>
                    {member.isVegetarian && (
                      <p className="text-xs text-sage-600 mt-1">Vegetarian</p>
                    )}
                    {member.allergies.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Allergies: {member.allergies.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Edit2 className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteFamilyMember(member.id)}
                      className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Family Member Modal */}
        {(showAddMember || editingMember) && (
          <FamilyMemberModal
            member={editingMember}
            onSave={async (data) => {
              if (editingMember) {
                // Update existing
                const response = await fetch(`/api/family-members/${editingMember.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                if (response.ok) {
                  await fetchFamilyMembers();
                  setEditingMember(null);
                }
              } else {
                // Create new
                await handleAddFamilyMember(data);
              }
            }}
            onClose={() => {
              setShowAddMember(false);
              setEditingMember(null);
            }}
          />
        )}
      </section>

      {/* Stats */}
      <section className="px-5 sm:px-6 md:px-8 lg:px-12 pb-6 max-w-7xl mx-auto">
        <h2
          className="text-lg sm:text-xl md:text-2xl font-medium text-forest-900 mb-4 md:mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your Journey
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-3 md:gap-4">
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

// Family Member Modal Component
function FamilyMemberModal({
  member,
  onSave,
  onClose,
}: {
  member: FamilyMember | null;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    birthDate: member?.birthDate ? new Date(member.birthDate).toISOString().split("T")[0] : "",
    ageGroup: member?.ageGroup || "ADULT",
    isVegetarian: member?.isVegetarian || false,
    allergies: member?.allergies.join(", ") || "",
    dislikes: member?.dislikes.join(", ") || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        allergies: formData.allergies.split(",").map((a) => a.trim()).filter(Boolean),
        dislikes: formData.dislikes.split(",").map((d) => d.trim()).filter(Boolean),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-medium text-forest-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          {member ? "Edit Family Member" : "Add Family Member"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Group
            </label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="INFANT">Infant (0-1 years)</option>
              <option value="TODDLER">Toddler (1-3 years)</option>
              <option value="PRESCHOOL">Preschool (3-5 years)</option>
              <option value="CHILD">Child (6-12 years)</option>
              <option value="TEEN">Teen (13-17 years)</option>
              <option value="ADULT">Adult (18+ years)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date (optional)
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="vegetarian"
              checked={formData.isVegetarian}
              onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-gray-300 rounded"
            />
            <label htmlFor="vegetarian" className="ml-2 text-sm text-gray-700">
              Vegetarian
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., peanuts, dairy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dislikes (comma-separated)
            </label>
            <input
              type="text"
              value={formData.dislikes}
              onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., mushrooms, spicy food"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HealthConditionRow({
  label,
  isActive,
  description,
  isLast = false,
  link,
}: {
  label: string;
  isActive: boolean;
  description: string;
  isLast?: boolean;
  link?: string;
}) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between p-4 hover:bg-gray-50 transition-colors",
        !isLast && "border-b border-gray-100",
        link && "cursor-pointer"
      )}
    >
      <div>
        <p className="font-medium text-forest-900 text-sm">{label}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
      <div
        className={cn(
          "w-11 h-6 rounded-full p-1 transition-all",
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

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
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
