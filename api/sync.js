export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) return res.status(200).json({ error: "키 누락" });

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');

    // 1차 시도: 사용자가 입력한 동 명칭 그대로 (예: "101")
    let url = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

    let response = await fetch(url);
    let data = await response.json();
    let items = data.response?.body?.items?.item;

    // 2차 시도: 만약 결과가 없다면 "동"을 붙여서 다시 시도 (예: "101동")
    if (!items || (Array.isArray(items) && items.length === 0)) {
      const retryUrl = url.replace(encodeURIComponent(dongNm), encodeURIComponent(dongNm + '동'));
      response = await fetch(retryUrl);
      data = await response.json();
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({ error: "서버 에러", message: err.message });
  }
}
