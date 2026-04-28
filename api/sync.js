import { XMLParser } from "fast-xml-parser";

export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) {
      return res.status(500).json({ error: "API 키 없음" });
    }

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');

    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${decodeURIComponent(serviceKey)}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text();

    let data;

    // 🔥 XML이면 변환
    if (text.startsWith("<")) {
      const parser = new XMLParser({
        ignoreAttributes: false
      });
      data = parser.parse(text);
    } else {
      data = JSON.parse(text);
    }

    // 🔥 구조 맞춰주기 (중요)
    let items = data?.response?.body?.items?.item || [];

    const list = Array.isArray(items) ? items : [items];

    // 🔥 동 필터
    const filtered = list.filter(item =>
      String(item.dongNm || '').includes(dongNm)
    );

    return res.status(200).json({
      response: {
        body: {
          items: {
            item: filtered
          }
        }
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
}
