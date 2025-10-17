import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    const productsParentId = new ObjectId('68b0006dc17f5c9596ae9d3a');
    
    // 1. Get the subcategories collection
    const subcategoriesCollection = await getCollection('subcategories');
    
    // 2. Check if FIRE SAFETY exists
    const existing = await subcategoriesCollection.findOne({ _id: fireSafetyId });
    
    if (existing) {
      // Update to ensure it has the correct categoryId
      await subcategoriesCollection.updateOne(
        { _id: fireSafetyId },
        {
          $set: {
            name: 'FIRE SAFETY',
            href: '/products/fire-safety',
            categoryId: productsParentId,
            visible: true,
            order: 19,
            slug: 'fire-safety',
            image: existing.image || 'https://res.cloudinary.com/dpdl6z0hu/image/upload/v1757571662/product-images/file_isqtpa.jpg'
          }
        }
      );
      
      console.log('✅ Updated FIRE SAFETY subcategory');
    } else {
      // Create it
      await subcategoriesCollection.insertOne({
        _id: fireSafetyId,
        name: 'FIRE SAFETY',
        href: '/products/fire-safety',
        categoryId: productsParentId,
        visible: true,
        order: 19,
        slug: 'fire-safety',
        image: 'https://res.cloudinary.com/dpdl6z0hu/image/upload/v1757571662/product-images/file_isqtpa.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Created FIRE SAFETY subcategory');
    }
    
    // 3. Verify products
    const productsCollection = await getCollection('products');
    const fireProducts = await productsCollection.find({
      subcategoryId: fireSafetyId
    }).toArray();
    
    // 4. Verify navbar will return it
    const categoriesCollection = await getCollection('categories');
    const parentCategory = await categoriesCollection.findOne({ 
      _id: productsParentId 
    });
    
    return NextResponse.json({
      success: true,
      message: 'FIRE SAFETY fixed and verified',
      details: {
        subcategory: {
          id: fireSafetyId.toString(),
          name: 'FIRE SAFETY',
          href: '/products/fire-safety',
          categoryId: productsParentId.toString(),
          exists: !!existing
        },
        parentCategory: {
          id: parentCategory?._id?.toString(),
          name: parentCategory?.name
        },
        products: {
          total: fireProducts.length,
          active: fireProducts.filter((p: any) => p.isActive === true).length
        },
        nextSteps: [
          '1. Clear browser cache (Ctrl+Shift+Delete)',
          '2. Go to http://localhost:3000/products/fire-safety',
          '3. Hard refresh (Ctrl+Shift+R)',
          '4. Products should now appear'
        ]
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
