import React from "react";
import LOGO from "../assets/images/Logo-abn.png";

const UserHeader = ({ profile, handleSignOut }) => {
  return (
    <>
      {/* Header - Sticky on Desktop, Static on Mobile */}
      <header className="bg-secondary text-primary border-b border-basic shadow-sm sm:sticky sm:top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo & Greeting - Mobile Centered, Desktop Left */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <img src={LOGO} alt="Horizon Ridge Credit Union" className="h-6 sm:h-8" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  Welcome, {profile?.full_name || "User"}
                </h1>
                <p className="text-xs sm:text-sm opacity-75 mt-0.5 sm:mt-1">
                  Manage your accounts
                </p>
              </div>
            </div>
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="py-2 px-4 sm:px-6 bg-basic text-secondary font-semibold rounded-sm text-sm sm:text-base hover:bg-opacity-90 transition-all active:scale-95 whitespace-nowrap"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default UserHeader;

