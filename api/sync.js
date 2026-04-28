export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) return res.status(200).json({ error: "Vercel 환경변수 키 누락" });

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');
    
    // 공공데이터포털 API 주소
    const url = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text(); // JSON으로 바로 변환하지 않고 텍스트로 먼저 받음

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (e) {
      // JSON 파싱에 실패하면 포털에서 보낸 에러 메시지를 그대로 출력
      res.status(200).send(`API 응답 원문: ${text}`);
    }
  } catch (err) {
    res.status(200).json({ error: "서버 내부 로직 에러", message: err.message });
  }
}
