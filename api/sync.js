export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji } = req.query;

    const serviceKey = "52a615f1e89d6eeab474b079ae16c421374bbc9abeff7045b3672124edde4253";

    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');

    const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text();

    const items = [];
    const matches = text.match(/<item>([\s\S]*?)<\/item>/g);

    if (matches) {
      matches.forEach(block => {
        const get = (tag) => {
          const m = block.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
          return m ? m[1] : "";
        };

        items.push({
          dongNm: get("dongNm"),
          hoNm: get("hoNm"),
          jmNm: get("jmNm"),
        });
      });
    }

    res.status(200).json({ items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
