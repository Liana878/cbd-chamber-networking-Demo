import { Trophy, Award, Star, TrendingUp, Gift, Zap, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";

const achievementIcons = {
  "first-check-in": Star,
  "venue-reviewer": MessageSquare,
  explorer: Award,
  "social-butterfly": Zap,
  "frequent-visitor": TrendingUp,
};

export function Rewards() {
  const {
    totalPoints,
    leaderboard,
    currentUserAchievements,
    currentUserRewardStatus,
    currentUserVouchers,
    redeemReward,
  } = useAppState();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Points */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl mb-6">Network Score & Perks</h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <div className="text-4xl mb-1">{totalPoints.toLocaleString()}</div>
            <div className="text-sm opacity-80">Total Points</div>
          </div>
        </motion.div>
      </div>

      {/* How to Earn Points */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="text-sm mb-3">How to Earn Points</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>• Check in at partner venues</span>
              <span className="text-primary">+50 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Leave a Google review</span>
              <span className="text-primary">+25 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Complete achievements</span>
              <span className="text-primary">up to +200 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mt-6">
        <h2 className="text-xl mb-4">Achievements</h2>
        <div className="space-y-3">
          {currentUserAchievements.map((achievement, index) => {
            const Icon = achievementIcons[achievement.key as keyof typeof achievementIcons];

            return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`p-4 rounded-xl border ${
                achievement.completed
                  ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    achievement.completed
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm">{achievement.name}</h3>
                    <span className="text-xs text-primary">+{achievement.points}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {!achievement.completed && achievement.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {achievement.progress} / {achievement.total}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((achievement.progress / achievement.total) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {achievement.completed && (
                    <div className="text-xs text-green-600">Completed ✓</div>
                  )}
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="px-6 mt-8">
        <h2 className="text-xl mb-4">Redeem Rewards</h2>
        <div className="space-y-3">
          {currentUserRewardStatus.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                reward.available
                  ? "bg-card border-border"
                  : "bg-muted/50 border-muted opacity-60"
              }`}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm mb-1">{reward.name}</h3>
                <p className="text-xs text-muted-foreground">{reward.points} pts</p>
              </div>
              <button
                onClick={() => redeemReward(reward.id)}
                disabled={reward.redeemed || !reward.available}
                className={`px-4 py-2 rounded-lg text-sm ${
                  reward.redeemed
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : reward.available
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {reward.redeemed ? "Redeemed" : reward.available ? "Redeem" : "Locked"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Vouchers */}
      <div className="px-6 mt-8">
        <h2 className="text-xl mb-4">My Vouchers</h2>
        {currentUserVouchers.length > 0 ? (
          <div className="space-y-3">
            {currentUserVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="p-4 rounded-xl border border-border bg-card flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{voucher.rewardName}</h3>
                  <p className="text-xs text-muted-foreground">
                    Redeemed on {voucher.redeemedDate}
                  </p>
                </div>
                <div className="text-xs text-primary">Status: Available</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-border bg-card text-sm text-muted-foreground">
            No vouchers yet
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="px-6 mt-8">
        <h2 className="text-xl mb-4">Leaderboard</h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-4 ${
                entry.userId === currentUser?.id ? "bg-primary/5" : ""
              } ${index !== leaderboard.length - 1 ? "border-b border-border" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  entry.rank === 1
                    ? "bg-yellow-400 text-yellow-900"
                    : entry.rank === 2
                    ? "bg-blue-400 text-blue-900"
                    : entry.rank === 3
                    ? "bg-orange-400 text-orange-900"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {entry.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm">{entry.name}</p>
              </div>
              <div className="text-sm text-muted-foreground">{entry.points.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
