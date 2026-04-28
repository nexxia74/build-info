export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');
    
    // https로 변경하고 요청
    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    const text = await response.text();
    res.status(200).send(`응답 확인: ${text}`);
  } catch (err) {
    res.status(200).send(`에러 발생: ${err.message}`);
  }
}
