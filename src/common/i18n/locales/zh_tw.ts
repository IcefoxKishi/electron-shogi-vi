import { Texts } from "@/common/i18n/text_template";

export const zh_tw: Texts = {
  electronShogi: "Electron將棋",
  clear: "清除",
  open: "開啟",
  saveOverwrite: "覆蓋檔案",
  newRecord: "新棋譜",
  openRecord: "打開棋譜",
  saveRecord: "保存棋譜",
  saveRecordAs: "另存棋譜",
  openAutoSavingDirectory: "打開自動保存目錄",
  exportPositionImage: "輸出局面圖",
  positionImage: "局面圖",
  batchConversion: "棋譜大量轉換",
  recordFileBatchConversion: "棋譜大量轉換",
  close: "關閉",
  quit: "離開",
  editing: "編輯",
  copyAsKIF: "複製KIF棋譜",
  copyAsKI2: "複製KI2棋譜",
  copyAsCSA: "複製CSA棋譜",
  copyAsUSI: "複製USI棋譜",
  copyAsSFEN: "複製SFEN局面",
  copyAsJKF: "複製JKF棋譜",
  copy: "拷貝",
  cut: "剪下",
  paste: "貼上",
  copyRecord: "複製棋譜",
  asKIF: "KIF形式",
  asKI2: "KI2形式",
  asCSA: "CSA形式",
  asUSIUntilCurrentMove: "USI形式(到目前手數為止)",
  asUSIAll: "USI形式(全部)",
  asJSONKifuFormat: "JSON Kifu Format",
  copyPositionAsSFEN: "複製局面(SFEN形式)",
  pasteRecordOrPosition: "貼上棋譜、局面",
  appendSpecialMove: "特殊手",
  deleteMoves: "刪除現在位置後的棋譜",
  view: "表示",
  toggleFullScreen: "切換全螢幕",
  defaultFontSize: "預設字體尺寸",
  largerFontSize: "增加字體尺寸",
  smallerFontSize: "縮小字體尺寸",
  settings: "設定",
  config: "設定",
  debug: "偵錯",
  toggleDevTools: "打開/關閉開發者工具顯示",
  logFile: "紀錄檔",
  openAppLog: "開啟程式紀錄檔",
  openUSILog: "開啟USI通訊紀錄檔",
  openCSALog: "開啟CSA通訊紀錄檔",
  tailAppLog: "即時顯示程式紀錄",
  tailUSILog: "即時顯示USI通訊紀錄",
  tailCSALog: "即時顯示CSA通訊紀錄",
  copyAppLogTailCommand: "複製即時顯示程式紀錄指令",
  copyUSILogTailCommand: "複製即時顯示USI通訊紀錄指令",
  copyCSALogTailCommand: "複製即時顯示CSA通訊紀錄指令",
  reloadCustomPieceImage: "重整自訂棋駒圖片",
  launchUSIEngine: "啟動USI引擎",
  connectToCSAServer: "連接CSA伺服器",
  adminMode: "管理模式",
  inAdminModeYouShouldInvokeCommandsManuallyAtPrompt: "在管理模式下，您需要手動輸入指令方可執行。",
  setoptionAndPrecedingCommandsWillBeSentAutomatically: "setoption 之前的指令將會被自動發送。",
  serverMustSupportShogiServerX1ModeLogIn: "對應的 shogi-server 必須支援擴展 (x1) 登入模式。",
  folders: "資料夾",
  notification: "通知",
  notificationTest: "通知測試",
  thisIsTestNotification: "這是測試用的通知。",
  app: "軟體",
  log: "紀錄檔",
  backup: "備份",
  cache: "快取",
  help: "協助",
  openWebSite: "官方網站",
  howToUse: "使用教學",
  openLatestReleasePage: "前往最新版發布頁面",
  openStableReleasePage: "前往安定版發布頁面",
  inputs: "輸入目錄",
  outputs: "輸出目錄",
  format: "格式",
  formats: "格式",
  subdirectories: "子目錄",
  separately: "個別",
  merge: "合併",
  createSubdirectories: "建立子目錄",
  nameConflictAction: "名稱衝突處理方式",
  numberSuffix: "附加編號",
  skip: "跳過該檔案",
  convert: "開始轉換",
  openLogFile: "打開記錄檔案",
  succeeded: "成功",
  failed: "失敗",
  skipped: "跳過",
  game: "對局",
  player: "玩家",
  server: "伺服器",
  selectFromHistory: "從紀錄選取",
  noHistory: "目前沒有紀錄",
  saveHistory: "保存紀錄",
  version: "版本",
  gameProgress: "對局過程",
  allGamesCompleted: "連續對局結束",
  wins: "勝利數目",
  draws: "平手數目",
  validGames: "有効対局数", // TODO: translate
  invalidGames: "無効対局数", // TODO: translate
  eloRatingDiff: "等級分相差",
  ignoreDraws: "引き分け無効", // TODO: translate
  drawsAreHalfWin: "平手作0.5勝",
  zValue: "Z值",
  significance5pc: "有意水準5%", // TODO: translate
  significance1pc: "有意水準1%", // TODO: translate
  gameEnded: "對局結束",
  offlineGame: "本地（單機）對局",
  csaOnlineGame: "通訊對局（CSA）",
  csaProtocolOnlineGame: "通訊對局（CSA協定）",
  csaProtocolV121: "CSA協定 1.2.1 標準",
  csaProtocolV121WithPVComment: "CSA協定 1.2.1 +思考註解",
  hostToConnect: "連接之伺服器",
  portNumber: "連接埠號碼",
  password: "密碼",
  showPassword: "顯示密碼",
  keepaliveInitialDelay: "Keepalive初始延遲",
  blankLinePing: "空行Ping",
  blankLinePingInitialDelay: "空行Ping初始延遲",
  blankLinePingInterval: "空行Ping間隔",
  logout: "登出",
  calculateJishogiPoints: "計算持將棋點數",
  jishogiPoints: "持將棋點數",
  displayGameResults: "確認戰績",
  interrupt: "中斷",
  stopGame: "對局中斷",
  resign: "投了",
  draw: "平手",
  impass: "持將棋",
  repetitionDraw: "千日手",
  mate: "詰死",
  noMate: "無詰",
  mateSearch: "詰搜尋",
  startMateSearch: "開始詰搜尋",
  stopMateSearch: "結束詰搜尋",
  noMateFound: "在目前的盤面中找不到詰。",
  timeout: "時間耗盡",
  foulWin: "反則勝利",
  foulLose: "反則敗北",
  enteringOfKing: "入玉勝利",
  winByDefault: "不戰勝",
  loseByDefault: "不戰敗",
  winByDeclaration: "勝利宣言",
  declareWinning: "勝利宣言",
  research: "檢討",
  startResearch: "檢討開始",
  endResearch: "結束檢討",
  recordAnalysis: "棋譜解析",
  analysis: "解析",
  analyze: "解析開始",
  stopAnalysis: "中斷解析",
  setupPosition: "編輯局面",
  startPositionSetup: "開始編輯局面",
  completePositionSetup: "結束編輯局面",
  changeTurn: "變更手番",
  initializePosition: "初始化局面",
  changePieceSet: "駒の増減", // TODO: translate
  appSettings: "程式設定",
  language: "語言",
  theme: "主題",
  standard: "標準",
  green: "綠色",
  cherryBlossom: "櫻花",
  customImage: "自定義圖片",
  autumn: "紅葉",
  snow: "雪",
  darkGreen: "深綠",
  dark: "深色主題",
  piece: "棋駒",
  singleKanjiPiece: "一文字駒",
  singleKanjiGothicPiece: "一文字駒（黑體）",
  singleKanjiDarkPiece: "一文字駒（深色）",
  singleKanjiGothicDarkPiece: "一文字駒（黑體・深色）",
  imageHasMarginsRemoveToDisplayLarger: "圖片含有透明邊界（去除後圖片會略為放大）",
  backgroundImage: "背景圖片",
  board: "棋盤",
  pieceStand: "駒台",
  lightWoodyTexture: "木目（亮色）",
  warmWoodTexture: "木目（暖色）",
  resin: "樹脂",
  transparent: "透明",
  boardOpacity: "盤面不透明度",
  pieceStandOpacity: "駒台不透明度",
  recordOpacity: "棋譜不透明度",
  displayFileAndRank: "顯示段・筋",
  displayLeftControls: "顯示左側操作按鈕",
  displayRightControls: "顯示右側操作按鈕",
  tabViewStyle: "分頁顯示形式",
  oneColumn: "1列",
  twoColumns: "2列",
  sounds: "音效",
  pieceLoudness: "棋駒音效",
  clockLoudness: "棋鐘音效大小",
  clockPitch: "棋鐘音效頻率",
  clockSoundTarget: "棋鐘音效對象",
  anyTurn: "所有手番",
  onlyHumanTurn: "只有玩家手番",
  defaultRecordFileFormat: "預設保存格式",
  textEncoding: "文字編碼",
  strict: "檔案原始編碼",
  autoDetect: "自動判定",
  newlineCharacter: "換行符號",
  old90sMac: "90年代Mac",
  autoSaving: "自動保存",
  autoSavingDirectory: "棋譜自動保存地點",
  recordFileName: "棋譜檔案名稱",
  select: "選擇",
  positionOfUSIOutput: "USI 局面紀錄格式",
  movesOfUSIOutput: "USI 棋譜紀錄格式",
  onlySFEN: "只有 SFEN",
  usiProtocol: "USI協定",
  translateOptionName: "選項名稱翻譯",
  functionalOnJapaneseOnly: "只有在日文選擇時有效",
  maxStartupTime: "最大起動等待時間",
  forDevelopers: "開發者用",
  enableAppLog: "輸出程式紀錄",
  enableUSILog: "輸出USI通訊紀錄",
  enableCSALog: "輸出CSA通訊紀錄",
  logLevel: "紀錄等級",
  engineSettings: "引擎設定",
  flipBoard: "盤面反轉",
  file: "檔案",
  recordFile: "棋譜檔案",
  executableFile: "可執行檔案",
  imageFile: "圖片檔案",
  unsaved: "未保存",
  remove: "刪除",
  deleteMove: "刪除該手",
  recordProperties: "棋譜情報",
  comments: "備註",
  commentsAndBookmarks: "備註・書籤",
  branches: "分支",
  bookmark: "書籤",
  bookmarkList: "書籤一覽",
  useBookmarkAsHeader: "將書籤名稱作為標題",
  moveComments: "棋步備註",
  searchLog: "思考",
  pv: "預測手順",
  mateShort: "詰",
  displayPVShort: "再現",
  evaluation: "評價值",
  eval: "評價値",
  estimatedWinRate: "期待勝率",
  evaluationAndEstimatedWinRate: "評價値・期待勝率",
  swapEachTurnChange: "手番側有利時為正值",
  alwaysSenteIsPositive: "先手有利時為正值",
  signOfEvaluation: "評價值符號",
  winRateCoefficient: "勝率換算係數",
  monitor: "監視", // TODO: translate
  hideTabView: "最小化",
  expandTabView: "展開分頁",
  sente: "先手",
  senteOrShitate: "先手（下手）",
  shitate: "下手",
  gote: "後手",
  goteOrUwate: "後手（上手）",
  uwate: "上手",
  swapSenteGote: "先後交換",
  currentPosition: "現在局面",
  enableEngineTimeout: "開啟引擎時間限制",
  setDifferentTimeForGote: "先後手時間不相同",
  nextTurn: "手番",
  elapsedTime: "消費時間",
  elapsed: "經過時間",
  rank: "順位",
  depth: "深度",
  searchEngine: "引擎",
  ponder: "對方手番時運算(Ponder)",
  numberOfThreads: "執行緒數",
  multiPV: "多重PV",
  startPosition: "開始局面",
  maxMoves: "最大手數",
  gameRepetition: "連續對局",
  jishogi: "持將棋",
  rule24: "24點法",
  rule27: "27點法",
  tryRule: "Try Rule", // TODO: translate
  autoRelogin: "自動重新登入",
  restartItEveryGame: "每局重新啟動",
  swapTurnWhenGameRepetition: "每局交換手番",
  outputComments: "輸出備註",
  saveRecordAutomatically: "自動保存棋譜",
  adjustBoardToHumanPlayer: "調整到玩家所在方向",
  adjustBoardAutomatically: "自動調整盤面方向",
  command: "指令",
  startGame: "對局開始",
  cancelGame: "取消對局",
  allottedTime: "持時間",
  byoyomi: "讀秒",
  increments: "增秒",
  startEndCriteria: "開始・結束條件",
  endCriteria1Move: "局面結束條件",
  outputSettings: "輸出設定",
  noOutputs: "不輸出",
  insertCommentToTop: "加入到前方",
  appendCommentToBottom: "在後方新增",
  insertToComment: "加入到備註欄",
  insertToRecord: "加入到棋譜",
  overwrite: "覆寫原檔案",
  fromPrefix: "從",
  fromSuffix: "",
  toPrefix: "到",
  toSuffix: "",
  plyPrefix: "第",
  plySuffix: "手",
  hoursSuffix: "小時",
  minutesSuffix: "分",
  secondsSuffix: "秒",
  engineManagement: "引擎管理",
  engineName: "引擎名稱",
  author: "作者",
  earlyPonder: "早期Ponder", // TODO: translate
  enginePath: "場所",
  openDirectory: "開啟資料夾",
  displayName: "表示名稱",
  invoke: "執行",
  resetToEngineDefaultValues: "回復至引擎預設設定",
  defaultValue: "預設値",
  noEngineRegistered: "尚未登錄引擎。",
  duplicate: "複製",
  add: "追加",
  recommended: "推薦",
  import: "匯入",
  saveAndClose: "保存並關閉",
  save: "保存",
  saveAs: "另存為",
  history: "歷史紀錄",
  clearHistory: "清除歷史紀錄",
  userFile: "使用者檔案",
  automaticBackup: "自動備份",
  restore: "復原",
  loadRecordFromWeb: "從網上取得棋譜",
  fetchLatestData: "最新データを取得", // TODO: translate
  sourceURL: "ソースURL", // TODO: translate
  ok: "OK",
  cancel: "取消",
  back: "返回",
  name: "名稱",
  prediction: "預測",
  best: "最善",
  nodes: "Node數",
  hashUsage: "Hash使用率",
  stop: "停止",
  resume: "重新開始",
  nonHandicap: "平手",
  lanceHandicap: "香落",
  rightLanceHandicap: "右香落",
  bishopHandicap: "角落",
  rookHandicap: "飛車落",
  rookLanceHandicap: "飛車香落",
  twoPiecesHandicap: "二枚落",
  fourPiecesHandicap: "四枚落",
  sixPiecesHandicap: "六枚落",
  eightPiecesHandicap: "八枚落",
  tenPiecesHandicap: "十枚落",
  tsumeShogi: "詰將棋",
  doubleKingTsumeShogi: "雙玉詰將棋",
  startDateTime: "開始日時",
  endDateTime: "結束日時",
  gameDate: "對局日",
  tournament: "棋戰",
  strategy: "戰型",
  gameTitle: "標題",
  timeLimit: "限時",
  blackTimeLimit: "先手限時",
  whiteTimeLimit: "後手限時",
  place: "地點",
  postedOn: "登錄於",
  note: "備註",
  senteShortName: "先手省略名",
  goteShortName: "後手省略名",
  opusNo: "作品編號",
  opusName: "作品名",
  publishedBy: "發表於",
  publishedOn: "發表年月",
  source: "來源",
  numberOfMoves: "手數",
  integrity: "完全性",
  recordCategory: "分類",
  award: "受賞",
  filterByOptionName: "搜尋設定名稱",
  filterByEngineName: "搜尋引擎名稱",
  bookStyle: "書籍風",
  gameStyle: "對局畫面風",
  thin: "細",
  bold: "粗",
  extraBold: "特粗",
  playerName: "對局者名稱",
  typeface: "字體",
  weight: "字體粗細",
  handLabel: "持駒標題",
  header: "標題",
  vertical: "垂直調整",
  size: "大小",
  none: "無",
  bgCover: "圖片置中",
  bgContain: "擴大表示",
  bgTile: "磁磚狀表示",
  inaccuracy: "緩手",
  dubious: "疑問手",
  mistake: "惡手",
  blunder: "大惡手",
  inaccuracyThreshold: "緩手閾値",
  dubiousThreshold: "疑問手閾値",
  mistakeThreshold: "惡手閾値",
  blunderThreshold: "大惡手閾値",
  gothic: "黑體",
  mincho: "明體",
  appVersion: "軟體版本",
  installed: "已安裝",
  stable: "安定版",
  latest: "最新版",
  updatedAt: "更新時間",
  createdAt: "建立時間",
  lastSent: "最後送出",
  lastReceived: "最後接收",
  protocolVersion: "協定版本",
  prompt: "指令",
  openPrompt: "打開指令視窗",
  forceQuit: "強制退出",
  forceClose: "強制關閉",
  blankLine: "空行",
  autoScroll: "自動捲動",
  showTimestamp: "顯示時間戳章",
  highlightByPartialMatch: "反白部分一致部分",
  csaServer: "CSA伺服器",
  usiEngine: "USI引擎",
  noRunningUSIEngine: "目前沒有啟動中的USI引擎。",
  noConnectedCSAServer: "尚未連接CSA伺服器。",
  willBeRemovedFromTheListSoon: "由於 Session 結束，將會自一覽清除。",
  typeCommandHereAndPressEnter: "輸入指令後按下 Enter 以發送",
  allowBlankLine: "允許空行",
  removeSpaceFromBothEnds: "消除前後空白",
  collapseSequentialSpaces: "整理連續空白",
  typeCustomTitleHere: "輸入自定義標題",
  displayEmptyElements: "顯示未定義資料",
  waitingForNewGame: "正在等待下一場對局開始。",
  waitingForPlayerSetup: "正在等待對局者準備。",
  insertedComment: "已加入備註。",
  conversionCompleted: "轉換完成。",
  tryingToConnectAndLoginToCSAServer: "正在連接並登入CSA伺服器。",
  inBrowserLogsOutputToConsoleAndIgnoreThisSetting:
    "※在瀏覽器版本中紀錄會於 console 中顯示，並無視此處的設定。",
  shouldRestartToApplyLogSettings: "※您需要重新啟動本程式以使用變更後的紀錄設定。",
  canOpenLogDirectoryFromMenu: "※紀錄的輸出檔案可以在「偵錯」-「開啟紀錄檔案資料夾」開啟。",
  hasNoOldLogCleanUpFeature: "※現在並沒有舊紀錄的自動刪除機制。",
  processingPleaseWait: "現在處理中。請稍待一會。",
  importingFollowingRecordOrPosition: "將匯入以下棋譜（局面）。",
  supportsKIF_KI2_CSA_USI_SFEN_JKF: "※支援KIF/KI2/CSA/USI/SFEN/JKF形式。",
  pleasePasteRecordIntoTextArea: "※請在文字輸入區域貼上您的棋譜。",
  pleaseSpecifyPlainTextURL: "※プレーンテキストのURLを指定してください。", // TODO: translate
  redirectNotSupported: "※リダイレクトはサポートされていません。", // TODO: translate
  desktopVersionPastesAutomatically: "※安裝程式版將會自動貼上棋譜。",
  earlyPonderFeatureSendsPonderhitCommandWithYaneuraOusNonStandardOptions:
    "早期Ponder機能は、やねうら王の独自オプションでponderhitコマンドを送信します。", // TODO: translate
  ifYourEngineNotSupportTheOptionsItMayCauseUnexpectedBehavior:
    "エンジンがこのオプションに対応していない場合、予期しない動作を引き起こす可能性があります。", // TODO: translate
  someLogsDisabled: "部份 log 已被無效化。",
  logsRecommendedForCSAProtocol: "若使用CSA協定對局，建議輸出各項紀錄。",
  pleaseEnableLogsAndRestart: "請在程式設定中開啟紀錄並重新啟動本程式。",
  notSendPVOnStandardCSAProtocol: "在標準的CSA協定中不會送出評價值以及思考棋步。",
  csaProtocolSendPlaintextPassword: "在CSA協定中，密碼為明文傳輸。",
  passwordWillSavedPlaintextBecauseOSSideEncryptionNotAvailable:
    "由於無法使用系統的加密機能，輸入的密碼將會以明文保存。",
  pleaseUncheckSaveHistoryIfNotWantSave: "若不想保存密碼，請不要將「保存紀錄」勾選。",
  csaProtocolSendPlaintextPasswordRegardlessOfHistory: "不過，CSA協定仍會以明文傳輸您的密碼。",
  whenNewVersionIsAvailableItWillBeNotified: "將會在新版本發布時進行通知。",
  pleaseCheckMessageThisIsTestNotificationByAboveButton:
    "上方按鈕會發送「這是測試用的通知。」的通知訊息。",
  ifNotWorkYouShouldAllowNotificationOnOSSetting:
    "若無法顯示，請在使用的作業系統中許可本程式的通知。",
  areYouSureWantToResign: "確定要投了嗎？",
  areYouSureWantToDoDeclaration: "確定要進行勝利宣言嗎？",
  areYouSureWantToQuitGames: "要中斷連續對局嗎？",
  areYouSureWantToRequestQuit: "若提出中斷要求，可能會被判負。請問您要繼續嗎？",
  areYouSureWantToClearRecord: "將會刪除現在的棋譜。請問您要繼續嗎？",
  areYouSureWantToDiscardPosition: "將不會保存現在的局面。請問您要繼續嗎？",
  areYouSureWantToOpenFileInsteadOfCurrentRecord:
    "會將現在的棋譜關閉並開啟別的檔案，請問您要繼續嗎？",
  areYouSureWantToClearHistory: "將清除紀錄。請問您要繼續嗎？",
  yamlFormatSettingCopiedToClipboard: "YAML形式の設定をクリップボードにコピーしました。", // TODO: translate
  jsonFormatSettingCopiedToClipboard: "JSON形式の設定をクリップボードにコピーしました。", // TODO: translate
  usiCsaBridgeCommandCopiedToClipboard: "usi-csa-bridge コマンドをクリップボードにコピーしました。", // TODO: translate
  youCanNotCloseAppWhileCSAOnlineGame: "由於CSA協定正在使用中，本程式無法被關閉。",
  fileExtensionNotSupported: "無法支援的副檔名。",
  errorOccuredWhileDisconnectingFromCSAServer: "在與CSA伺服器中斷連線時發生錯誤。",
  failedToConnectToCSAServer: "無法連接CSA伺服器。",
  errorOccuredWhileLogoutFromCSAServer: "在登出 CSA 伺服器時發生錯誤。",
  disconnectedFromCSAServer: "與CSA伺服器的連接結束。",
  csaServerLoginDenied: "您對CSA伺服器的登入被拒絕。",
  thisFeatureNotAvailableOnWebApp: "Web版無法使用本機能",
  failedToStartNewGame: "對局開始失敗。",
  errorOccuredWhileEndingGame: "在對局結束時發生錯誤。",
  failedToSendGoCommand: "無法送出go指令。",
  failedToSendPonderCommand: "無法送出ponder指令。",
  failedToSendStopCommand: "無法送出stop指令。",
  failedToShutdownEngines: "引擎無法正常結束。",
  failedToCheckUpdates: "無法確認更新。",
  failedToSaveRecord: "棋譜保存失敗。",
  failedToParseSFEN: "SFEN讀取失敗。",
  failedToDetectRecordFormat: "無法判別棋譜形式。",
  unknown: "不明",
  unknownFileExtension: "未知的檔案形式。",
  emptyRecordInput: "您尚未輸入棋譜。",
  invalidPieceName: "不合法的棋駒",
  invalidTurn: "不合法的手番",
  invalidMove: "不合法的棋步",
  invalidMoveNumber: "不合法的手數",
  invalidDestination: "不合法的移動目的地",
  pieceNotExists: "不存在的棋駒",
  invalidLine: "不存在的行",
  invalidBoard: "不合法的盤面",
  invalidHandPiece: "不合法的持駒",
  invalidUSI: "不合法的USI",
  backgroundImageFileNotSelected: "尚未選取背景圖片。",
  pieceImageFileNotSelected: "尚未選取棋駒圖片。",
  boardImageFileNotSelected: "尚未選取盤面圖片。",
  pieceStandImageFileNotSelected: "尚未選取駒台圖片。",
  pieceVolumeMustBe0To100Percent: "請在0%～100%之間指定棋駒音效大小。",
  clockVolumeMustBe0To100Percent: "請在0%～100%之間指定棋鐘音效大小。",
  clockPitchMustBe220To880Hz: "請在220Hz～880Hz之間指定棋鐘音效頻率。",
  engineTimeoutMustBe1To300Seconds: "請在1秒～300秒之間指定引擎執行最長時間。",
  coefficientInSigmoidMustBeGreaterThan0: "請將勝率換算係數填為大於0之值。",
  inaccuracyThresholdMustBe1To100Percent: "請在0%～100%之間指定緩手門檻。",
  dubiousThresholdMustBe1To100Percent: "請在0%～100%之間指定疑問手門檻。",
  mistakeThresholdMustBe1To100Percent: "請在0%～100%之間指定惡手門檻。",
  blunderThresholdMustBe1To100Percent: "請在0%～100%之間指定大惡手門檻。",
  recordSavedWithGarbledCharacters: "保存的棋譜有部分可能會造成亂碼。",
  pleaseConsiderToUseKIFU: "建議您使用KIFU形式(UTF-8)儲存您的棋譜。",
  youCanChangeDefaultRecordFileFormatFromAppSettings: "預設棋譜檔案格式可以在程式設定中進行更動。",
  inaccuracyThresholdMustBeLessThanDubiousThreshold: "緩手門檻應小於疑問手門檻。",
  dubiousThresholdMustBeLessThanMistakeThreshold: "疑問手門檻應小於惡手門檻。",
  mistakeThresholdMustBeLessThanBlunderThreshold: "惡手門檻應小於大惡手門檻。",
  thisEngineNotSupportsMateSearch: "這個引擎不支援詰將棋搜索。",
  pleaseEndActiveFeaturesBeforeOpenRecord: "請關閉現正運行的功能再開啟棋譜。",
  bothTimeLimitAndByoyomiAreNotSet: "持時間與讀秒尚未設置。",
  canNotUseByoyomiWithFischer: "讀秒與 Fischer 選項無法同時併用。",
  repeatsMustBeOneIfHumanPlayerIncluded:
    "人が対局する場合、連続対局の回数は1以外を設定できません。", // TODO: translate
  protocolVersionNotSelected: "請選擇協定版本。",
  hostNameIsEmpty: "主機名稱為空。",
  invalidPortNumber: "不可用的連接埠號碼。",
  idIsEmpty: "ID 為空。",
  idContainsSpace: "ID 含有空白字符。",
  passwordContainsSpace: "密碼含有空白字符。",
  tcpKeepaliveInitialDelayMustBePositive: "請輸入正確的TCP Keepalive初始延遲時間。",
  blankLinePingInitialDelayMustBeGreaterThanOrEqualTo30: "請輸入正確的空行輸出初始延遲時間。",
  blankLinePingIntervalMustBeGreaterThanOrEqualTo30: "請輸入正確的空行輸出間隔時間。",
  engineNotSelected: "尚未選擇引擎。",
  forExportingConversionLogPleaseEnableAppLogsAndSetLogLevelDebugAndRestart:
    "如要監看轉換紀錄，請在程式設定內設定 log level 到 Debug 並重新啟動本程式。",
  sourceDirectoryNotSpecified: "輸入目錄尚未被指定。",
  sourceFormatsNotSpecified: "輸入格式尚未被指定。",
  destinationDirectoryNotSpecified: "輸出格式尚未被指定。",
  destinationFileNotSpecified: "輸出檔案尚未被指定。",
  totalNumber: (n: number) => `總計 ${n} 筆`,
  number: (n: number) => `${n} 筆`,
  tryToReloginToCSAServerNSecondsLater: (n) => `請在${n}秒後再次嘗試登入 CSA 伺服器。`,
  mateInNPlyDoYouWantToDisplay: (n) => `尋找到${n}手詰。要顯示結果嗎？`,
  insertedNMovesToRecord: (n: number) => `已加入${n}手到棋譜。`,
  errorsOccurred: (n) => `發生 ${n} 種類的錯誤。`,
  between: (a, b) => `自 ${a} 到 ${b} `,
  addNthEngine: (n) => `追加第 ${n} 個引擎`,
  copyOf: (name) => `${name} 的拷貝`,
  keepLatest: (n) => `到最新${n}件`,
  followingDataNotSavedBecauseNotSupporetedBy: (fileFormat: string) =>
    `以下的資料由於 ${fileFormat} 格式無法支援的原因無法保存。`,
  areYouSureWantToDeleteFollowingMove: (n) => `將會刪除${n}手目以後的棋譜。請問您要繼續嗎？`,
  failedToOpenDirectory: (path) => `無法開啟檔案目錄：${path}`,
  unexpectedEventSenderPleaseReport(sender) {
    return `無法預期的事件發送方已發生。請將該錯誤訊息告知開發者，謝謝。 [${sender}]`;
  },
  unexpectedHTTPMethodPleaseReport(method) {
    return `無法預期的 HTTP 方法。請將該錯誤訊息告知開發者，謝謝。 [${method}]`;
  },
  unexpectedRequestURLPleaseReport(url) {
    return `無法從 URL 獲取資訊。請將該錯誤訊息告知開發者，謝謝。 [${url}]`;
  },
  noResponseFromEnginePleaseExtendTimeout(seconds) {
    return `引擎在${seconds}秒内沒有回應。若引擎的啟動時間稍長，請在設定中調整引擎最長等待時間。`;
  },
  stableVersionReleased(version: string) {
    return `安定版 ${version} 已經發布！`;
  },
  latestVersionReleased(version: string) {
    return `最新版 ${version} 已經發布！`;
  },
};
