# Product Slug Fix Guide

## Problem
Products in the database have `null` slugs, causing E11000 duplicate key errors when creating new products because MongoDB has a unique index on the `slug` field.

## Solution Applied

### 1. Automatic Slug Generation
- **POST** `/api/admin/products` - Now automatically generates slugs from product names
- **PUT** `/api/admin/products` - Regenerates slugs when product names are updated
- Uses the `generateSlug()` utility to create URL-friendly slugs
- Checks for duplicates and adds timestamps if needed

### 2. Fix Existing Products
Run the migration endpoint to fix all existing products with null slugs:

#### Using Browser Console:
```javascript
fetch('/api/admin/fix-slugs', {
  method: 'POST',
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log(data))
```

#### Using cURL (PowerShell):
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/fix-slugs" -Method POST -UseBasicParsing
$response.Content | ConvertFrom-Json
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Slug migration completed",
  "stats": {
    "totalProducts": 241,
    "productsWithoutSlug": 150,
    "updated": 150,
    "errors": 0
  },
  "updatedProducts": ["Product 1", "Product 2", ...],
  "errors": []
}
```

## How It Works

### Slug Generation Process:
1. Takes product name (e.g., "FIRE BLANKET")
2. Converts to lowercase: "fire blanket"
3. Replaces spaces with hyphens: "fire-blanket"
4. Removes special characters
5. Checks for duplicates in database
6. If duplicate exists, appends timestamp: "fire-blanket-1729123456789"

### Example Slugs:
- "Marine Rubber Mat" → "marine-rubber-mat"
- "LED Navigation Light" → "led-navigation-light"
- "Safety Equipment #1" → "safety-equipment-1"

## Testing

1. **Login to Admin Panel**: http://localhost:3000/admin
2. **Open Browser Console** (F12)
3. **Run Migration**:
   ```javascript
   fetch('/api/admin/fix-slugs', {
     method: 'POST',
     credentials: 'include'
   })
   .then(r => r.json())
   .then(data => console.log(data))
   ```
4. **Try Creating a New Product** - Should work without errors now!

## Verification

Check if products have slugs:
```javascript
fetch('/api/admin/products')
  .then(r => r.json())
  .then(data => {
    const withoutSlug = data.products.filter(p => !p.slug);
    console.log(`Products without slug: ${withoutSlug.length}`);
    console.log('Sample products:', data.products.slice(0, 3));
  })
```

## Notes

- Migration is **safe to run multiple times** (it only updates products without slugs)
- Requires **admin authentication** to run
- All new products will automatically get slugs
- Slugs are used for SEO-friendly URLs: `/products/marine-rubber-mat`
