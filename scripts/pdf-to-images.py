"""소개 PDF의 각 쪽을 이미지로 바꿔 src/assets/intro/에 저장한다.

안드로이드 Chrome처럼 PDF 뷰어가 없는 브라우저에서 홈의 미리보기를 이미지로 대신 보여주기 위한 것이다.
PDF(public/AUX_Lab_Introduction.pdf)를 바꿨다면 이 스크립트를 다시 돌려 이미지를 새로 만든다.

사용법 (저장소 루트에서):
  pip install pymupdf
  python scripts/pdf-to-images.py
"""
import pathlib

import pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF = ROOT / "public" / "AUX_Lab_Introduction.pdf"
OUT = ROOT / "src" / "assets" / "intro"
WIDTH = 1600  # 화면에서 쓰는 크기의 2배 안팎. 빌드 때 Astro가 webp로 줄인다.

OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("page-*.png"):
    old.unlink()

doc = pymupdf.open(PDF)
for i, page in enumerate(doc, start=1):
    zoom = WIDTH / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(OUT / f"page-{i:02d}.png")

print(f"{len(doc)}쪽을 {OUT}에 저장했다.")
