import api from "@/renderer/ipc/api";
import {
  Color,
  exportCSA,
  ImmutableRecord,
  Move,
  PositionChange,
  Record,
  formatSpecialMove,
  exportKIF,
  RecordMetadataKey,
  ImmutablePosition,
  DoMoveOption,
  SpecialMoveType,
  exportKI2,
  RecordFormatType,
  exportJKFString,
  countJishogiDeclarationPoint,
  judgeJishogiDeclaration,
  JishogiDeclarationRule,
  countJishogiPoint,
} from "tsshogi";
import { reactive, UnwrapNestedRefs } from "vue";
import { GameSettings } from "@/common/settings/game";
import { ClockSoundTarget, Tab, TextDecodingRule } from "@/common/settings/app";
import { beepShort, beepUnlimited, playPieceBeat, stopBeep } from "@/renderer/devices/audio";
import {
  RecordManager,
  SearchInfoSenderType,
  SearchInfo as SearchInfoParam,
  ResetRecordHandler,
  ChangePositionHandler,
  UpdateCustomDataHandler,
  UpdateFollowingMovesHandler,
  PieceSet,
  UpdateTreeHandler,
} from "./record";
import { calculateGameStatistics, GameManager, GameResults } from "./game";
import { generateRecordFileName, join } from "@/renderer/helpers/path";
import { ResearchSettings } from "@/common/settings/research";
import { USIPlayerMonitor, USIMonitor } from "./usi";
import { AppState, ResearchState } from "@/common/control/state";
import { Attachment, ListItem, useMessageStore } from "./message";
import * as uri from "@/common/uri";
import { AnalysisManager } from "./analysis";
import { AnalysisSettings, CommentBehavior } from "@/common/settings/analysis";
import { MateSearchSettings } from "@/common/settings/mate";
import { LogLevel } from "@/common/log";
import { CSAGameManager, CSAGameState } from "./csa";
import { Clock } from "./clock";
import { CSAGameSettings, appendCSAGameSettingsHistory } from "@/common/settings/csa";
import { defaultPlayerBuilder } from "@/renderer/players/builder";
import { USIInfoCommand } from "@/common/game/usi";
import { ResearchManager } from "./research";
import { SearchInfo } from "@/renderer/players/player";
import { useAppSettings } from "./settings";
import { t } from "@/common/i18n";
import { MateSearchManager } from "./mate";
import { detectUnsupportedRecordProperties } from "@/renderer/helpers/record";
import { RecordFileFormat, detectRecordFileFormatByPath } from "@/common/file/record";
import { setOnUpdateUSIInfoHandler, setOnUpdateUSIPonderInfoHandler } from "@/renderer/players/usi";
import { useErrorStore } from "./error";
import { useBusyState } from "./busy";
import { Confirmation, useConfirmationStore } from "./confirm";
import { LayoutProfile, LayoutProfileList } from "@/common/settings/layout";

export type PVPreview = {
  position: ImmutablePosition;
  multiPV?: number;
  depth?: number;
  selectiveDepth?: number;
  score?: number;
  mate?: number;
  lowerBound?: boolean;
  upperBound?: boolean;
  pv: Move[];
};

function getMessageAttachmentsByGameResults(results: GameResults): Attachment[] {
  const statistics = calculateGameStatistics(results);
  return [
    {
      type: "list",
      items: [
        {
          text: results.player1.name,
          children: [`${t.wins}: ${results.player1.win}`],
        },
        {
          text: results.player2.name,
          children: [`${t.wins}: ${results.player2.win}`],
        },
        { text: `${t.draws}: ${results.draw}` },
        { text: `${t.validGames}: ${results.total - results.invalid}` },
        { text: `${t.invalidGames}: ${results.invalid}` },
        {
          text: `${t.eloRatingDiff} (${t.ignoreDraws})`,
          children: [
            `${statistics.rating.toFixed(2)}`,
            `95% CI: [${statistics.ratingLower.toFixed(1)}, ${statistics.ratingUpper.toFixed(1)}]`,
          ],
        },
        {
          text: `${t.eloRatingDiff} (${t.drawCountAsHalfWins})`,
          children: [
            `${statistics.ratingWithDraw.toFixed(2)}`,
            `95% CI: [${statistics.ratingWithDrawLower.toFixed(1)}, ${statistics.ratingWithDrawUpper.toFixed(1)}]`,
          ],
        },
        {
          text: "二項検定",
          children: [
            `np > 5: ${statistics.npIsGreaterThan5 ? "True" : "False"}`,
            `${t.zValue}: ${statistics.zValue.toFixed(2)}`,
            `${t.significance5pc}: ${statistics.significance5pc ? "True" : "False"}`,
            `${t.significance1pc}: ${statistics.significance1pc ? "True" : "False"}`,
          ],
        },
      ],
    },
  ];
}

class Store {
  private recordManager = new RecordManager();
  private _appState = AppState.NORMAL;
  private _customLayout: LayoutProfile | null = null;
  private _isAppSettingsDialogVisible = false;
  private _pvPreview?: PVPreview;
  private usiMonitor = new USIMonitor();
  private blackClock = new Clock();
  private whiteClock = new Clock();
  private gameManager = new GameManager(this.recordManager, this.blackClock, this.whiteClock);
  private csaGameManager = new CSAGameManager(this.recordManager, this.blackClock, this.whiteClock);
  private analysisManager = new AnalysisManager(this.recordManager);
  private mateSearchManager = new MateSearchManager();
  private _researchState = ResearchState.IDLE;
  private researchManager = new ResearchManager();
  private _reactive: UnwrapNestedRefs<Store>;
  private garbledNotified = false;
  private onResetRecordHandlers: ResetRecordHandler[] = [];
  private onChangePositionHandlers: ChangePositionHandler[] = [];
  private onUpdateRecordTreeHandlers: UpdateTreeHandler[] = [];
  private onUpdateCustomDataHandlers: UpdateCustomDataHandler[] = [];
  private onUpdateFollowingMovesHandlers: (() => void)[] = [];

  constructor() {
    this.recordManager
      .on("resetRecord", () => {
        this.updateResearchPosition();
        this.onResetRecordHandlers.forEach((handler) => handler());
      })
      .on("changePosition", () => {
        this.updateResearchPosition();
        this.onChangePositionHandlers.forEach((handler) => handler());
      })
      .on("updateTree", () => {
        this.onUpdateRecordTreeHandlers.forEach((handler) => handler());
      })
      .on("updateCustomData", () => {
        this.onUpdateCustomDataHandlers.forEach((handler) => handler());
      })
      .on("updateFollowingMoves", () => {
        this.onUpdateFollowingMovesHandlers.forEach((handler) => handler());
      })
      .on("backup", () => {
        return {
          returnCode: useAppSettings().returnCode,
        };
      });
    const refs = reactive(this);
    this.gameManager
      .on("saveRecord", refs.onSaveRecord.bind(refs))
      .on("gameEnd", refs.onGameEnd.bind(refs))
      .on("flipBoard", refs.onFlipBoard.bind(refs))
      .on("pieceBeat", () => playPieceBeat(useAppSettings().pieceVolume))
      .on("beepShort", this.onBeepShort.bind(this))
      .on("beepUnlimited", this.onBeepUnlimited.bind(this))
      .on("stopBeep", stopBeep)
      .on("error", (e) => {
        useErrorStore().add(e);
      });
    this.csaGameManager
      .on("saveRecord", refs.onSaveRecord.bind(refs))
      .on("gameEnd", refs.onCSAGameEnd.bind(refs))
      .on("flipBoard", refs.onFlipBoard.bind(refs))
      .on("pieceBeat", () => playPieceBeat(useAppSettings().pieceVolume))
      .on("beepShort", this.onBeepShort.bind(this))
      .on("beepUnlimited", this.onBeepUnlimited.bind(this))
      .on("stopBeep", stopBeep)
      .on("error", (e) => {
        useErrorStore().add(e);
      });
    this.researchManager
      .on("updateSearchInfo", this.onUpdateSearchInfo.bind(refs))
      .on("error", (e) => {
        useErrorStore().add(e);
      });
    this.analysisManager.on("finish", this.onFinish.bind(refs)).on("error", (e) => {
      useErrorStore().add(e);
    });
    this.mateSearchManager
      .on("checkmate", this.onCheckmate.bind(refs))
      .on("notImplemented", this.onNotImplemented.bind(refs))
      .on("noMate", this.onNoMate.bind(refs))
      .on("error", this.onCheckmateError.bind(refs));
    this._reactive = refs;
    setOnUpdateUSIInfoHandler(this.updateUSIInfo.bind(refs));
    setOnUpdateUSIPonderInfoHandler(this.updateUSIPonderInfo.bind(refs));
  }

  addEventListener(event: "resetRecord", handler: ResetRecordHandler): void;
  addEventListener(event: "changePosition", handler: ChangePositionHandler): void;
  addEventListener(event: "updateRecordTree", handler: UpdateTreeHandler): void;
  addEventListener(event: "updateCustomData", handler: UpdateCustomDataHandler): void;
  addEventListener(event: "updateFollowingMoves", handler: UpdateFollowingMovesHandler): void;
  addEventListener(event: string, handler: unknown): void {
    switch (event) {
      case "resetRecord":
        this.onResetRecordHandlers.push(handler as ResetRecordHandler);
        break;
      case "changePosition":
        this.onChangePositionHandlers.push(handler as ChangePositionHandler);
        break;
      case "updateRecordTree":
        this.onUpdateRecordTreeHandlers.push(handler as UpdateTreeHandler);
        break;
      case "updateCustomData":
        this.onUpdateCustomDataHandlers.push(handler as UpdateCustomDataHandler);
        break;
      case "updateFollowingMoves":
        this.onUpdateFollowingMovesHandlers.push(handler as UpdateFollowingMovesHandler);
        break;
    }
  }

  removeEventListener(event: "resetRecord", handler: ResetRecordHandler): void;
  removeEventListener(event: "changePosition", handler: ChangePositionHandler): void;
  removeEventListener(event: "updateRecordTree", handler: UpdateTreeHandler): void;
  removeEventListener(event: "updateCustomData", handler: UpdateCustomDataHandler): void;
  removeEventListener(event: "updateFollowingMoves", handler: UpdateFollowingMovesHandler): void;
  removeEventListener(event: string, handler: unknown): void {
    switch (event) {
      case "resetRecord":
        this.onResetRecordHandlers = this.onResetRecordHandlers.filter((h) => h !== handler);
        break;
      case "changePosition":
        this.onChangePositionHandlers = this.onChangePositionHandlers.filter((h) => h !== handler);
        break;
      case "updateRecordTree":
        this.onUpdateRecordTreeHandlers = this.onUpdateRecordTreeHandlers.filter(
          (h) => h !== handler,
        );
        break;
      case "updateCustomData":
        this.onUpdateCustomDataHandlers = this.onUpdateCustomDataHandlers.filter(
          (h) => h !== handler,
        );
        break;
      case "updateFollowingMoves":
        this.onUpdateFollowingMovesHandlers = this.onUpdateFollowingMovesHandlers.filter(
          (h) => h !== handler,
        );
        break;
    }
  }

  get reactive(): UnwrapNestedRefs<Store> {
    return this._reactive;
  }

  get record(): ImmutableRecord {
    return this.recordManager.record;
  }

  get recordFilePath(): string | undefined {
    return this.recordManager.recordFilePath;
  }

  get isRecordFileUnsaved(): boolean {
    return this.recordManager.unsaved;
  }

  get inCommentPVs(): Move[][] {
    return this.recordManager.inCommentPVs;
  }

  updateStandardRecordMetadata(update: { key: RecordMetadataKey; value: string }): void {
    this.recordManager.updateStandardMetadata(update);
  }

  appendSearchComment(
    type: SearchInfoSenderType,
    searchInfo: SearchInfoParam,
    behavior: CommentBehavior,
    options?: {
      header?: string;
      engineName?: string;
    },
  ): void {
    this.recordManager.appendSearchComment(type, searchInfo, behavior, options);
  }

  appendMovesSilently(moves: Move[], opt?: DoMoveOption): number {
    return this.recordManager.appendMovesSilently(moves, opt);
  }

  get appState(): AppState {
    return this._appState;
  }

  get researchState(): ResearchState {
    return this._researchState;
  }

  get customLayout() {
    return this._customLayout;
  }

  updateLayoutProfileList(uri: string, profileList: LayoutProfileList): void {
    this._customLayout = profileList.profiles.find((p) => p.uri === uri) || null;
  }

  get pvPreview(): PVPreview | undefined {
    return this._pvPreview;
  }

  showPVPreviewDialog(pvPreview: PVPreview): void {
    this._pvPreview = pvPreview;
  }

  closePVPreviewDialog(): void {
    this._pvPreview = undefined;
  }

  showPasteDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.PASTE_DIALOG;
    }
  }

  showGameDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.GAME_DIALOG;
    }
  }

  showCSAGameDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.CSA_GAME_DIALOG;
    }
  }

  showAnalysisDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.ANALYSIS_DIALOG;
    }
  }

  showMateSearchDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.MATE_SEARCH_DIALOG;
    }
  }

  showUsiEngineManagementDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.USI_ENGINES_DIALOG;
    }
  }

  showRecordFileHistoryDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.RECORD_FILE_HISTORY_DIALOG;
    }
  }

  showBatchConversionDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.BATCH_CONVERSION_DIALOG;
    }
  }

  showExportBoardImageDialog() {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.EXPORT_POSITION_IMAGE_DIALOG;
    }
  }

  showLaunchUSIEngineDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.LAUNCH_USI_ENGINE_DIALOG;
    }
  }

  showConnectToCSAServerDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.CONNECT_TO_CSA_SERVER_DIALOG;
    }
  }

  showLoadRemoteFileDialog(): void {
    if (this.appState === AppState.NORMAL) {
      this._appState = AppState.LOAD_REMOTE_FILE_DIALOG;
    }
  }

  destroyModalDialog(): void {
    if (
      this.appState === AppState.PASTE_DIALOG ||
      this.appState === AppState.GAME_DIALOG ||
      this.appState === AppState.CSA_GAME_DIALOG ||
      this.appState === AppState.ANALYSIS_DIALOG ||
      this.appState === AppState.MATE_SEARCH_DIALOG ||
      this.appState === AppState.USI_ENGINES_DIALOG ||
      this.appState === AppState.EXPORT_POSITION_IMAGE_DIALOG ||
      this.appState === AppState.RECORD_FILE_HISTORY_DIALOG ||
      this.appState === AppState.BATCH_CONVERSION_DIALOG ||
      this.appState === AppState.LAUNCH_USI_ENGINE_DIALOG ||
      this.appState === AppState.CONNECT_TO_CSA_SERVER_DIALOG ||
      this.appState === AppState.LOAD_REMOTE_FILE_DIALOG
    ) {
      this._appState = AppState.NORMAL;
    }
  }

  closeModalDialog(): void {
    if (!useBusyState().isBusy) {
      this.destroyModalDialog();
    }
  }

  get isAppSettingsDialogVisible(): boolean {
    return this._isAppSettingsDialogVisible;
  }

  showAppSettingsDialog(): void {
    this._isAppSettingsDialogVisible = true;
  }

  closeAppSettingsDialog(): void {
    this._isAppSettingsDialogVisible = false;
  }

  get usiMonitors(): USIPlayerMonitor[] {
    return this.usiMonitor.sessions;
  }

  isPausedResearchEngine(sessionID: number): boolean {
    return this.researchManager.isPaused(sessionID);
  }

  pauseResearchEngine(sessionID: number): void {
    this.researchManager.pause(sessionID);
  }

  unpauseResearchEngine(sessionID: number): void {
    this.researchManager.unpause(sessionID);
  }

  updateUSIInfo(sessionID: number, usi: string, name: string, info: USIInfoCommand): void {
    if (this.recordManager.record.usi !== usi) {
      return;
    }
    this.usiMonitor.update(sessionID, this.recordManager.record.position, name, info);
  }

  updateUSIPonderInfo(sessionID: number, usi: string, name: string, info: USIInfoCommand): void {
    const record = Record.newByUSI(usi);
    if (record instanceof Error) {
      api.log(LogLevel.ERROR, `invalid USI: ${usi} (updateUSIPonderInfo)`);
      return;
    }
    const ponderMove = record.current.move;
    if (!(ponderMove instanceof Move)) {
      return;
    }
    this.usiMonitor.update(sessionID, record.position, name, info, ponderMove);
  }

  get blackTime(): number {
    return this.blackClock.time;
  }

  get blackByoyomi(): number {
    return this.blackClock.byoyomi;
  }

  get whiteTime(): number {
    return this.whiteClock.time;
  }

  get whiteByoyomi(): number {
    return this.whiteClock.byoyomi;
  }

  startGame(settings: GameSettings): void {
    if (this.appState !== AppState.GAME_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    api
      .saveGameSettings(settings)
      .then(() => {
        const appSettings = useAppSettings();
        const builder = defaultPlayerBuilder(appSettings.engineTimeoutSeconds);
        return this.gameManager.start(settings, builder);
      })
      .then(() => (this._appState = AppState.GAME))
      .catch((e) => {
        useErrorStore().add("対局の初期化中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  get gameSettings(): GameSettings {
    return this.gameManager.settings;
  }

  get gameResults(): GameResults {
    return this.gameManager.results;
  }

  get csaGameState(): CSAGameState {
    return this.csaGameManager.state;
  }

  get csaServerSessionID(): number {
    return this.csaGameManager.sessionID;
  }

  get csaGameSettings(): CSAGameSettings {
    return this.csaGameManager.settings;
  }

  get usiSessionIDs(): number[] {
    if (this.appState == AppState.CSA_GAME) {
      return [this.csaGameManager.usiSessionID].filter((id) => id);
    }
    return [];
  }

  loginCSAGame(settings: CSAGameSettings, opt: { saveHistory: boolean }): void {
    if (this.appState !== AppState.CSA_GAME_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    Promise.resolve()
      .then(async () => {
        if (opt.saveHistory) {
          const latestHistory = await api.loadCSAGameSettingsHistory();
          const history = appendCSAGameSettingsHistory(latestHistory, settings);
          await api.saveCSAGameSettingsHistory(history);
        }
      })
      .then(() => {
        const appSettings = useAppSettings();
        const builder = defaultPlayerBuilder(appSettings.engineTimeoutSeconds);
        return this.csaGameManager.login(settings, builder);
      })
      .then(() => (this._appState = AppState.CSA_GAME))
      .catch((e) => {
        useErrorStore().add("対局の初期化中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  cancelCSAGame(): void {
    if (this.appState !== AppState.CSA_GAME) {
      return;
    }
    if (this.csaGameManager.state === CSAGameState.GAME) {
      useErrorStore().add("対局が始まっているため通信対局をキャンセルできませんでした。");
      return;
    }
    this.csaGameManager.logout();
    this._appState = AppState.NORMAL;
  }

  stopGame(): void {
    switch (this.appState) {
      case AppState.GAME:
        // 連続対局の場合は確認ダイアログを表示する。
        if (this.gameManager.settings.repeat >= 2) {
          this.showConfirmation({
            message: t.areYouSureWantToQuitGames,
            onOk: () => this.gameManager.stop(),
          });
        } else {
          this.gameManager.stop();
        }
        break;
      case AppState.CSA_GAME:
        // 確認ダイアログを表示する。
        this.showConfirmation({
          message: t.areYouSureWantToRequestQuit,
          onOk: () => this.csaGameManager.stop(),
        });
        break;
    }
  }

  showGameResults(): void {
    if (this.appState !== AppState.GAME) {
      return;
    }
    const results = this.gameManager.results;
    useMessageStore().enqueue({
      text: t.gameProgress,
      attachments: getMessageAttachmentsByGameResults(results),
    });
  }

  onGameEnd(results: GameResults, specialMoveType: SpecialMoveType): void {
    if (this.appState !== AppState.GAME) {
      return;
    }
    api.log(LogLevel.INFO, `game end: ${JSON.stringify(results)}`);
    if (results && results.total >= 2) {
      useMessageStore().enqueue({
        text: t.allGamesCompleted,
        attachments: getMessageAttachmentsByGameResults(results),
      });
    } else if (specialMoveType) {
      useMessageStore().enqueue({
        text: `${t.gameEnded}（${formatSpecialMove(specialMoveType)})`,
      });
    }
    this._appState = AppState.NORMAL;
  }

  onCSAGameEnd(): void {
    if (this.appState !== AppState.CSA_GAME) {
      return;
    }
    this._appState = AppState.NORMAL;
  }

  onFlipBoard(flip: boolean): void {
    const appSettings = useAppSettings();
    if (appSettings.boardFlipping !== flip) {
      useAppSettings().flipBoard();
    }
  }

  onSaveRecord(): void {
    const appSettings = useAppSettings();
    const fname = generateRecordFileName(
      this.recordManager.record.metadata,
      appSettings.recordFileNameTemplate,
      appSettings.defaultRecordFileFormat,
    );
    const path = join(appSettings.autoSaveDirectory, fname);
    this.saveRecordByPath(path).catch((e) => {
      useErrorStore().add(e);
    });
  }

  private onBeepShort(): void {
    const appSettings = useAppSettings();
    if (appSettings.clockSoundTarget === ClockSoundTarget.ONLY_USER && !this.isMovableByUser) {
      return;
    }
    beepShort({
      frequency: appSettings.clockPitch,
      volume: appSettings.clockVolume,
    });
  }

  private onBeepUnlimited(): void {
    const appSettings = useAppSettings();
    if (appSettings.clockSoundTarget === ClockSoundTarget.ONLY_USER && !this.isMovableByUser) {
      return;
    }
    beepUnlimited({
      frequency: appSettings.clockPitch,
      volume: appSettings.clockVolume,
    });
  }

  doMove(move: Move): void {
    if (this.appState !== AppState.NORMAL) {
      return;
    }
    if (!this.recordManager.appendMove({ move })) {
      return;
    }
    const appSettings = useAppSettings();
    playPieceBeat(appSettings.pieceVolume);
  }

  onFinish(): void {
    if (this.appState === AppState.ANALYSIS) {
      useMessageStore().enqueue({ text: "棋譜解析が終了しました。" });
      this._appState = AppState.NORMAL;
    }
  }

  showResearchDialog(): void {
    if (this._researchState === ResearchState.IDLE) {
      this._researchState = ResearchState.STARTUP_DIALOG;
    }
  }

  closeResearchDialog(): void {
    if (this._researchState === ResearchState.STARTUP_DIALOG) {
      this._researchState = ResearchState.IDLE;
    }
  }

  startResearch(researchSettings: ResearchSettings): void {
    if (this._researchState !== ResearchState.STARTUP_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    if (!researchSettings.usi) {
      useErrorStore().add(new Error("エンジンが設定されていません。"));
      return;
    }
    api
      .saveResearchSettings(researchSettings)
      .then(() => this.researchManager.launch(researchSettings))
      .then(() => {
        this._researchState = ResearchState.RUNNING;
        this.updateResearchPosition();
        const appSettings = useAppSettings();
        if (
          appSettings.tab !== Tab.SEARCH &&
          appSettings.tab !== Tab.PV &&
          appSettings.tab !== Tab.CHART &&
          appSettings.tab !== Tab.PERCENTAGE_CHART &&
          appSettings.tab !== Tab.MONITOR
        ) {
          useAppSettings().updateAppSettings({ tab: Tab.PV });
        }
      })
      .catch((e) => {
        useErrorStore().add("検討の初期化中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  stopResearch(): void {
    if (this._researchState !== ResearchState.RUNNING) {
      return;
    }
    this.researchManager.close();
    this._researchState = ResearchState.IDLE;
  }

  isResearchEngineSessionID(sessionID: number): boolean {
    return this.researchManager.isSessionExists(sessionID);
  }

  onUpdateSearchInfo(type: SearchInfoSenderType, info: SearchInfo): void {
    this.recordManager.updateSearchInfo(type, info);
  }

  startAnalysis(analysisSettings: AnalysisSettings): void {
    if (this.appState !== AppState.ANALYSIS_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    api
      .saveAnalysisSettings(analysisSettings)
      .then(() => this.analysisManager.start(analysisSettings))
      .then(() => {
        this._appState = AppState.ANALYSIS;
      })
      .catch((e) => {
        useErrorStore().add("検討の初期化中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  stopAnalysis(): void {
    if (this.appState !== AppState.ANALYSIS) {
      return;
    }
    this.analysisManager.close();
    this._appState = AppState.NORMAL;
  }

  startMateSearch(mateSearchSettings: MateSearchSettings): void {
    if (this.appState !== AppState.MATE_SEARCH_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    if (!mateSearchSettings.usi) {
      useErrorStore().add(new Error("エンジンが設定されていません。"));
      return;
    }
    api
      .saveMateSearchSettings(mateSearchSettings)
      .then(() => this.mateSearchManager.start(mateSearchSettings, this.recordManager.record))
      .then(() => {
        this._appState = AppState.MATE_SEARCH;
        const appSettings = useAppSettings();
        if (appSettings.tab !== Tab.SEARCH && appSettings.tab !== Tab.PV) {
          useAppSettings().updateAppSettings({ tab: Tab.SEARCH });
        }
      })
      .catch((e) => {
        useErrorStore().add("詰将棋探索の初期化中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  stopMateSearch(): void {
    if (this.appState !== AppState.MATE_SEARCH) {
      return;
    }
    this.mateSearchManager.close();
    this._appState = AppState.NORMAL;
  }

  onCheckmate(moves: Move[]): void {
    if (this.appState !== AppState.MATE_SEARCH) {
      return;
    }
    this._appState = AppState.NORMAL;
    const position = this.recordManager.record.position;
    this.showConfirmation({
      message: t.mateInNPlyDoYouWantToDisplay(moves.length),
      onOk: () => {
        this.showPVPreviewDialog({
          position,
          mate: moves.length,
          pv: moves,
        });
      },
    });
  }

  onNotImplemented(): void {
    if (this.appState !== AppState.MATE_SEARCH) {
      return;
    }
    useErrorStore().add(new Error(t.thisEngineNotSupportsMateSearch));
    this._appState = AppState.NORMAL;
  }

  onNoMate(): void {
    if (this.appState !== AppState.MATE_SEARCH) {
      return;
    }
    useMessageStore().enqueue({ text: t.noMateFound });
    this._appState = AppState.NORMAL;
  }

  onCheckmateError(e: unknown): void {
    if (this.appState !== AppState.MATE_SEARCH) {
      return;
    }
    useErrorStore().add(e);
    this._appState = AppState.NORMAL;
  }

  updateResearchPosition(): void {
    this.researchManager?.updatePosition(this.recordManager.record);
  }

  resetRecord(): void {
    if (this.appState != AppState.NORMAL) {
      return;
    }
    this.showConfirmation({
      message: t.areYouSureWantToClearRecord,
      onOk: () => {
        this.recordManager.reset();
      },
    });
  }

  updateRecordComment(comment: string): void {
    this.recordManager.updateComment(comment);
  }

  updateRecordBookmark(bookmark: string): void {
    this.recordManager.updateBookmark(bookmark);
  }

  insertSpecialMove(specialMoveType: SpecialMoveType): void {
    if (this.appState !== AppState.NORMAL) {
      return;
    }
    this.recordManager.appendMove({ move: specialMoveType });
  }

  startPositionEditing(): void {
    if (this.appState !== AppState.NORMAL) {
      return;
    }
    this.showConfirmation({
      message: t.areYouSureWantToClearRecord,
      onOk: () => {
        this._appState = AppState.POSITION_EDITING;
        this.recordManager.resetByCurrentPosition();
      },
    });
  }

  endPositionEditing(): void {
    if (this.appState === AppState.POSITION_EDITING) {
      this._appState = AppState.NORMAL;
    }
  }

  initializePositionBySFEN(sfen: string): void {
    if (this.appState != AppState.POSITION_EDITING) {
      return;
    }
    this.showConfirmation({
      message: t.areYouSureWantToDiscardPosition,
      onOk: () => {
        this.recordManager.resetBySFEN(sfen);
      },
    });
  }

  changeTurn(): void {
    if (this.appState == AppState.POSITION_EDITING) {
      this.recordManager.swapNextTurn();
    }
  }

  showPieceSetChangeDialog() {
    if (this.appState === AppState.POSITION_EDITING) {
      this._appState = AppState.PIECE_SET_CHANGE_DIALOG;
    }
  }

  closePieceSetChangeDialog(pieceSet?: PieceSet) {
    if (this.appState !== AppState.PIECE_SET_CHANGE_DIALOG) {
      return;
    }
    if (pieceSet) {
      this.recordManager.changePieceSet(pieceSet);
    }
    this._appState = AppState.POSITION_EDITING;
  }

  editPosition(change: PositionChange): void {
    if (this.appState === AppState.POSITION_EDITING) {
      this.recordManager.changePosition(change);
    }
  }

  goForward(): void {
    if (this.appState === AppState.NORMAL) {
      this.recordManager.goForward();
    }
  }

  goBack(): void {
    if (this.appState === AppState.NORMAL) {
      this.recordManager.goBack();
    }
  }

  changePly(ply: number): void {
    if (this.appState === AppState.NORMAL) {
      this.recordManager.changePly(ply);
    }
  }

  changeBranch(index: number): void {
    if (this.appState === AppState.NORMAL) {
      this.recordManager.changeBranch(index);
    }
  }

  swapWithNextBranch(): boolean {
    return this.recordManager.swapWithNextBranch();
  }

  swapWithPreviousBranch(): boolean {
    return this.recordManager.swapWithPreviousBranch();
  }

  removeCurrentMove(): void {
    if (this.appState !== AppState.NORMAL) {
      return;
    }
    if (this.recordManager.record.current.isLastMove) {
      this.recordManager.removeCurrentMove();
      return;
    }
    this.showConfirmation({
      message: t.areYouSureWantToDeleteFollowingMove(this.recordManager.record.current.ply),
      onOk: () => {
        this.recordManager.removeCurrentMove();
      },
    });
  }

  jumpToBookmark(bookmark: string): boolean {
    if (this.appState === AppState.NORMAL) {
      return this.recordManager.jumpToBookmark(bookmark);
    }
    return false;
  }

  copyRecordKIF(): void {
    const appSettings = useAppSettings();
    const str = exportKIF(this.recordManager.record, {
      returnCode: appSettings.returnCode,
    });
    navigator.clipboard.writeText(str);
  }

  copyRecordKI2(): void {
    const appSettings = useAppSettings();
    const str = exportKI2(this.recordManager.record, {
      returnCode: appSettings.returnCode,
    });
    navigator.clipboard.writeText(str);
  }

  copyRecordCSA(): void {
    const appSettings = useAppSettings();
    const str = exportCSA(this.recordManager.record, {
      returnCode: appSettings.returnCode,
      v3: appSettings.useCSAV3 ? { milliseconds: true } : undefined,
    });
    navigator.clipboard.writeText(str);
  }

  copyRecordUSIBefore(): void {
    const appSettings = useAppSettings();
    const str = this.recordManager.record.getUSI({
      startpos: appSettings.enableUSIFileStartpos,
      resign: appSettings.enableUSIFileResign,
    });
    navigator.clipboard.writeText(str);
  }

  copyRecordUSIAll(): void {
    const appSettings = useAppSettings();
    const str = this.recordManager.record.getUSI({
      startpos: appSettings.enableUSIFileStartpos,
      resign: appSettings.enableUSIFileResign,
      allMoves: true,
    });
    navigator.clipboard.writeText(str);
  }

  copyBoardSFEN(): void {
    const str = this.recordManager.record.sfen;
    navigator.clipboard.writeText(str);
  }

  copyRecordJKF(): void {
    const str = exportJKFString(this.recordManager.record);
    navigator.clipboard.writeText(str);
  }

  pasteRecord(data: string): void {
    if (this.appState !== AppState.NORMAL) {
      return;
    }
    const error = this.recordManager.importRecord(data);
    if (error) {
      useErrorStore().add(error);
      return;
    }
  }

  openRecord(path?: string, opt?: { ply?: number }): void {
    if (this.appState !== AppState.NORMAL || useBusyState().isBusy) {
      useErrorStore().add(t.pleaseEndActiveFeaturesBeforeOpenRecord);
      return;
    }
    useBusyState().retain();
    Promise.resolve()
      .then(() => {
        return path || api.showOpenRecordDialog();
      })
      .then((path) => {
        if (!path) {
          return;
        }
        const appSettings = useAppSettings();
        const autoDetect = appSettings.textDecodingRule == TextDecodingRule.AUTO_DETECT;
        return api.openRecord(path).then((data) => {
          const e = this.recordManager.importRecordFromBuffer(data, path, {
            autoDetect,
          });
          return e && Promise.reject(e);
        });
      })
      .then(() => {
        if (opt?.ply) {
          this.recordManager.changePly(opt.ply);
        }
      })
      .catch((e) => {
        useErrorStore().add("棋譜の読み込み中にエラーが出ました: " + e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  saveRecord(options?: { overwrite: boolean }): void {
    if (this.appState !== AppState.NORMAL || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    Promise.resolve()
      .then(() => {
        const path = this.recordManager.recordFilePath;
        if (options?.overwrite && path) {
          return path;
        }
        const appSettings = useAppSettings();
        const defaultPath =
          path ||
          generateRecordFileName(
            this.recordManager.record.metadata,
            appSettings.recordFileNameTemplate,
            appSettings.defaultRecordFileFormat,
          );
        return api.showSaveRecordDialog(defaultPath);
      })
      .then((path) => {
        if (!path) {
          return;
        }
        return this.saveRecordByPath(path, { detectGarbled: true }).then(() => {
          const fileFormat = detectRecordFileFormatByPath(path) as RecordFileFormat;
          const props = detectUnsupportedRecordProperties(this.recordManager.record, fileFormat);
          const items = Object.entries(props)
            .filter(([, v]) => v)
            .map(([k]) => {
              switch (k) {
                case "branch":
                  return t.branches;
                case "comment":
                  return t.comments;
                case "bookmark":
                  return t.bookmark;
                case "time":
                  return t.elapsedTime;
              }
            })
            .map((v) => ({ text: v })) as ListItem[];
          if (items.length) {
            useMessageStore().enqueue({
              text: t.followingDataNotSavedBecauseNotSupporetedBy(fileFormat),
              attachments: [{ type: "list", items }],
            });
          }
        });
      })
      .catch((e) => {
        useErrorStore().add(e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  private async saveRecordByPath(path: string, opt?: { detectGarbled: boolean }): Promise<void> {
    const appSettings = useAppSettings();
    const result = this.recordManager.exportRecordAsBuffer(path, {
      returnCode: appSettings.returnCode,
      detectGarbled: opt?.detectGarbled,
      csa: { v3: appSettings.useCSAV3 },
    });
    if (result instanceof Error) {
      throw result;
    }
    try {
      await api.saveRecord(path, result.data);
      if (result.garbled && !this.garbledNotified) {
        useMessageStore().enqueue({
          text: `${t.recordSavedWithGarbledCharacters}\n${t.pleaseConsiderToUseKIFU}\n${t.youCanChangeDefaultRecordFileFormatFromAppSettings}`,
        });
        this.garbledNotified = true;
      }
    } catch (e) {
      throw new Error(`${t.failedToSaveRecord}: ${e}`);
    }
  }

  restoreFromBackup(name: string): void {
    if (this.appState !== AppState.RECORD_FILE_HISTORY_DIALOG || useBusyState().isBusy) {
      return;
    }
    useBusyState().retain();
    api
      .loadRecordFileBackup(name)
      .then((data) => {
        const err = this.recordManager.importRecord(data, {
          type: RecordFormatType.KIF,
          markAsSaved: true,
        });
        if (err) {
          return Promise.reject(err);
        }
        this._appState = AppState.NORMAL;
      })
      .catch((e) => {
        useErrorStore().add(e);
      })
      .finally(() => {
        useBusyState().release();
      });
  }

  get remoteRecordFileURL() {
    return this.recordManager.sourceURL;
  }

  loadRemoteRecordFile(url?: string) {
    useBusyState().retain();
    this.recordManager
      .importRecordFromRemoteURL(url)
      .catch((e) => useErrorStore().add(e))
      .finally(() => useBusyState().release());
  }

  showJishogiPoints(): void {
    const position = this.recordManager.record.position;
    const blackTotalPoint = countJishogiPoint(position, Color.BLACK);
    const blackPoint = countJishogiDeclarationPoint(position, Color.BLACK);
    const black24 = judgeJishogiDeclaration(
      JishogiDeclarationRule.GENERAL24,
      position,
      Color.BLACK,
    );
    const black27 = judgeJishogiDeclaration(
      JishogiDeclarationRule.GENERAL27,
      position,
      Color.BLACK,
    );
    const whiteTotalPoint = countJishogiPoint(position, Color.WHITE);
    const whitePoint = countJishogiDeclarationPoint(position, Color.WHITE);
    const white24 = judgeJishogiDeclaration(
      JishogiDeclarationRule.GENERAL24,
      position,
      Color.WHITE,
    );
    const white27 = judgeJishogiDeclaration(
      JishogiDeclarationRule.GENERAL27,
      position,
      Color.WHITE,
    );
    useMessageStore().enqueue({
      text: t.jishogiPoints,
      attachments: [
        {
          type: "list",
          items: [
            {
              text: t.sente,
              children: [
                `Points (Total): ${blackTotalPoint}`,
                `Points (Declaration): ${blackPoint}`,
                `Rule-24: ${black24.toUpperCase()}`,
                `Rule-27: ${black27.toUpperCase()}`,
              ],
            },
            {
              text: t.gote,
              children: [
                `Points (Total): ${whiteTotalPoint}`,
                `Points (Declaration): ${whitePoint}`,
                `Rule-24: ${white24.toUpperCase()}`,
                `Rule-27: ${white27.toUpperCase()}`,
              ],
            },
          ],
        },
      ],
    });
  }

  get isMovableByUser() {
    switch (this.appState) {
      case AppState.NORMAL:
        return true;
      case AppState.GAME:
        return (
          (this.recordManager.record.position.color === Color.BLACK
            ? this.gameManager.settings.black.uri
            : this.gameManager.settings.white.uri) === uri.ES_HUMAN
        );
      case AppState.CSA_GAME:
        return (
          this.csaGameManager.isMyTurn && this.csaGameManager.settings.player.uri === uri.ES_HUMAN
        );
    }
    return false;
  }

  async onMainWindowClose(): Promise<void> {
    useBusyState().retain();
    try {
      await this.recordManager.saveBackup();
    } finally {
      useBusyState().release();
    }
  }

  private showConfirmation(confirmation: Confirmation): void {
    const lastAppState = this.appState;
    useConfirmationStore().show({
      ...confirmation,
      onOk: () => {
        if (this.appState !== lastAppState) {
          useErrorStore().add("確認ダイアログ表示中に他の操作が行われたため処理が中止されました。");
          return;
        }
        confirmation.onOk();
      },
    });
  }
}

export function createStore(): UnwrapNestedRefs<Store> {
  return new Store().reactive;
}

let store: UnwrapNestedRefs<Store>;

export function useStore(): UnwrapNestedRefs<Store> {
  if (!store) {
    store = createStore();
  }
  return store;
}
