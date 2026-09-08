import { QrCode, Camera, CheckCircle, MapPin, Star } from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppState } from "../contexts/AppStateContext";

export function QRCheckIn() {
  const { addCheckIn, recentCheckIns } = useAppState();
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [hasCompletedCheckIn, setHasCompletedCheckIn] = useState(false);
  const checkInRecordedRef = useRef(false);

  const handleCheckIn = (source: "confirm_visit" | "qr_simulated" = "confirm_visit") => {
    if (checkInRecordedRef.current) return;
    checkInRecordedRef.current = true;

    addCheckIn({
      venueId: 1,
      venueName: "The Grounds of the City",
      source,
    });

    setIsScanning(false);
    setHasCompletedCheckIn(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowReviewPrompt(true);
    }, 2500);
  };

  const handleCloseReviewPrompt = () => {
    setShowReviewPrompt(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl mb-2">Check In</h1>
        <p className="text-sm text-muted-foreground">
          Confirm your visit at member venues to log networking activity
        </p>
      </div>

      {/* QR Scanner Section */}
      <div className="px-6 py-8">
        <div className="relative">
          {!isScanning && !showSuccess && (
            <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl text-center mb-2">Ready to Check In?</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Confirm your visit to this venue or scan a QR code to check in.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => handleCheckIn("confirm_visit")}
                  disabled={hasCompletedCheckIn}
                  className="bg-primary text-white w-full py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium disabled:opacity-70"
                >
                  <CheckCircle className="w-5 h-5" />
                  {hasCompletedCheckIn ? "Visit Confirmed" : "Confirm Visit"}
                </button>
                <button
                  onClick={() => setIsScanning(true)}
                  disabled={hasCompletedCheckIn}
                  className="bg-primary/10 text-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors font-medium"
                >
                  <Camera className="w-5 h-5" />
                  Scan QR Code
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl overflow-hidden relative"
            >
              {/* Scanning Animation */}
              <div className="absolute inset-8 border-2 border-white/30 rounded-2xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>

                {/* Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Mock Camera View */}
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-xl"></div>
                <button
                  onClick={() => handleCheckIn("qr_simulated")}
                  className="bg-white/20 text-white backdrop-blur-md px-6 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  Simulate Scan
                </button>
              </div>

              <button
                onClick={() => setIsScanning(false)}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-foreground px-6 py-2 rounded-full text-sm"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl text-center mb-2">Check-In Successful!</h2>
              <p className="text-sm text-muted-foreground text-center mb-1">
                The Grounds of the City
              </p>
              <div className="text-3xl text-green-600 mt-4">+50 pts</div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="px-6 pb-6">
        <h2 className="text-xl mb-4">Recent Check-ins</h2>
        <div className="space-y-3">
          {recentCheckIns.map((checkIn, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm mb-0.5 truncate">{checkIn.venue}</h3>
                <p className="text-xs text-muted-foreground">{checkIn.date}</p>
              </div>
              <div className="text-sm text-green-600">{checkIn.points}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Prompt Modal */}
      <AnimatePresence>
        {showReviewPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={handleCloseReviewPrompt}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl mb-2">Leave a Review</h2>
                <p className="text-sm text-muted-foreground">
                  Enjoyed your visit? Leave a Google review to support this Chamber partner venue.
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  Write a Google Review
                  <span className="text-xs ml-1 bg-white/20 px-2 py-0.5 rounded-full">+25 pts</span>
                </button>
                <button
                  onClick={handleCloseReviewPrompt}
                  className="w-full bg-muted text-foreground py-3 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
