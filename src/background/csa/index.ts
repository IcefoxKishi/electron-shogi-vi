import { CSAServerSettings } from "@/common/settings/csa";
import { getAppLogger, getCSALogger } from "@/background/log";
import { Client, State } from "@/background/csa/client";
import { CSASessionState } from "@/common/advanced/monitor";
import { CommandHistory, CommandType, Command } from "@/common/advanced/command";
import { CSAGameResult, CSAGameSummary, CSAPlayerStates, CSASpecialMove } from "@/common/game/csa";
import { allowAppSuspension, preventAppSuspension } from "@/background/helpers/electron";

interface Handlers {
  onCSAGameSummary(sessionID: number, gameSummary: CSAGameSummary): void;
  onCSAReject(sessionID: number): void;
  onCSAStart(sessionID: number, playerStates: CSAPlayerStates): void;
  onCSAMove(sessionID: number, move: string, playerStates: CSAPlayerStates): void;
  onCSAGameResult(sessionID: number, specialMove: CSASpecialMove, gameResult: CSAGameResult): void;
  onCSAClose(sessionID: number): void;
  sendPromptCommand(sessionID: number, command: Command): void;
  sendError(error: Error): void;
}

let h: Handlers;

export function setHandlers(handlers: Handlers): void {
  if (h) {
    throw new Error("handlers already set");
  }
  h = handlers;
}

let lastSessionID = 0;
let powerSaveBlockID: number | undefined = undefined;

function issueSessionID(): number {
  lastSessionID += 1;
  return lastSessionID;
}

const clients = new Map<number, Client>();
const sessionRemoveDelay = 20e3;

function registerClient(client: Client): void {
  clients.set(client.sessionID, client);
  if (powerSaveBlockID === undefined) {
    powerSaveBlockID = preventAppSuspension();
    if (powerSaveBlockID !== undefined) {
      getAppLogger().info("prevent app suspension: blocker=%d", powerSaveBlockID);
    }
  }
}

function unregisterClient(sessionID: number): void {
  setTimeout(() => {
    clients.delete(sessionID);
    if (clients.size === 0 && powerSaveBlockID !== undefined) {
      allowAppSuspension(powerSaveBlockID);
      getAppLogger().info("allow app suspension: blocker=%d", powerSaveBlockID);
      powerSaveBlockID = undefined;
    }
  }, sessionRemoveDelay);
}

export function login(settings: CSAServerSettings): number {
  const sessionID = issueSessionID();
  const client = new Client(sessionID, settings, getCSALogger())
    .on("gameSummary", (gameSummary) => h.onCSAGameSummary(sessionID, gameSummary))
    .on("reject", () => h.onCSAReject(sessionID))
    .on("start", (playerStates) => h.onCSAStart(sessionID, playerStates))
    .on("move", (move, playerStates) => h.onCSAMove(sessionID, move, playerStates))
    .on("gameResult", (specialMove, gameResult) =>
      h.onCSAGameResult(sessionID, specialMove, gameResult),
    )
    .on("close", () => {
      unregisterClient(sessionID);
      h.onCSAClose(sessionID);
    })
    .on("error", h.sendError)
    .on("command", (command) => {
      h.sendPromptCommand(sessionID, command);
    });
  registerClient(client);
  client.login();
  return sessionID;
}

export function logout(sessionID: number): void {
  clients.get(sessionID)?.logout();
}

export function agree(sessionID: number, gameID: string): void {
  clients.get(sessionID)?.agree(gameID);
}

export function doMove(sessionID: number, move: string, score?: number, pv?: string): void {
  clients.get(sessionID)?.doMove(move, score, pv);
}

export function resign(sessionID: number): void {
  clients.get(sessionID)?.resign();
}

export function win(sessionID: number): void {
  clients.get(sessionID)?.win();
}

export function stop(sessionID: number): void {
  clients.get(sessionID)?.stop();
}

export function collectSessionStates(): CSASessionState[] {
  return Array.from(clients.entries())
    .map(([id, client]) => ({
      sessionID: id,
      host: client.settings.host,
      port: client.settings.port,
      loginID: client.settings.id,
      protocolVersion: client.settings.protocolVersion,
      stateCode: client.state,
      lastReceived: client.lastReceived,
      lastSent: client.lastSent,
      createdMs: client.createdMs,
      loggedInMs: client.loggedInMs,
      updatedMs: Date.now(),
      closed: client.state === State.WAITING_CLOSE || client.state === State.CLOSED,
    }))
    .sort((a, b) => b.sessionID - a.sessionID);
}

export function getCommandHistory(sessionID: number): CommandHistory {
  const client = clients.get(sessionID);
  if (client) {
    return client.commandHistory;
  }
  throw new Error(`session not found: ${sessionID}`);
}

export function invokeCommand(sessionID: number, type: CommandType, command: string): void {
  clients.get(sessionID)?.invoke(type, command);
}
