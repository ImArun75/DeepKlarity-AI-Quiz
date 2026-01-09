import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str) -> dict:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title_tag = soup.find('h1', {'id': 'firstHeading'})
        title = title_tag.text.strip() if title_tag else "Unknown Title"
        
        content_div = soup.find('div', {'id': 'bodyContent'})
        if not content_div:
            raise ValueError("Could not find body content")

        for script in content_div(["script", "style", "sup", "table", "div.reflist"]):
            script.extract()
            
        paragraphs = content_div.find_all('p')
        full_text = "\n".join([p.text.strip() for p in paragraphs if p.text.strip()])
        
        summary = ""
        for p in paragraphs[:3]: 
             summary += p.text.strip() + " "
        
        headings = [h.text.strip().replace('[edit]', '') for h in content_div.find_all(['h2', 'h3'])]
        
        return {
            "title": title,
            "summary": summary.strip()[:1000] + "...",
            "full_text": full_text[:15000],
            "sections": headings
        }

    except Exception as e:
        print(f"Error scraping {url}: {e}")
        raise e
