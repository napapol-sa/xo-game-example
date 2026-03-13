"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Game from "./game";

export default function Home() {
  const { data: session, status } = useSession();
  const [userWins, setUserWins] = useState(0);
  const [gameLogs, setGameLogs] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [winStreak, setWinStreak] = useState(0);

  const fetchGameData = async () => {
    const res = await fetch("/api/game");
    const data = await res.json();
    if (data.score !== undefined) setUserWins(data.score);
    if (data.logs) setGameLogs(data.logs);
    if (data.leaderboard) setLeaderboard(data.leaderboard);
    if (data.winStreak !== undefined) setWinStreak(data.winStreak);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchGameData();
    }
  }, [status]);

  const handleGameEnd = async (result: "WIN" | "LOSS" | "DRAW") => {
    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    const data = await res.json();
    if (data.score !== undefined) {
      setUserWins(data.score);
      if (data.winStreak !== undefined) setWinStreak(data.winStreak);
      await fetchGameData(); // Refresh all data including leaderboard
    }
  };

  if (!session) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>
            XO Game
          </h1>

          <button
            onClick={() => signIn("google")}
            className="google-btn"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-logo"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="user-info">
        <div className="user-profile-top">
          <img
            src={session.user?.image || "public/person.svg"}
            alt={session.user?.name || "User"}
            className="user-profile-img"
          />
          <div className="user-details-group">
            <div className="user-details">
              <p>Welcome, {session.user?.name}</p>
              <p>Score: {userWins}</p>
              <p>Win Streak: {winStreak}</p>
            </div>
            <button className="logout-button" onClick={() => signOut()}>Logout</button>
          </div>
        </div>

        <div className="game-logs">
          <h3>Recent Games</h3>
          <ul>
            {gameLogs.map((log) => (
              <li key={log.id} className={log.result.toLowerCase()}>
                {log.result} - {new Date(log.createdAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="leaderboard-container">
        <h3>Leaderboard</h3>
        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="leaderboard-item">
              <span className="rank">{index + 1}</span>
              <img src={user.image || "public/person.svg"} alt={user.name || "User"} className="leader-img" />
              <span className="leader-name">{user.name}</span>
              <span className="leader-score">{user.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      <Game onGameEnd={handleGameEnd} />
    </div>
  );
}
