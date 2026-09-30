"""티스토리 RSS에서 '흑판공지' 카테고리의 최신 글을 읽어 notice.json으로 저장한다."""
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

RSS_URL = "https://skgs.tistory.com/rss"
CATEGORY = "흑판공지"
OUT = Path(__file__).resolve().parents[2] / "notice.json"

BLOCK_TAGS = {"br", "p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "tr", "blockquote"}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "figcaption"):
            self.skip += 1
        elif tag in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "figcaption"):
            self.skip = max(0, self.skip - 1)
        elif tag in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def html_to_text(src):
    p = TextExtractor()
    p.feed(src)
    text = html.unescape("".join(p.parts)).replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    text = "\n".join(lines)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def main():
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": "Mozilla/5.0 (gugangsa notice bot)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        root = ET.fromstring(r.read())

    notice = {"title": "", "text": "", "link": "", "pubDate": ""}
    for item in root.iter("item"):
        cats = [c.text or "" for c in item.findall("category")]
        if any(CATEGORY in c for c in cats):
            notice = {
                "title": (item.findtext("title") or "").strip(),
                "text": html_to_text(item.findtext("description") or ""),
                "link": (item.findtext("link") or "").strip(),
                "pubDate": (item.findtext("pubDate") or "").strip(),
            }
            break

    OUT.write_text(json.dumps(notice, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(notice, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
