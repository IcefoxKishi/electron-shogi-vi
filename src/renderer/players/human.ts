import { TimeLimitSetting } from "@/common/settings/game";
import { ImmutablePosition, Move } from "electron-shogi-core";
import { Player, SearchHandler } from "./player";

export class HumanPlayer implements Player {
  private searchHandler?: SearchHandler;

  isEngine(): boolean {
    return false;
  }

  async readyNewGame(): Promise<void> {
    // do nothing
  }

  async startSearch(
    position: ImmutablePosition,
    usi: string,
    timeLimit: TimeLimitSetting,
    blackTimeMs: number,
    whiteTimeMs: number,
    handler: SearchHandler,
  ): Promise<void> {
    this.searchHandler = handler;
  }

  async startPonder(): Promise<void> {
    // do nothing
  }

  async startMateSearch(): Promise<void> {
    // do nothing
  }

  async stop(): Promise<void> {
    // do nothing
  }

  async gameover(): Promise<void> {
    // do nothing
  }

  async close(): Promise<void> {
    this.searchHandler = undefined;
  }

  doMove(move: Move) {
    const searchHandler = this.searchHandler;
    this.searchHandler = undefined;
    searchHandler?.onMove(move);
  }

  resign() {
    const searchHandler = this.searchHandler;
    this.searchHandler = undefined;
    searchHandler?.onResign();
  }

  win() {
    const searchHandler = this.searchHandler;
    this.searchHandler = undefined;
    searchHandler?.onWin();
  }
}

export const humanPlayer = new HumanPlayer();
