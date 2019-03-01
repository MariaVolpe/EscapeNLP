import PuzzleManager from './PuzzleManager';

class GameSession {
  constructor() {
    this.puzzleManager = new PuzzleManager();
    this.grid = new Grid();
    // add in network/connection information, sockets, player information
    // this.chatroom = new ChatRoom(); etcs
  }
}

export default GameSession;