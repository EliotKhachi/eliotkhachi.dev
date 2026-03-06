#!/usr/bin/env python3
"""Build zettel HTML files and zettels.json from publicZk markdown source."""

import sys
import os
import re
import json
import markdown


def parse_readme(readme_path):
    """Parse a zettel README.md, returning (title, tags, markdown_body)."""
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.strip().split("\n")

    title = ""
    for line in lines:
        if line.startswith("# "):
            title = line[2:].strip()
            break

    tags = []
    in_tags = False
    for line in lines:
        if line.strip() == "## Tags":
            in_tags = True
            continue
        if in_tags and line.strip():
            tags.extend(re.findall(r"#(\S+)", line))

    return title, tags, content


def fix_inter_zettel_links(html_body):
    """Fix inter-zettel links from ../NNNNNNNNNNNN to ./NNNNNNNNNNNN.html"""
    return re.sub(
        r'href="\.\./(\d{12})"',
        r'href="./\1.html"',
        html_body,
    )


def main():
    if len(sys.argv) != 5:
        print(
            "Usage: build_zettels.py <publicZk_dir> <output_dir> <json_output_path> <template_path>"
        )
        sys.exit(1)

    source_dir = sys.argv[1]
    output_dir = sys.argv[2]
    json_path = sys.argv[3]
    template_path = sys.argv[4]

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    os.makedirs(output_dir, exist_ok=True)

    zettels = []
    all_tags = set()

    for entry in sorted(os.listdir(source_dir)):
        entry_path = os.path.join(source_dir, entry)
        readme_path = os.path.join(entry_path, "README.md")

        if not os.path.isdir(entry_path):
            continue
        if not re.match(r"^\d{12}$", entry):
            continue
        if not os.path.exists(readme_path):
            continue

        title, tags, md_content = parse_readme(readme_path)
        html_body = markdown.markdown(
            md_content, extensions=["fenced_code", "tables"]
        )
        html_body = fix_inter_zettel_links(html_body)

        full_html = template.replace("$title$", title).replace("$body$", html_body)

        output_path = os.path.join(output_dir, f"{entry}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_html)

        zettels.append({"title": title, "id": int(entry), "tags": tags})
        all_tags.update(tags)

    zettels.sort(key=lambda z: z["id"])

    json_data = {"zettels": zettels, "registry": sorted(all_tags)}

    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f)

    print(f"Built {len(zettels)} zettels with {len(all_tags)} tags")


if __name__ == "__main__":
    main()
