export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');

    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text();

    // 🔥 XML → JSON 변환 (간단 파싱)
    const items = [];
    const matches = text.match(/<item>([\s\S]*?)<\/item>/g);

    if (matches) {
      matches.forEach(block => {
        const get = (tag) => {
          const m = block.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
          return m ? m[1] : "";
        };

        const dong = get("dongNm");

        if (!dong.includes(dongNm)) return;

        items.push({
          dongNm: dong,
          hoNm: get("hoNm"),
          jmNm: get("jmNm"),
          area: get("area")
        });
      });
    }

    return res.status(200).json({
      response: {
        body: {
          items: {
            item: items
          }
        }
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
