export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) return res.status(200).send("API 키가 설정되지 않았습니다.");

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');
    
    // 엔드포인트를 getBrTitleInfo (표제부 조회)로 변경
    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&_type=json&numOfRows=100`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const data = await response.json();
    
    // 동 이름(dongNm)이 있다면 해당 동 데이터만 필터링해서 반환
    if (dongNm && data.response?.body?.items?.item) {
      const allItems = data.response.body.items.item;
      const items = Array.isArray(allItems) ? allItems : [allItems];
      const filtered = items.filter(item => String(item.dongNm).includes(dongNm));
      data.response.body.items.item = filtered;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({ error: "서버 에러", message: err.message });
  }
}
