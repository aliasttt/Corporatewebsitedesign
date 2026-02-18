# Revolift Asansör - Corporate Website

A modern, mobile-responsive corporate website for an elevator company in Turkey.

## 🌟 Features

- **Fully Static** - No backend, no frameworks, pure HTML/CSS/JavaScript
- **Mobile-First Responsive Design**
- **Turkish Language Content**
- **6 Complete Pages**:
  - Ana Sayfa (Homepage)
  - Hakkımızda (About Us)
  - Hizmetler (Services)
  - Referanslar (References)
  - İletişim (Contact)
  - Teklif Alın (Get Quote)

## 🎨 Design

- **Color Scheme**: Dark blue (#003366) + White + Orange (#ff6b35)
- **Modern & Clean**: Professional corporate layout
- **High-Quality Images**: Using Unsplash for realistic elevator and building photography
- **Interactive Elements**: Sticky header, mobile menu, floating WhatsApp button

## 📁 File Structure

```
/
├── index.html              # Homepage
├── hakkimizda.html        # About Us page
├── hizmetler.html         # Services page
├── referanslar.html       # References page
├── iletisim.html          # Contact page
├── teklif-alin.html       # Quote Request page
├── styles/
│   └── main.css           # Main stylesheet
└── scripts/
    └── main.js            # JavaScript functionality
```

## 🚀 GitHub Pages Deployment

### Method 1: Direct Upload

1. Create a new repository on GitHub
2. Upload all files maintaining the folder structure
3. Go to Settings > Pages
4. Select branch: `main` or `master`
5. Select folder: `/ (root)`
6. Click Save
7. Your site will be live at: `https://[username].github.io/[repository-name]/`

### Method 2: Git Command Line

```bash
git init
git add .
git commit -m "Initial commit - PrimeAsansor website"
git branch -M main
git remote add origin https://github.com/[username]/[repository-name].git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## 📱 Mobile Responsive

The website is fully responsive with breakpoints at:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔧 Customization

### Change Colors
Edit CSS variables in `/styles/main.css`:
```css
:root {
    --primary-blue: #003366;
    --accent-orange: #ff6b35;
    /* ... other colors */
}
```

### Update Contact Information
Search and replace in all HTML files:
- Phone: `+90 212 555 1234`
- Mobile: `+90 532 555 6789`
- Email: `info@primeasansor.com`
- Address: Update in footer sections

### Replace Images
Update image URLs in HTML files with your own images

## ✨ Key Features

- ✅ Sticky navigation with scroll effect
- ✅ Mobile hamburger menu
- ✅ Floating WhatsApp support button
- ✅ Contact forms with validation
- ✅ Filterable project references
- ✅ Smooth scroll animations
- ✅ Google Maps integration
- ✅ Social media links
- ✅ Service detail pages
- ✅ Quote request form

## 📞 Contact Forms

Forms are set up with client-side validation. In production:
- Integrate with backend API
- Or use form services like Formspree, Netlify Forms, etc.
- Current implementation shows success message without actual submission

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This is a template project. Feel free to modify and use for your needs.

## 🤝 Contributing

This is a static template website. Customize as needed for your project.

---

Built with ❤️ for GitHub Pages hosting
