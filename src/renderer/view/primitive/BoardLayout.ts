import {
  BoardImageType,
  BoardLabelType,
  KingPieceType,
  PieceStandImageType,
} from "@/common/settings/app";
import {
  handPieceTypes,
  ImmutableHand,
  PieceType,
  Color,
  Move,
  Piece,
  ImmutablePosition,
  reverseColor,
  Square,
} from "tsshogi";
import preloadImage from "@/renderer/assets/preload";
import { RectSize } from "@/common/assets/geometry";
import { getPieceImageAssetName, pieceAssetTypes } from "@/common/assets/pieces";

type PieceImages = {
  [color in Color]: {
    [pieceType in PieceType | "king2"]: string;
  };
};

const layoutTemplate = {
  frame: {
    width: 1471,
    height: 959,
  },
  board: {
    x: 296.5,
    y: 0,
    width: 878,
    height: 960,
    squreWidth: 94.85,
    squreHeight: 104,
    leftSquarePadding: 12.6,
    topSquarePadding: 12.8,
    leftPiecePadding: 16.0,
    topPiecePadding: 18.5,
    highlight: {
      selected: { "background-color": "#0088ff", opacity: "0.8" },
      lastMoveTo: { "background-color": "#44cc44", opacity: "0.8" },
      lastMoveFrom: { "background-color": "#44cc44", opacity: "0.4" },
    },
  },
  label: {
    fontSize: 24,
  },
  piece: {
    width: 88,
    height: 93,
  },
  hand: {
    black: {
      x: 1184,
      y: 600,
    },
    white: {
      x: 0,
      y: 0,
    },
    width: 288,
    height: 360,
    highlight: {
      selected: { "background-color": "#ff4800", opacity: "0.7" },
    },
  },
  turn: {
    black: {
      x: 1184,
      y: 425,
      y2: 490,
    },
    white: {
      x: 0,
      y: 495,
      y2: 430,
    },
    width: 288,
    height: 45,
    fontSize: 32,
  },
  playerName: {
    black: {
      x: 1184,
      y: 480,
      y2: 545,
    },
    white: {
      x: 0,
      y: 370,
      y2: 370,
    },
    width: 288,
    height: 45,
    fontSize: 25,
  },
  clock: {
    black: {
      x: 1184,
      y: 535,
    },
    white: {
      x: 0,
      y: 425,
    },
    width: 288,
    height: 55,
    fontSize: 40,
  },
  control: {
    left: {
      x: 0,
      y: 547,
      width: 288,
      height: 412,
      fontSize: 26,
    },
    right: {
      x: 1184,
      y: 0,
      width: 288,
      height: 412,
      fontSize: 26,
    },
  },
};

function getPieceTextureMap(template: string, kingPieceType: KingPieceType): PieceImages {
  const black: { [key: string]: string } = {};
  const white: { [key: string]: string } = {};
  for (const type of pieceAssetTypes) {
    black[type] = template.replaceAll("${piece}", getPieceImageAssetName(Color.BLACK, type));
    white[type] = template.replaceAll("${piece}", getPieceImageAssetName(Color.WHITE, type));
  }
  const m = {
    black,
    white,
  } as PieceImages;
  if (kingPieceType === KingPieceType.GYOKU_AND_GYOKU) {
    m.black.king = m.black.king2;
    m.white.king = m.white.king2;
  }
  return m;
}

function getBoardGridURL(type: BoardImageType): string {
  switch (type) {
    default:
      return "./board/grid.svg";
    case BoardImageType.DARK:
      return "./board/grid_white.svg";
  }
}

function getBoardTextureURL(type: BoardImageType, customURL?: string): string | null {
  switch (type) {
    case BoardImageType.LIGHT:
      return "./board/wood_light.png";
    case BoardImageType.WARM:
      return "./board/wood_warm.png";
    case BoardImageType.CUSTOM_IMAGE:
      return customURL || null;
  }
  return null;
}

const boardBackgroundColorMap = {
  [BoardImageType.LIGHT]: "rgba(0, 0, 0, 0)",
  [BoardImageType.WARM]: "rgba(0, 0, 0, 0)",
  [BoardImageType.RESIN]: "#d69b00",
  [BoardImageType.RESIN2]: "#efbf63",
  [BoardImageType.RESIN3]: "#ad7624",
  [BoardImageType.GREEN]: "#598459",
  [BoardImageType.CHERRY_BLOSSOM]: "#ecb6b6",
  [BoardImageType.AUTUMN]: "#d09f51",
  [BoardImageType.SNOW]: "#c3c0d3",
  [BoardImageType.DARK_GREEN]: "#465e5e",
  [BoardImageType.DARK]: "#333333",
  [BoardImageType.CUSTOM_IMAGE]: "rgba(0, 0, 0, 0)",
};

function getPieceStandTextureURL(type: PieceStandImageType, customURL?: string): string | null {
  switch (type) {
    case PieceStandImageType.CUSTOM_IMAGE:
      return customURL || null;
  }
  return null;
}

const pieceStandBackgroundColorMap = {
  [PieceStandImageType.STANDARD]: "#8b4513",
  [PieceStandImageType.GREEN]: "#527a52",
  [PieceStandImageType.CHERRY_BLOSSOM]: "#e8a9a9",
  [PieceStandImageType.AUTUMN]: "#792509",
  [PieceStandImageType.SNOW]: "#9c98b7",
  [PieceStandImageType.DARK_GREEN]: "#465e5e",
  [PieceStandImageType.DARK]: "#333333",
  [PieceStandImageType.CUSTOM_IMAGE]: "rgba(0, 0, 0, 0)",
};

const handLaytoutRule = {
  black: {
    pawn: { row: 3, column: 0, width: 2 },
    lance: { row: 2, column: 0, width: 1 },
    knight: { row: 2, column: 1, width: 1 },
    silver: { row: 1, column: 0, width: 1 },
    gold: { row: 1, column: 1, width: 1 },
    bishop: { row: 0, column: 0, width: 1 },
    rook: { row: 0, column: 1, width: 1 },
    king: { row: 0, column: 0, width: 0 },
    promPawn: { row: 0, column: 0, width: 0 },
    promLance: { row: 0, column: 0, width: 0 },
    promKnight: { row: 0, column: 0, width: 0 },
    promSilver: { row: 0, column: 0, width: 0 },
    horse: { row: 0, column: 0, width: 0 },
    dragon: { row: 0, column: 0, width: 0 },
  },
  white: {
    pawn: { row: 0, column: 0, width: 2 },
    lance: { row: 1, column: 1, width: 1 },
    knight: { row: 1, column: 0, width: 1 },
    silver: { row: 2, column: 1, width: 1 },
    gold: { row: 2, column: 0, width: 1 },
    bishop: { row: 3, column: 1, width: 1 },
    rook: { row: 3, column: 0, width: 1 },
    king: { row: 0, column: 0, width: 0 },
    promPawn: { row: 0, column: 0, width: 0 },
    promLance: { row: 0, column: 0, width: 0 },
    promKnight: { row: 0, column: 0, width: 0 },
    promSilver: { row: 0, column: 0, width: 0 },
    horse: { row: 0, column: 0, width: 0 },
    dragon: { row: 0, column: 0, width: 0 },
  },
};

type FrameLayout = {
  style: { [key: string]: string };
  size: RectSize;
};

type BoardLayout = {
  gridImagePath: string;
  textureImagePath: string | null;
  x: number;
  y: number;
  style: { [key: string]: string };
};

type LabelLayout = {
  id: string;
  character: string;
  style: { [key: string]: string };
};

type PieceLayout = {
  id: string;
  imagePath: string;
  style: { [key: string]: string };
};

type SquareLayout = {
  id: number;
  file: number;
  rank: number;
  style: { [key: string]: string };
  backgroundStyle: { [key: string]: string };
};

type HandPieceLayout = {
  id: string;
  imagePath: string;
  style: { [key: string]: string };
};

type HandPointerLayout = {
  id: string;
  type: PieceType;
  style: { [key: string]: string };
  backgroundStyle: { [key: string]: string };
};

type HandLayout = {
  textureImagePath: string | null;
  style: { [key: string]: string };
  backgroundStyle: { [key: string]: string };
  pieces: HandPieceLayout[];
  pointers: HandPointerLayout[];
};

type PromotionLayout = {
  promoteImagePath: string;
  notPromoteImagePath: string;
  style: { [key: string]: string };
};

type TurnLayout = {
  style: { [key: string]: string };
};

type PlayerNameLayout = {
  style: { [key: string]: string };
};

type ClockLayout = {
  style: { [key: string]: string };
};

type ControlLayout = {
  left: {
    style: { [key: string]: string };
  };
  right: {
    style: { [key: string]: string };
  };
};

export type FullLayout = {
  frame: FrameLayout;
  board: BoardLayout;
  labels: LabelLayout[];
  piece: PieceLayout[];
  square: SquareLayout[];
  blackHand: HandLayout;
  whiteHand: HandLayout;
  promotion: PromotionLayout | null;
  turn: TurnLayout;
  blackPlayerName: PlayerNameLayout;
  whitePlayerName: PlayerNameLayout;
  blackClock?: ClockLayout;
  whiteClock?: ClockLayout;
  control: ControlLayout;
};

const rankCharMap: { [n: number]: string } = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
};

export type AssetConfig = {
  boardImageType: BoardImageType;
  customBoardImageURL?: string;
  pieceStandImageType: PieceStandImageType;
  customPieceStandImageURL?: string;
  pieceImageURLTemplate: string;
  kingPieceType: KingPieceType;
};

export type LayoutConfig = {
  boardImageOpacity: number;
  pieceStandImageOpacity: number;
  boardLabelType: BoardLabelType;
  upperSizeLimit: RectSize;
  flip?: boolean;
  hideClock?: boolean;
};

export default class LayoutBuilder {
  private pieceImages: PieceImages;
  private boardGridImage: string;
  private boardTextureImage: string | null;
  private pieceStandImage: string | null;

  constructor(private assetConfig: AssetConfig) {
    this.pieceImages = getPieceTextureMap(
      this.assetConfig.pieceImageURLTemplate,
      this.assetConfig.kingPieceType,
    );
    this.boardGridImage = getBoardGridURL(this.assetConfig.boardImageType);
    this.boardTextureImage = getBoardTextureURL(
      this.assetConfig.boardImageType,
      this.assetConfig.customBoardImageURL,
    );
    this.pieceStandImage = getPieceStandTextureURL(
      this.assetConfig.pieceStandImageType,
      this.assetConfig.customPieceStandImageURL,
    );
  }

  preload(): void {
    preloadImage(this.boardGridImage);
    if (this.boardTextureImage) {
      preloadImage(this.boardTextureImage);
    }
    if (this.pieceStandImage) {
      preloadImage(this.pieceStandImage);
    }
    Object.values(this.pieceImages.black).forEach(preloadImage);
    Object.values(this.pieceImages.white).forEach(preloadImage);
  }

  build(
    config: LayoutConfig,
    position: ImmutablePosition,
    lastMove: Move | null | undefined,
    pointer: Square | Piece | null | undefined,
    reservedMoveForPromotion: Move | null | undefined,
  ): FullLayout {
    let ratio = config.upperSizeLimit.width / layoutTemplate.frame.width;
    if (layoutTemplate.frame.height * ratio > config.upperSizeLimit.height) {
      ratio = config.upperSizeLimit.height / layoutTemplate.frame.height;
    }

    const buildFrameLayout = (): FrameLayout => {
      const height = layoutTemplate.frame.height * ratio;
      const width = layoutTemplate.frame.width * ratio;
      return {
        style: {
          height: height + "px",
          width: width + "px",
        },
        size: new RectSize(width, height),
      };
    };

    const buildBoardLayout = (): BoardLayout => {
      const x = layoutTemplate.board.x * ratio;
      const y = layoutTemplate.board.y * ratio;
      const width = layoutTemplate.board.width * ratio;
      const height = layoutTemplate.board.height * ratio;
      const bgColor = boardBackgroundColorMap[this.assetConfig.boardImageType];
      const style = {
        "background-color": bgColor,
        left: x + "px",
        top: y + "px",
        height: height + "px",
        width: width + "px",
        opacity: config.boardImageOpacity.toString(),
      };
      return {
        gridImagePath: this.boardGridImage,
        textureImagePath: this.boardTextureImage,
        x,
        y,
        style,
      };
    };

    const buildLabelLayout = (boardLayout: BoardLayout): LabelLayout[] => {
      const layouts: LabelLayout[] = [];
      if (config.boardLabelType == BoardLabelType.NONE) {
        return layouts;
      }
      const fontSize = layoutTemplate.label.fontSize * ratio;
      const shadow = fontSize * 0.1;
      const commonStyle = {
        color: "black",
        "font-size": fontSize + "px",
        "font-weight": "bold",
        "text-shadow": `${shadow}px ${shadow}px  ${shadow}px white`,
      };
      for (let rank = 1; rank <= 9; rank++) {
        const x =
          boardLayout.x -
          fontSize * 0.5 +
          (config.flip ? 0 : layoutTemplate.board.width) * ratio +
          layoutTemplate.board.leftPiecePadding * 0.5 * ratio * (config.flip ? 1 : -1);
        const y =
          boardLayout.y -
          fontSize * 0.5 +
          (layoutTemplate.board.topSquarePadding +
            ((config.flip ? 10 - rank : rank) - 0.5) * layoutTemplate.board.squreHeight) *
            ratio;
        layouts.push({
          id: "rank" + rank,
          character: rankCharMap[rank],
          style: {
            left: x + "px",
            top: y + "px",
            ...commonStyle,
          },
        });
      }
      for (let file = 1; file <= 9; file++) {
        const x =
          boardLayout.x -
          fontSize * 0.5 +
          (layoutTemplate.board.leftPiecePadding +
            (9.5 - (config.flip ? 10 - file : file)) * layoutTemplate.board.squreWidth) *
            ratio;
        const y =
          boardLayout.y -
          fontSize * 0.6 +
          (config.flip ? layoutTemplate.board.height : 0) * ratio +
          layoutTemplate.board.topSquarePadding * 0.7 * ratio * (config.flip ? -1 : 1);
        layouts.push({
          id: "file" + file,
          character: String(file),
          style: {
            left: x + "px",
            top: y + "px",
            ...commonStyle,
          },
        });
      }
      return layouts;
    };

    const buildPieceLayout = (boardLayout: BoardLayout): PieceLayout[] => {
      const layouts: PieceLayout[] = [];
      position.board.listNonEmptySquares().forEach((square) => {
        const piece = position.board.at(square) as Piece;
        const id = piece.id + square.index;
        const displayColor = config.flip ? reverseColor(piece.color) : piece.color;
        const pieceType =
          piece.type == PieceType.KING && piece.color == Color.BLACK ? "king2" : piece.type;
        const imagePath = this.pieceImages[displayColor][pieceType];
        const x =
          boardLayout.x +
          (layoutTemplate.board.leftPiecePadding +
            layoutTemplate.board.squreWidth * (config.flip ? square.opposite : square).x) *
            ratio;
        const y =
          boardLayout.y +
          (layoutTemplate.board.topPiecePadding +
            layoutTemplate.board.squreHeight * (config.flip ? square.opposite : square).y) *
            ratio;
        const width = layoutTemplate.piece.width * ratio;
        const height = layoutTemplate.piece.height * ratio;
        layouts.push({
          id,
          imagePath,
          style: {
            left: x + "px",
            top: y + "px",
            width: width + "px",
            height: height + "px",
          },
        });
      });
      return layouts;
    };

    const buildSquareLayout = (boardLayout: BoardLayout): SquareLayout[] => {
      const layouts: SquareLayout[] = [];
      Square.all.forEach((square) => {
        const id = square.index;
        const { file } = square;
        const { rank } = square;
        const x =
          boardLayout.x +
          (layoutTemplate.board.leftSquarePadding +
            layoutTemplate.board.squreWidth * (config.flip ? square.opposite : square).x) *
            ratio;
        const y =
          boardLayout.y +
          (layoutTemplate.board.topSquarePadding +
            layoutTemplate.board.squreHeight * (config.flip ? square.opposite : square).y) *
            ratio;
        const width = layoutTemplate.board.squreWidth * ratio;
        const height = layoutTemplate.board.squreHeight * ratio;
        const style = {
          left: x + "px",
          top: y + "px",
          width: width + "px",
          height: height + "px",
        };
        let backgroundStyle = style;
        if (lastMove && square.equals(lastMove.to)) {
          backgroundStyle = {
            ...backgroundStyle,
            ...layoutTemplate.board.highlight.lastMoveTo,
          };
        }
        if (lastMove && lastMove.from instanceof Square && square.equals(lastMove.from)) {
          backgroundStyle = {
            ...backgroundStyle,
            ...layoutTemplate.board.highlight.lastMoveFrom,
          };
        }
        if (pointer instanceof Square && pointer.equals(square)) {
          backgroundStyle = {
            ...backgroundStyle,
            ...layoutTemplate.board.highlight.selected,
          };
        }
        layouts.push({
          id,
          file,
          rank,
          style,
          backgroundStyle,
        });
      });
      return layouts;
    };

    const buildHandLayout = (color: Color, hand: ImmutableHand): HandLayout => {
      const displayColor = config.flip ? reverseColor(color) : color;
      const bgColor = pieceStandBackgroundColorMap[this.assetConfig.pieceStandImageType];
      const standX = layoutTemplate.hand[displayColor].x * ratio;
      const standY = layoutTemplate.hand[displayColor].y * ratio;
      const standWidth = layoutTemplate.hand.width * ratio;
      const standHeight = layoutTemplate.hand.height * ratio;
      const style = {
        left: standX + "px",
        top: standY + "px",
        width: standWidth + "px",
        height: standHeight + "px",
      };
      const backgroundStyle = {
        ...style,
        "background-color": bgColor,
        opacity: config.pieceStandImageOpacity.toString(),
      };
      const pieces: HandPieceLayout[] = [];
      const pointers: HandPointerLayout[] = [];
      handPieceTypes.forEach((type) => {
        const count = hand.count(type);
        const rule = handLaytoutRule[displayColor][type];
        const areaWidth = (layoutTemplate.hand.width / 2) * rule.width * ratio;
        const areaHeight = (layoutTemplate.hand.height / 4) * ratio;
        const areaX = areaWidth * rule.column;
        const areaY = areaHeight * rule.row;
        const pieceWidth = layoutTemplate.piece.width * ratio;
        const pieceHeight = layoutTemplate.piece.height * ratio;
        const padding = Math.max(areaWidth - pieceWidth * count, 0) / (count * 2);
        const dx = (areaWidth - pieceWidth - padding * 2) / Math.max(count - 1, 1);
        for (let i = count - 1; i >= 0; i -= 1) {
          const id = type + i;
          const imagePath = this.pieceImages[displayColor][type];
          const x = areaX + padding + dx * i;
          const y = areaY;
          pieces.push({
            id,
            imagePath,
            style: {
              left: x + "px",
              top: y + "px",
              width: pieceWidth + "px",
              height: pieceHeight + "px",
            },
          });
        }
        const id = type;
        const style = {
          left: areaX + "px",
          top: areaY + "px",
          width: areaWidth + "px",
          height: areaHeight + "px",
        };
        let backgroundStyle = style;
        if (
          pointer &&
          pointer instanceof Piece &&
          pointer.color === color &&
          pointer.type === type
        ) {
          backgroundStyle = {
            ...backgroundStyle,
            ...layoutTemplate.hand.highlight.selected,
          };
        }
        pointers.push({
          id,
          type,
          style,
          backgroundStyle,
        });
      });
      return {
        textureImagePath: this.pieceStandImage,
        style,
        backgroundStyle,
        pieces,
        pointers,
      };
    };

    const buildPromotionLayout = (
      boardLayout: BoardLayout,
      move: Move | null | undefined,
    ): PromotionLayout | null => {
      if (!move) {
        return null;
      }
      const color = config.flip ? reverseColor(move.color) : move.color;
      const square = config.flip ? move.to.opposite : move.to;
      const piece = new Piece(color, move.pieceType);
      const promoted = piece.promoted();
      const notPromoted = piece.unpromoted();
      const promoteImagePath = this.pieceImages[color][promoted.type];
      const notPromoteImagePath = this.pieceImages[color][notPromoted.type];
      const x =
        boardLayout.x +
        (layoutTemplate.board.leftSquarePadding +
          layoutTemplate.board.squreWidth *
            (square.x === 0 ? 0 : square.x === 8 ? 7 : square.x - 0.5)) *
          ratio;
      const y =
        boardLayout.y +
        (layoutTemplate.board.topSquarePadding + layoutTemplate.board.squreHeight * square.y) *
          ratio;
      const width = layoutTemplate.board.squreWidth * 2 * ratio;
      const height = layoutTemplate.board.squreHeight * ratio;
      const style = {
        left: x + "px",
        top: y + "px",
        width: width + "px",
        height: height + "px",
        "font-size": height / 4 + "px",
      };
      return {
        promoteImagePath,
        notPromoteImagePath,
        style,
      };
    };

    const buildTurnLayout = (): TurnLayout => {
      const color = position.color;
      const displayColor = config.flip ? reverseColor(color) : color;
      const borderWidth = 2;
      const template = layoutTemplate.turn[displayColor];
      const x = template.x;
      const y = config.hideClock ? template.y2 : template.y;
      return {
        style: {
          left: x * ratio - borderWidth + "px",
          top: y * ratio - borderWidth + "px",
          width: layoutTemplate.turn.width * ratio - borderWidth + "px",
          height: layoutTemplate.turn.height * ratio - borderWidth + "px",
          "font-size": layoutTemplate.turn.fontSize * ratio + "px",
          "border-radius": layoutTemplate.turn.height * ratio * 0.4 + "px",
          "border-width": borderWidth + "px",
          "border-style": "solid",
        },
      };
    };

    const buildPlayerNameLayout = (color: Color): PlayerNameLayout => {
      const displayColor = config.flip ? reverseColor(color) : color;
      const template = layoutTemplate.playerName[displayColor];
      const x = template.x;
      const y = config.hideClock ? template.y2 : template.y;
      return {
        style: {
          left: x * ratio + "px",
          top: y * ratio + "px",
          width: layoutTemplate.playerName.width * ratio + "px",
          height: layoutTemplate.playerName.height * ratio + "px",
          "font-size": layoutTemplate.playerName.fontSize * ratio + "px",
        },
      };
    };

    const buildClockLayout = (color: Color): ClockLayout => {
      const displayColor = config.flip ? reverseColor(color) : color;
      return {
        style: {
          left: layoutTemplate.clock[displayColor].x * ratio + "px",
          top: layoutTemplate.clock[displayColor].y * ratio + "px",
          width: layoutTemplate.clock.width * ratio + "px",
          height: layoutTemplate.clock.height * ratio + "px",
          "font-size": layoutTemplate.clock.fontSize * ratio + "px",
        },
      };
    };

    const buildControlLayout = (): ControlLayout => {
      return {
        left: {
          style: {
            left: layoutTemplate.control.left.x * ratio + "px",
            top: layoutTemplate.control.left.y * ratio + "px",
            width: layoutTemplate.control.left.width * ratio + "px",
            height: layoutTemplate.control.left.height * ratio + "px",
            "font-size": layoutTemplate.control.left.fontSize * ratio + "px",
          },
        },
        right: {
          style: {
            left: layoutTemplate.control.right.x * ratio + "px",
            top: layoutTemplate.control.right.y * ratio + "px",
            width: layoutTemplate.control.right.width * ratio + "px",
            height: layoutTemplate.control.right.height * ratio + "px",
            "font-size": layoutTemplate.control.right.fontSize * ratio + "px",
          },
        },
      };
    };

    const frameLayout = buildFrameLayout();
    const boardLayout = buildBoardLayout();
    const labelLayout = buildLabelLayout(boardLayout);
    const pieceLayout = buildPieceLayout(boardLayout);
    const squareLayout = buildSquareLayout(boardLayout);
    const blackHandLayout = buildHandLayout(Color.BLACK, position.hand(Color.BLACK));
    const whiteHandLayout = buildHandLayout(Color.WHITE, position.hand(Color.WHITE));
    const promotionLayout = buildPromotionLayout(boardLayout, reservedMoveForPromotion);
    const turnLayout = buildTurnLayout();
    const blackPlayerNameLayout = buildPlayerNameLayout(Color.BLACK);
    const whitePlayerNameLayout = buildPlayerNameLayout(Color.WHITE);
    const blackClockLayout = config.hideClock ? undefined : buildClockLayout(Color.BLACK);
    const whiteClockLayout = config.hideClock ? undefined : buildClockLayout(Color.WHITE);
    const controlLayout = buildControlLayout();
    return {
      frame: frameLayout,
      board: boardLayout,
      labels: labelLayout,
      piece: pieceLayout,
      square: squareLayout,
      blackHand: blackHandLayout,
      whiteHand: whiteHandLayout,
      promotion: promotionLayout,
      turn: turnLayout,
      blackPlayerName: blackPlayerNameLayout,
      whitePlayerName: whitePlayerNameLayout,
      blackClock: blackClockLayout,
      whiteClock: whiteClockLayout,
      control: controlLayout,
    };
  }
}
