/**
 * Tong Mon (Sect) Tournament System
 * Đại hội tôn - Trận đấu định kỳ, kỷ lục
 */

export interface TournamentMatch {
  id: string;
  name: string;
  participants: TournamentParticipant[];
  status: 'waiting' | 'active' | 'completed';
  startTime: number;
  endTime?: number;
  prizePool: number; // Linh Thạch
  currentRound: number;
  maxRounds: number;
}

export interface TournamentParticipant {
  playerId: string;
  playerName: string;
  realm: string; // Current cultivation realm
  score: number;
  wins: number;
  losses: number;
  connected: boolean;
}

export interface TournamentRecord {
  tournamentId: string;
  winnerId: string;
  winnerName: string;
  finalScore: number;
  duration: number; // in seconds
  recordDate: number;
}

export class TongMonTournament {
  private matches: Map<string, TournamentMatch>;
  private records: TournamentRecord[];
  private readonly tournamentCooldown: number; // 24 hours in ms

  constructor() {
    this.matches = new Map();
    this.records = [];
    this.tournamentCooldown = 24 * 60 * 60 * 1000; // 24 hours
    this.initDefaultTournaments();
  }

  private initDefaultTournaments(): void {
    // Create weekly tournament
    this.matches.set 'weekly-battle', {
      id: 'weekly-battle',
      name: 'Cuộc Chiến Tuần ',
      participants: [],
      status: 'waiting',
      startTime: Date.now(),
      prizePool: 1000, // 1000 LS
      currentRound: 1,
      maxRounds: 8,
    };

    // Create monthly ranking tournament
    this.matches.set 'monthly-ranking', {
      id: 'monthly-ranking',
      name: 'Xếp Hạng Tháng',
      participants: [],
      status: 'waiting',
      startTime: Date.now(),
      prizePool: 5000, // 5000 LS
      currentRound: 1,
      maxRounds: 1,
    };
  }

  /** Register a player for a tournament */
  registerPlayer(tournamentId: string, playerId: string, playerName: string, realm: string): boolean {
    const match = this.matches.get(tournamentId);
    if (!match) {
      console.log('Cuộc tournament không tồn tại:', tournamentId);
      return false;
    }

    if (match.status !== 'waiting') {
      console.log('Cuộc tournament chưa mở đăng ký');
      return false;
    }

    // Check if player already registered
    if (match.participants.some((p) => p.playerId === playerId)) {
      console.log('Người chơi đã đăng ký');
      return false;
    }

    // Check level requirement (minimum cultivation realm)
    const minRealmLevel = this.getMinRealmLevel(tournamentId);
    if (this.getRealmLevel(realm) < minRealmLevel) {
      console.log(`Cấp tu vi chưa đủ cho torneoi này`);
      return false;
    }

    match.participants.push({
      playerId,
      playerName,
      realm,
      score: 0,
      wins: 0,
      losses: 0,
      connected: true,
    });

    console.log(`${playerName} đã đăng ký torneoi ${match.name}`);
    return true;
  }

  /** Get minimum realm level for tournament */
  private getMinRealmLevel(tournamentId: string): number {
    const match = this.matches.get(tournamentId);
    if (!match) return 1;
    
    // Different tournaments have different requirements
    if (match.id === 'weekly-battle') return 3; // Luyện Khí trở lên
    if (match.id === 'monthly-ranking') return 5; // Nguyên Anh trở lên
    return 1;
  }

  /** Get realm level from realm string */
  private getRealmLevel(realm: string): number {
    const realmLevels: Record<string, number> = {
      'pham-nhan': 1,
      'luyen-qi': 2,
      'truc-co': 3,
      'kim-dan': 4,
      'nguyen-anh': 5,
      'hoa-than': 6,
    };
    return realmLevels[realm] || 1;
  }

  /** Start a tournament */
  startTournament(tournamentId: string): boolean {
    const match = this.matches.get(tournamentId);
    if (!match) return false;

    if (match.status === 'active') {
      console.log('Cuộc tournament đang diễn ra');
      return false;
    }

    match.status = 'active';
    match.startTime = Date.now();
    match.currentRound = 1;
    match.participants.forEach((p) => (p.connected = true));

    console.log('Cuộc tournament bắt đầu:', match.name);
    return true;
  }

  /** Record a battle result */
  recordBattle(tournamentId: string, winnerId: string, loserId: string): boolean {
    const match = this.matches.get(tournamentId);
    if (!match) return false;

    const winner = match.participants.find((p) => p.playerId === winnerId);
    const loser = match.participants.find((p) => p.playerId === loserId);

    if (!winner || !loser) {
      console.log('Không tìm thấy người chơi');
      return false;
    }

    // Update scores
    winner.wins += 1;
    winner.score += 10;
    loser.losses += 1;
    loser.score -= 5; // Penalty for losing
    loser.score = Math.max(0, loser.score); // Ensure score doesn't go negative

    // Advance to next round if needed
    if (match.currentRound < match.maxRounds) {
      match.currentRound += 1;
    } else {
      // Tournament complete
      this.completeTournament(tournamentId, winnerId);
    }

    console.log(`Kết quả trận: ${winner.playerName} thắng over ${loser.playerName}`);
    return true;
  }

  /** Complete a tournament and award prizes */
  private completeTournament(tournamentId: string, winnerId: string): boolean {
    const match = this.matches.get(tournamentId);
    if (!match) return false;

    match.status = 'completed';
    match.endTime = Date.now();

    // Find winner
    const winner = match.participants.find((p) => p.playerId === winnerId);
    if (!winner) return false;

    // Create record
    const record: TournamentRecord = {
      tournamentId,
      winnerId: winner.playerId,
      winnerName: winner.playerName,
      finalScore: winner.score,
      duration: (match.endTime! - match.startTime) / 1000,
      recordDate: Date.now(),
    };

    this.records.push(record);

    // Award prize pool to winner
    console.log(`Cuộc tournament kết thúc: ${winner.playerName} thắng ${match.prizePool} LS`);
    
    // Reset match for next tournament
    match.participants = [];
    match.status = 'waiting';
    match.prizePool = this.getDefaultPrizePool(tournamentId);
    match.currentRound = 1;

    return true;
  }

  /** Get default prize pool for tournament */
  private getDefaultPrizePool(tournamentId: string): number {
    if (tournamentId === 'weekly-battle') return 1000;
    if (tournamentId === 'monthly-ranking') return 5000;
    return 100;
  }

  /** Get tournament status */
  getTournamentStatus(tournamentId: string): TournamentMatch | undefined {
    return this.matches.get(tournamentId);
  }

  /** Get all tournament records */
  getAllRecords(): TournamentRecord[] {
    return this.records;
  }

  /** Get top players from records */
  getTopPlayers(limit: number = 10): TournamentParticipant[] {
    const allParticipants: TournamentParticipant[] = [];
    
    this.records.forEach((record) => {
      // Find the winner in records
      const match = this.matches.get(record.tournamentId);
      if (match) {
        const winner = match.participants.find((p) => p.playerId === record.winnerId);
        if (winner) {
          allParticipants.push({
            playerId: winner.playerId,
            playerName: winner.playerName,
            realm: winner.realm,
            score: record.finalScore,
            wins: winner.wins,
            losses: winner.losses,
            connected: true,
          });
        }
      }
    });

    // Sort by score descending
    allParticipants.sort((a, b) => b.score - a.score);
    
    return allParticipants.slice(0, limit);
  }
}

/** Export singleton for use in game */
export const tongMonTournament = new TongMonTournament();