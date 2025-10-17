import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * List all subcategories to find the correct Fire Safety name
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

    const categoriesCollection = await getCollection('categories');
    
    // Get all subcategories
    const allSubcategories = await categoriesCollection.find({
      isCategory: false,
    }).toArray();

    console.log('\n📋 === ALL SUBCATEGORIES ===\n');
    
    const subcategoryList = allSubcategories.map(sub => ({
      id: sub._id.toString(),
      name: sub.name,
      href: sub.href,
      categoryId: sub.categoryId?.toString(),
      visible: sub.visible,
      order: sub.order,
    }));

    subcategoryList.forEach((sub, i) => {
      console.log(`${i + 1}. "${sub.name}"`);
      console.log(`   ID: ${sub.id}`);
      console.log(`   href: ${sub.href}`);
      console.log(`   Visible: ${sub.visible}`);
    });

    // Find Fire Safety variations
    const fireSafetyVariations = allSubcategories.filter(sub => 
      sub.name.toLowerCase().includes('fire') && 
      sub.name.toLowerCase().includes('safety')
    );

    console.log('\n🔥 Fire Safety variations found:', fireSafetyVariations.length);
    fireSafetyVariations.forEach(sub => {
      console.log(`   - "${sub.name}" (ID: ${sub._id.toString()})`);
    });

    return NextResponse.json({
      success: true,
      totalSubcategories: allSubcategories.length,
      subcategories: subcategoryList.sort((a, b) => a.name.localeCompare(b.name)),
      fireSafetyVariations: fireSafetyVariations.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        href: sub.href,
      })),
    });
  } catch (error) {
    console.error('Error listing subcategories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list subcategories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
