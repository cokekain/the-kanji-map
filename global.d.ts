type KanjiInfo = {
  id: string;
  kanjialiveData?: any;
  jishoData?: KanjiParseResult | null;
  hanviet?: string[];
  vietnameseMeaning?: string[];
  jlpt?: string;
  frequency?: string;
  grade?: string;
};

interface BothGraphData {
  withOutLinks: GraphData;
  noOutLinks: GraphData;
}
