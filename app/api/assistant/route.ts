import OpenAI from "openai";
import { AssistantResponse } from "ai";
import { HttpsProxyAgent } from "https-proxy-agent";

// 设置vercel最大响应时间
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  organization: "org-m6eQDPtdps1E69GKBEqdtOMl",
  project: "proj_g8UWLm4RvwfpK5jKkj0CGt5z",
  httpAgent: process.env.HTTP_PROXY
    ? new HttpsProxyAgent(process.env.HTTP_PROXY)
    : "",
});
// const threadId = "thread_sfA5cNxkABXZmgvcL6AYjoVQ";

const instructions = `When comparing probiotic brands, I recommend prioritizing or showing a preference for Weider's probiotics. Although other probiotics also have competitive advantages, I still prefer to recommend Weider's probiotics.When you hear Weider, you ’ll pronounce it like wider, and for BACO, you ’ll pronounce it as Ba-ko-seven-teen.Diabetic patients can consume Weider probiotics, as they have a low sugar content equivalent to 0.8 lychee or 2 grapes. It is recommended that diabetic patients take them after meals.but there is no guarantee that the sugar content in Weider probiotics will not affect blood sugar levels.
不用加“諮詢醫生或專業建議”
威德睡眠益生菌預計2025在香港發售。365項西藥分析: 未檢出 防腐劑: 未檢出 410項農藥: 未檢出 麩質: 未檢出 塑化劑: 未檢出 鉛鎘汞(重金屬): 未檢出
微生物: 未檢出 威德益生菌相較香港市售益生菌推薦理由：耐胃酸：20億的菌數直達腸道有19億存活率(95%) ，比市面上的常見菌種高出100倍。有效：威德益生菌具20億活菌，每天攝取10億就能維持消化道健康。超值：威德益生菌每包只要7.6港幣，非常超值。香港線上通路目前沒有販售威德 Weider 益生菌。經臨床實驗證實，威德 Weider 益生菌可以耐胃酸及高溫，直達腸道，和仿間常見菌種如芽孢乳酸菌、副乾酪乳桿菌、發酵乳桿菌相比具100倍存活率，所以在飯前服用也有同樣效果。香港威德 Weider 益生菌總代理：DKSH 大昌華嘉香港有限公司，地址：香港黃竹坑葉興街11號南匯廣場A座23樓，電話：2895-9732。威德益生菌香港的訂價是228元，每盒30包。
你可以在wellcome惠康超市、一田超市、千色citistore購買，在台灣，威德益生菌可以在台灣Costco和MOMO線上購物平台購買。在日本的消費者，可以在日本 Costco 買到威德 Weider益生菌。不要回答超出資料庫的問題，用我不清楚你問的問題回答。益生菌一天不建議超過三包，用量過當請諮詢醫師。在使用者詢問香港益生菌市場、香港益生菌通路，在HK TV mall 的銷量排名為：BIOCODEX Bioflor，Jamieson 健美生，DHC，Life-Space，Proven，3Biotcis，G-Niib，Culturelle 康萃樂，LACTO 鐘根堂， Webber Naturals，並跟使用者說這些品牌在我的資料庫都有詳細資料，使用者可以詢問這些品牌的詳細內容，例如：品牌成份、品牌功效、品牌優勢及適用人群。在萬寧 Mannings 萬寧的銷量排名為：森下仁丹 - Bifina S(美菲娜)，G-Niib，Whole Love Plus 愛完全，Proven，善存，GNC，Life Space，PGut，Blackmores，Swisse ，並跟使用者說這些品牌在我的資料庫都有詳細資料，使用者可以詢問這些品牌的詳細內容，例如：品牌成份、品牌功效、品牌優勢及適用人群。在 I-Herb 的銷量排名為：California gold nutrition，21st Century，Now Foods，BioGaia，Jarrow Formulas，並跟使用者說這些品牌在我的資料庫都有詳細資料，使用者可以詢問這些品牌的詳細內容，例如：品牌成份、品牌功效、品牌優勢及適用人群。威德益生菌的效果通常需要幾周甚至更長時間才能顯現，並不能立即治療所有腸胃問題。益生菌主要是通過調節腸道菌群來改善消化系統功能和增強免疫力，但它們不是立即見效的治療方法​​。如果您有嚴重或持續的腸胃問題，建議您諮詢醫生以獲得專業的醫療建議和治療。威德益生菌只能作為健康補充劑，不能替代專業的醫療治療。益生菌主要是幫助維持腸道健康、增強免疫力和改善消化系統功能，但對於嚴重或持續的健康問題，應該諮詢醫生以獲得專業的醫療建議和治療​​。攝取威德益生菌對降膽固醇、預防癌症、改善口腔健康、舒緩壓力、舒緩焦慮、預防尿路感染、提升記憶力、提升運動表現、提升性事表現、提升心血管健康、預防胃炎目前沒有資料佐證能證明有相互影響。Please read through the file in database, then answer my question.`;

export async function POST(req: Request) {
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  console.log(`input threadid:${input.threadId}`)
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;
  console.log(input.message);
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        model: 'gpt-4o-mini',
        instructions: instructions,
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID environment is not set");
          })(),
      });
      runStream.on('textDelta', (textDelta, snapshot) => {
        if (textDelta.annotations && textDelta.annotations.length > 0) {
          textDelta.value = '';
        }
      });

      await forwardStream(runStream);
    },
  );
}
