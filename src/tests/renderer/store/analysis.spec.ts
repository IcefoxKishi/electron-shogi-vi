import { AnalysisManager } from "@/renderer/store/analysis";
import { RecordManager } from "@/renderer/store/record";
import { analysisSettings as baseAnalysisSettings } from "@/tests/mock/analysis";
import { USIPlayer } from "@/renderer/players/usi";
import { MockedClass } from "vitest";

vi.mock("@/renderer/players/usi");

const mockUSIPlayer = USIPlayer as MockedClass<typeof USIPlayer>;

describe("store/analysis", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("open-end", async () => {
    mockUSIPlayer.prototype.launch.mockResolvedValue();
    mockUSIPlayer.prototype.startResearch.mockResolvedValue();
    mockUSIPlayer.prototype.stop.mockResolvedValue();
    mockUSIPlayer.prototype.close.mockResolvedValue();
    const recordManager = new RecordManager();
    recordManager.importRecord(
      "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 3c3d 2g2f 8c8d",
    );
    const analysisSettings = JSON.parse(JSON.stringify(baseAnalysisSettings));
    analysisSettings.startCriteria.enableNumber = false;
    analysisSettings.endCriteria.enableNumber = false;
    const onFinish = vi.fn();
    const onError = vi.fn();
    const manager = new AnalysisManager(recordManager).on("finish", onFinish).on("error", onError);
    await manager.start(analysisSettings);
    expect(mockUSIPlayer).toBeCalledTimes(1);
    expect(mockUSIPlayer.prototype.launch).toBeCalled();
    expect(mockUSIPlayer.prototype.startResearch).not.toBeCalled();
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(1);
    manager.updateSearchInfo({
      usi: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1",
      score: 10,
    });
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(2);
    manager.updateSearchInfo({
      usi: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f",
      score: 20,
    });
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(3);
    manager.updateSearchInfo({
      usi: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 3c3d",
      score: 30,
    });
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(4);
    manager.updateSearchInfo({
      usi: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 3c3d 2g2f",
      score: 40,
    });
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(5);
    expect(mockUSIPlayer.prototype.close).not.toBeCalled();
    expect(onFinish).not.toBeCalled();
    manager.updateSearchInfo({
      usi: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 3c3d 2g2f 8c8d",
      score: 50,
    });
    vi.runOnlyPendingTimers();
    expect(mockUSIPlayer.prototype.startResearch).toBeCalledTimes(5);
    expect(mockUSIPlayer.prototype.stop).not.toBeCalled();
    expect(mockUSIPlayer.prototype.close).toBeCalledTimes(1);
    expect(onFinish).toBeCalledTimes(1);
    expect(onError).not.toBeCalled();
    recordManager.changePly(0);
    expect(recordManager.record.current.comment).toBe("");
    recordManager.changePly(1);
    expect(recordManager.record.current.comment).toBe(
      "互角\n#評価値=20\n#エンジン=my usi engine\n",
    );
    recordManager.changePly(2);
    expect(recordManager.record.current.comment).toBe(
      "互角\n#評価値=30\n#エンジン=my usi engine\n",
    );
    recordManager.changePly(3);
    expect(recordManager.record.current.comment).toBe(
      "互角\n#評価値=40\n#エンジン=my usi engine\n",
    );
    recordManager.changePly(4);
    expect(recordManager.record.current.comment).toBe(
      "互角\n#評価値=50\n#エンジン=my usi engine\n",
    );
  });
});
