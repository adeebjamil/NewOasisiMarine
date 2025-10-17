# Banner Image Replacement Guide

## Updated Banner Configuration
The banner component now uses the following image paths:
1. `/banner/contact-banner.jpg` - Contact Us section
2. `/banner/about-banner.jpg` - About Us section
3. `/banner/products-banner.jpg` - Products section
4. `/banner/branches-banner.jpg` - Branches section

## Free High-Quality Image Sources

### 1. Unsplash (https://unsplash.com)
**Best for:** Professional, high-resolution images
**License:** Free to use, no attribution required

### 2. Pexels (https://pexels.com)
**Best for:** Diverse stock photos and videos
**License:** Free to use commercially

### 3. Pixabay (https://pixabay.com)
**Best for:** Large variety of free images
**License:** Free for commercial use

## Recommended Images for Each Banner

### Banner 1: Contact Us (`contact-banner.jpg`)
**Search Terms:**
- "port container ship"
- "shipping logistics"
- "cargo port sunset"
- "container terminal"

**Recommended Images:**
- Unsplash: Search "shipping port" by frank mckenna
- Pexels: Search "cargo ship" by Pixabay
- Professional maritime port with containers

**Ideal Composition:** Wide shot of shipping port or cargo terminal, preferably with blue sky

---

### Banner 2: About Us (`about-banner.jpg`)
**Search Terms:**
- "industrial factory"
- "oil refinery"
- "industrial plant"
- "petrochemical facility"

**Recommended Images:**
- Unsplash: Search "oil refinery" by Ralf Vetterle
- Pexels: Search "industrial plant" by Pixabay
- Factory or refinery with pipelines and equipment

**Ideal Composition:** Industrial facility with pipelines, preferably with sunset/sunrise lighting

---

### Banner 3: Products (`products-banner.jpg`)
**Search Terms:**
- "steel pipes industrial"
- "metal pipes factory"
- "industrial valves"
- "steel manufacturing"

**Recommended Images:**
- Unsplash: Search "steel pipes" by Yeo Khee
- Pexels: Search "metal pipes" by Pixabay
- Close-up of industrial pipes, valves, or fittings

**Ideal Composition:** Industrial equipment close-up with metallic textures

---

### Banner 4: Branches (`branches-banner.jpg`)
**Search Terms:**
- "warehouse logistics"
- "distribution center"
- "cargo warehouse"
- "industrial storage"

**Recommended Images:**
- Unsplash: Search "warehouse" by Remy Gieling
- Pexels: Search "warehouse interior" by Tiger Lily
- Modern warehouse with organized inventory

**Ideal Composition:** Warehouse interior or distribution center with organized storage

---

## How to Download and Replace Images

### Step 1: Download Images
1. Visit the recommended websites (Unsplash, Pexels, or Pixabay)
2. Search using the suggested terms above
3. Download images in **high resolution** (minimum 1920x1080px)
4. Choose landscape orientation (horizontal)

### Step 2: Optimize Images
**Recommended Specifications:**
- **Format:** JPG (for photos)
- **Dimensions:** 1920x1080px or higher
- **File Size:** Optimize to under 500KB each
- **Quality:** 80-85% (good balance between quality and size)

**Free Tools for Optimization:**
- TinyJPG (https://tinyjpg.com) - Compress images
- Squoosh (https://squoosh.app) - Google's image optimizer
- ImageOptim (Mac) or FileOptimizer (Windows)

### Step 3: Rename and Place Images
1. Rename downloaded images exactly as:
   - `contact-banner.jpg`
   - `about-banner.jpg`
   - `products-banner.jpg`
   - `branches-banner.jpg`

2. Place them in the `/public/banner/` directory

### Step 4: Verify
1. Replace the old banner images
2. Refresh your website
3. Check all 4 banners rotate correctly
4. Ensure text is readable on each image

---

## Quick Download Links (Copy these search URLs)

### Unsplash:
1. **Contact:** https://unsplash.com/s/photos/shipping-port
2. **About:** https://unsplash.com/s/photos/oil-refinery
3. **Products:** https://unsplash.com/s/photos/steel-pipes-industrial
4. **Branches:** https://unsplash.com/s/photos/warehouse-logistics

### Pexels:
1. **Contact:** https://www.pexels.com/search/cargo%20port/
2. **About:** https://www.pexels.com/search/industrial%20plant/
3. **Products:** https://www.pexels.com/search/metal%20pipes/
4. **Branches:** https://www.pexels.com/search/warehouse%20storage/

### Pixabay:
1. **Contact:** https://pixabay.com/images/search/shipping%20container/
2. **About:** https://pixabay.com/images/search/oil%20refinery/
3. **Products:** https://pixabay.com/images/search/industrial%20pipes/
4. **Branches:** https://pixabay.com/images/search/warehouse/

---

## Specific Image Recommendations

### Option A: Professional Industrial Look
1. **Contact:** Port with shipping containers at golden hour
2. **About:** Oil refinery with blue sky and pipes
3. **Products:** Close-up of chrome/steel pipes and valves
4. **Branches:** Modern warehouse with organized shelving

### Option B: Technical/Engineering Focus
1. **Contact:** Cargo ship being loaded/unloaded
2. **About:** Industrial facility with workers (safety gear)
3. **Products:** Industrial equipment close-up (valves, gauges)
4. **Branches:** Distribution center with forklift

### Option C: Modern/Clean Look
1. **Contact:** Minimalist port shot with clean lines
2. **About:** Modern industrial facility at sunrise
3. **Products:** Organized pipe sections or valve lineup
4. **Branches:** Clean, well-lit warehouse interior

---

## Image Composition Tips

### Ensure Text Readability:
- Choose images with **darker areas** on the left side (where text appears)
- Avoid busy/cluttered backgrounds on the left third
- Sky or water in background works well with text overlay
- The component already has a `bg-black/40` overlay to help readability

### Best Practices:
✅ High contrast between subject and background
✅ Professional, high-resolution images
✅ Consistent color tone across all banners
✅ Landscape orientation (horizontal)
✅ No text or watermarks on the image itself
✅ Focus on industrial/marine themes

❌ Avoid images with people's faces (licensing issues)
❌ Avoid images with competitor branding
❌ Avoid vertically oriented images
❌ Avoid low-resolution or grainy images

---

## Alternative: AI-Generated Images

If you prefer AI-generated images, you can use:
1. **Midjourney** - High-quality AI images (paid)
2. **DALL-E 3** - Via ChatGPT Plus (paid)
3. **Leonardo.ai** - Free tier available

**Suggested AI Prompts:**
- "Professional photo of shipping container port at sunset, wide angle, cinematic"
- "Industrial oil refinery with pipes and equipment, professional photography, blue hour"
- "Close-up of industrial steel pipes and valves, professional product photography"
- "Modern warehouse interior with organized inventory, professional photography"

---

## Need Help?

If you need assistance downloading or optimizing images, let me know and I can:
1. Provide more specific image recommendations
2. Help with alternative search terms
3. Suggest different composition styles
4. Recommend specific images from these platforms

---

## Current vs New Image Names

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `/banner/About Us.jpg` | `/banner/contact-banner.jpg` | Contact section |
| `/banner/banner (1).png` | `/banner/about-banner.jpg` | About section |
| `/banner/banner (3).png` | `/banner/products-banner.jpg` | Products section |
| `/banner/banner (2).png` | `/banner/branches-banner.jpg` | Branches section |
