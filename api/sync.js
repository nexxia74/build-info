const response = await fetch(url);
const text = await response.text();

// 🔥 디버깅 로그 추가 (중요)
console.log("API RAW:", text.substring(0, 300));

if (text.startsWith("<")) {
  return res.status(200).json({
    error: "XML 응답 옴",
    raw: text.substring(0, 500)
  });
}

const data = JSON.parse(text);
