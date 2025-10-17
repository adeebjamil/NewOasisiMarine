import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Fix the missing FIRE SAFETY subcategory (ID: 68c26a51aae41600a374c673)
 * This subcategory exists in products but not in categories collection
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const categoriesCollection = await getCollection('categories');
    const productsCollection = await getCollection('products');
    
    // The missing FIRE SAFETY subcategory ID
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    
    // Check if it already exists
    const existing = await categoriesCollection.findOne({ _id: fireSafetyId });
    
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'FIRE SAFETY subcategory already exists',
        subcategory: {
          id: existing._id.toString(),
          name: existing.name
        }
      });
    }
    
    // Get the parent "Products" category
    const parentCategory = await categoriesCollection.findOne({ 
      name: 'Products',
      isCategory: true 
    });

    if (!parentCategory) {
      return NextResponse.json(
        { error: 'Parent category "Products" not found' },
        { status: 404 }
      );
    }
    
    // Count products that reference this subcategory
    const affectedProducts = await productsCollection.countDocuments({
      subcategoryId: fireSafetyId
    });
    
    console.log(`\n🔥 Creating missing FIRE SAFETY subcategory`);
    console.log(`   ID: ${fireSafetyId.toString()}`);
    console.log(`   Affected Products: ${affectedProducts}`);
    
    // Create the FIRE SAFETY subcategory
    const subcategoryDoc = {
      _id: fireSafetyId,
      name: 'FIRE SAFETY',
      href: '/products/fire-safety',
      isCategory: false, // This is a subcategory
      visible: true,
      order: 4, // Place it after the first 3 subcategories
      parentId: parentCategory._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await categoriesCollection.insertOne(subcategoryDoc);
    
    console.log(`✅ FIRE SAFETY subcategory created successfully`);
    console.log(`   ${affectedProducts} products are now properly linked\n`);

    return NextResponse.json({
      success: true,
      message: `FIRE SAFETY subcategory created successfully`,
      subcategory: {
        id: fireSafetyId.toString(),
        name: 'FIRE SAFETY',
        href: '/products/fire-safety',
        affectedProducts: affectedProducts
      },
      inserted: result.acknowledged
    });
  } catch (error) {
    console.error('Error creating FIRE SAFETY subcategory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create FIRE SAFETY subcategory',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
