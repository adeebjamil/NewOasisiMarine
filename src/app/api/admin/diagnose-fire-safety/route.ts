import { NextRequest, NextResponse } from 'next/server';
import { getCollection, ObjectId } from '@/lib/db';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Diagnose Fire Safety products issue
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    console.log('\n🔍 === FIRE SAFETY DIAGNOSTIC START ===\n');

    // Get Fire Safety subcategory ID
    const categoriesCollection = await getCollection('categories');
    const fireSafetySubcategory = await categoriesCollection.findOne({
      name: 'FIRE SAFETY',
      isCategory: false,
    });

    if (!fireSafetySubcategory) {
      return NextResponse.json({
        error: 'FIRE SAFETY subcategory not found',
      }, { status: 404 });
    }

    console.log('✅ Fire Safety Subcategory found:');
    console.log('   ID:', fireSafetySubcategory._id.toString());
    console.log('   Name:', fireSafetySubcategory.name);
    console.log('   Category ID:', fireSafetySubcategory.categoryId?.toString());

    // Get all products
    const productsCollection = await getCollection('products');
    const allProducts = await productsCollection.find({}).toArray();

    console.log(`\n📦 Total products in database: ${allProducts.length}`);

    // Find products with Fire Safety in their subcategory (by name from admin filter)
    const productsWithFireSafetyText = allProducts.filter(p => {
      // Check if product has "FIRE SAFETY" anywhere
      const matchesName = p.name?.toLowerCase().includes('fire');
      return matchesName || (p.subcategoryId && p.subcategoryId.toString() === fireSafetySubcategory._id.toString());
    });

    console.log(`\n🔍 Products potentially related to Fire Safety: ${productsWithFireSafetyText.length}`);

    // Check products by exact ObjectId match
    const productsWithCorrectId = allProducts.filter(p => {
      if (!p.subcategoryId) return false;
      return p.subcategoryId.toString() === fireSafetySubcategory._id.toString();
    });

    console.log(`\n✅ Products with correct Fire Safety subcategoryId: ${productsWithCorrectId.length}`);
    
    // Get details of all Fire Safety products
    const allFireSafetyProducts = allProducts.filter(p => {
      if (!p.subcategoryId) return false;
      
      const subId = p.subcategoryId.toString();
      const targetId = fireSafetySubcategory._id.toString();
      
      return subId === targetId;
    });

    const productDetails = allFireSafetyProducts.map(p => ({
      name: p.name,
      isActive: p.isActive,
      subcategoryId: p.subcategoryId?.toString(),
      subcategoryIdType: typeof p.subcategoryId,
      subcategoryIdIsObjectId: p.subcategoryId instanceof ObjectId,
      categoryId: p.categoryId?.toString(),
      slug: p.slug || null,
      createdAt: p.createdAt,
    }));

    console.log('\n📝 Fire Safety Products Details:');
    productDetails.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log(`   Active: ${p.isActive}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Subcategory ID: ${p.subcategoryId}`);
      console.log(`   Type: ${p.subcategoryIdType}`);
    });

    // Check for products that might have the wrong ID type
    const productsWithStringId = allProducts.filter(p => {
      return p.subcategoryId && typeof p.subcategoryId === 'string';
    });

    console.log(`\n⚠️ Products with STRING subcategoryId: ${productsWithStringId.length}`);
    if (productsWithStringId.length > 0) {
      console.log('   Products:', productsWithStringId.map(p => p.name).join(', '));
    }

    // Check for inactive Fire Safety products
    const inactiveFireSafety = allFireSafetyProducts.filter(p => !p.isActive);
    console.log(`\n⚠️ Inactive Fire Safety products: ${inactiveFireSafety.length}`);
    if (inactiveFireSafety.length > 0) {
      console.log('   Products:', inactiveFireSafety.map(p => p.name).join(', '));
    }

    console.log('\n🔍 === DIAGNOSTIC END ===\n');

    return NextResponse.json({
      success: true,
      fireSafetySubcategory: {
        id: fireSafetySubcategory._id.toString(),
        name: fireSafetySubcategory.name,
        categoryId: fireSafetySubcategory.categoryId?.toString(),
      },
      stats: {
        totalProducts: allProducts.length,
        productsWithCorrectId: productsWithCorrectId.length,
        activeWithCorrectId: productsWithCorrectId.filter(p => p.isActive).length,
        inactiveWithCorrectId: productsWithCorrectId.filter(p => !p.isActive).length,
        productsWithStringId: productsWithStringId.length,
      },
      products: productDetails.sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    console.error('Error in diagnostic:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run diagnostic',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
