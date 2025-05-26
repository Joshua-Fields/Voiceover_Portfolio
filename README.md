# Amelia Jane Voiceover & Singing Website

This is a Flask-based portfolio site for Amelia Jane, showcasing her voiceover and singing work. It features smooth scroll animations, a playful per-letter entrance for the hero title, a responsive hamburger navigation that animates into view, and scroll-triggered section reveals.

## Features

* **Hero Entrance**: "Amelia Jane" animates in per-letter with an elastic bounce.
* **ScrollSmoother**: Smooth, buttery scrolling throughout the site.
* **Shrink-to-Nav**: The hero title shrinks and slides into the fixed header as you scroll.
* **Hamburger Menu**: A responsive menu button fades in on scroll and toggles the nav.
* **Section Reveals**: Each content section fades and slides into view on scroll.
* **Jello Effect**: "About Me" heading drops in with a springy jello effect.

## Prerequisites

* Python 3.7+
* `pip` package manager

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/amelia-jane-site.git
   cd amelia-jane-site
   ```

2. **Create & activate a virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # macOS/Linux
   venv\\Scripts\\activate  # Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variable** (*optional, for Flask CLI*)

   ```bash
   export FLASK_APP=app.py    # macOS/Linux
   set FLASK_APP=app.py       # Windows
   ```

5. **Run the development server**

   ```bash
   flask run
   ```

   By default, the site will be available at [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## Project Structure

```
voiceover_site_flask/
├── app.py              # Flask application entrypoint
├── requirements.txt    # Python dependencies
├── README.md           # This file
├── static/             # CSS, JS, and other assets
│   ├── css/style.css
│   └── js/script.js
└── templates/
    └── index.html      # Main site template
```

* **app.py**: Defines the Flask app and routes.
* **templates/index.html**: HTML layout, includes header, nav, hero, sections, and footer.
* **static/css/style.css**: All styling, including layout, colors (pale yellow & orange), and responsive rules.
* **static/js/script.js**: GSAP animations for hero title, scroll smoother, shrink-to-nav, hamburger toggle, and section reveals.

## Customization

* **Text Content**: Edit `templates/index.html` to update headings, paragraphs, and navigation links.
* **Styles**: Modify `static/css/style.css` to change colors, fonts (Poppins), spacing, or responsive breakpoints.
* **Animations**: Tweak timings and easings in `static/js/script.js` under the GSAP calls.

## Deployment

For production, consider using a WSGI server (e.g., Gunicorn) and serving static files via a CDN or web server:

```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:8000 app:app
```

Then point your web server (Nginx/Apache) to serve `static/` and proxy `/` to the Gunicorn process.

---

Feel free to open issues or submit pull requests if you find any bugs or have feature suggestions!
