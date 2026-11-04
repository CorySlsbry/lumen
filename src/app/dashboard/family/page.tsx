import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Lock, UserPlus, Coins, GraduationCap } from "lucide-react";
import { formatMoney } from "@/lib/utils";

const isPremium = false; // demo

const MEMBERS = [
  { name: "Cory", role: "primary", avatar: "C", color: "from-fuchsia-500 to-amber-400" },
  { name: "Sam", role: "partner", avatar: "S", color: "from-emerald-500 to-teal-500" },
  { name: "Luna (12)", role: "child", avatar: "L", color: "from-indigo-500 to-violet-500", allowanceCents: 5_00 },
  { name: "Theo (8)", role: "child", avatar: "T", color: "from-rose-500 to-orange-500", allowanceCents: 3_00 },
];

export default function FamilyPage() {
  if (!isPremium) {
    return (
      <div className="px-5 pt-8 pb-8 space-y-6">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-6 text-center space-y-3">
            <Lock className="h-8 w-8 mx-auto text-fuchsia-300" />
            <h2 className="text-2xl font-bold tracking-tight">
              Family is a Premium feature
            </h2>
            <p className="text-sm text-white/70 max-w-sm mx-auto">
              Shared goals with your partner, allowances and chores for your kids,
              full parental controls — all behind one login.
            </p>
            <Button asChild>
              <Link href="/dashboard/premium">See Premium</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
            Household
          </p>
          <h1 className="text-3xl font-bold tracking-tight">The Salisbury Five</h1>
        </div>
        <Button size="icon" variant="secondary">
          <UserPlus className="h-5 w-5" />
        </Button>
      </header>

      {/* Members */}
      <div className="grid grid-cols-2 gap-3">
        {MEMBERS.map((m) => (
          <Card key={m.name} className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-br ${m.color} grid place-items-center font-bold`}
                >
                  {m.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-white/50 capitalize">{m.role}</div>
                </div>
              </div>
              {m.allowanceCents && (
                <div className="flex items-center gap-1.5 text-xs text-amber-200">
                  <Coins className="h-3 w-3" />
                  {formatMoney(m.allowanceCents)}/week
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Joint goal */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-white/50">
              Family goal
            </span>
          </div>
          <h3 className="text-lg font-bold">Disney trip — Spring 2027</h3>
          <Progress value={185_000} max={500_000} />
          <div className="flex justify-between text-sm">
            <span className="font-bold tabular-nums">{formatMoney(185_000)}</span>
            <span className="text-white/50 tabular-nums">
              of {formatMoney(500_000)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Kid education hook */}
      <Card className="bg-gradient-to-br from-indigo-700/40 to-violet-700/40 border-white/15 text-white">
        <CardContent className="p-5 flex items-start gap-3">
          <GraduationCap className="h-6 w-6 text-indigo-200" />
          <div className="flex-1">
            <h3 className="font-semibold">Kids' lessons</h3>
            <p className="text-sm text-white/70">
              Luna unlocked her third &ldquo;saving streak&rdquo; badge this week.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
