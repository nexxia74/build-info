export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) {
      return res.status(500).json({ error: "API 키 없음" });
    }

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');

    // 🔥 HTTPS로 변경 + decodeURIComponent
    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${decodeURIComponent(serviceKey)}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&_type=json&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text();

    console.log("RAW RESPONSE:", text.substring(0, 300));

    // 🔥 XML 대응
    if (text.startsWith("<")) {
      return res.status(200).json({
        error: "XML 응답 (JSON 아님)",
        preview: text.substring(0, 200)
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        error: "JSON 파싱 실패",
        preview: text.substring(0, 200)
      });
    }

    // 🔥 동 필터링
    if (dongNm && data.response?.body?.items?.item) {
      const items = data.response.body.items.item;
      const list = Array.isArray(items) ? items : [items];

      data.response.body.items.item = list.filter(item =>
        String(item.dongNm || '').includes(dongNm)
      );
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: "서버 에러",
      message: err.message
    });
  }
}
