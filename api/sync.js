// api/sync.js
export default async function handler(req, res) {
  const { sigungu, bjdong, bun, ji, dongNm } = req.query;
  
  // 환경변수에서 키를 가져옵니다.
  // 포털 키에 특수문자가 포함된 경우 decodeURIComponent로 한 번 감싸주는 것이 가장 확실합니다.
  const serviceKey = decodeURIComponent(process.env.DATA_GO_KR_KEY);

  // 공공데이터포털 건축물대장 표제부 조회 API URL
  const baseUrl = 'http://apis.data.go.kr/1613000/BldRgstService_v2/getRestBldRgstFlrPlan'; // 층별평면도 또는 표제부 API 주소 확인 필요
  
  // 표제부 조회의 경우 실제 주소는 아래와 같습니다.
  const targetUrl = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo`;

  const params = new URLSearchParams({
    serviceKey: serviceKey, // 서버에서 처리하므로 자동으로 적절히 인코딩됩니다.
    sigunguCd: sigungu,
    bjdongCd: bjdong,
    platGbCd: '0',
    bun: bun.padStart(4, '0'),
    ji: ji.padStart(4, '0'),
    dongNm: dongNm,
    _type: 'json',
    numOfRows: '100'
  });

  try {
    const apiResponse = await fetch(`${targetUrl}?${params.toString()}`);
    const data = await apiResponse.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'API 요청 중 오류가 발생했습니다.', details: error.message });
  }
}
